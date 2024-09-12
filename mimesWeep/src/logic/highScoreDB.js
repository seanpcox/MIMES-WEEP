import * as dsConfig from '../resources/config/datastore.js';
import * as scoreLogic from './scoreLogic.js';
import { Amplify } from 'aws-amplify';
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { Todo } from "../models/index.js";

/**
 * Function to initialize the data store
 */
export async function init() {
  // Configure the data store with our settings
  Amplify.configure(dsConfig.settings);
  // Start the data store
  await DataStore.start().then(() => {
    // Clear the local data store once data store started
    clearLocalData();
  });
}

/**
 * Function to clear the local data store
 */
async function clearLocalData() {
  // Clear the local data store
  await DataStore.clear().then(() => {
    // Perform a query, first query always returns nothing (seems to be stanard for Amplify data store)
    performDummyQuery();
  })
}

/**
 * Function to perform a dummy query
 * The first data store query seems to always return an empty result nothing. This seems to be standard 
 * for Amplify data store from what I have read online. Therefore we perform this query on startup so the 
 * first genunie application query will work.
 */
async function performDummyQuery() {
  // Perform a query for one result from the data store
  await DataStore.query(Todo, Predicates.ALL, { limit: 1 });
}

/**
 * Function to determine if the user's time lists in a high score position 
 * and to persist the result and execute the callback if they do.
 * @param {The user's score data} scoreData
 * @param {Callback method to open the dialog if the user got a high score position} openDialogCallback
 * @param {Callback method to set the highlighted row if the user got a high score position} setHighlightRowCallback
 * @param {Callback method to set the personal best row highlighted} setPersonalBestRowHighlighed
 * @param {The number of high score position} highScoreLimit
 */
export async function saveIfHighScore(scoreData, openDialogCallback, setHighlightRowCallback,
  setPersonalBestRowHighlighed, isPB, highScoreLimit = scoreLogic.highScorePositions) {
  // Query the datastore for the top results
  await getTopResultsQuery(scoreData.level, scoreData.datePeriod, highScoreLimit)
    // Executed once results have been retrieved 
    .then((results) => {
      // If no results user is position 1, else assume the user did not place to start
      var position = (results.length === 0) ? 1 : -1

      // Loop through the results to see if the user time placed
      for (var i = 0; i < results.length; i++) {
        // Check if the user's time is better than each time in our high score list, fastest time first
        if (scoreData.time < results[i].time) {
          // High score positions start at 1
          position = i + 1;
          // If the user time has already placed we can break out of the loop
          break;
        }
      }

      // If we did not find a position but there are not enough results to fill our limit
      // then we have a high score at the next available spot.
      if (position <= 0 && results.length < highScoreLimit) {
        position = results.length + 1;
      }

      // If the user placed then we save the highscore in the database and execute the callback function
      if (position > 0) {
        // Save the highscore in the database
        save(scoreData);
        // Set the highscore row position to highlight in the table
        setHighlightRowCallback(position);

        // Set whether we also want to highlight the personal best row
        if (isPB) {
          setPersonalBestRowHighlighed(true);
        } else {
          setPersonalBestRowHighlighed(false);
        }

        // Open the highscore dialog
        openDialogCallback(true);
      }
      // If the user did not place but scored a personal best we also execute the callback function
      else if (isPB) {
        // Set no highscore row position highlighted
        setHighlightRowCallback(-1);
        // Set the personal best row to highlight, it is the second row we add to our highscore data
        setPersonalBestRowHighlighed(true);
        // Open the highscore dialog
        openDialogCallback(true);
      }
    });
}

/**
 * Function to save the high score data
 * @param {Score data for game} scoreData 
 */
async function save(scoreData) {
  // Persist the high score data
  await DataStore.save(
    new Todo(scoreData)
  );
}

/**
 * Function to get the high score results from the DB, and personal best result from local storage,
 * and format them into rows for table display.
 * @param {Game difficulty level} level
 * @param {Period: DAY, MONTH, ALL} period
 * @param {Callback method to load the rows into} callback
 * @param {The max number of results to return} highScoreLimit
 */
export async function getTopResults(level, period, callback, highScoreLimit = scoreLogic.highScorePositions) {

  // Query the datastore for the top results
  await getTopResultsQuery(level, period, highScoreLimit)
    // Executed once results have been retrieved 
    .then((results) => {
      // Rows to supply to our callback function
      var rows = [];

      // Store the previous results time to determine if we have a tie in seconds
      var lastTime;

      // Loop until we reach the high score position limit supplied
      for (var i = 0; i < highScoreLimit; i++) {
        // If we have data for this high score position then use it
        if (i + 1 <= results.length) {
          // Add the data to the row array
          rows.push(
            scoreLogic.createDataRow(
              // Result position starts at 1
              i + 1,
              results[i].user,
              results[i].time,
              results[i].date,
              results[i].deviceType,
              lastTime,
              results[i].id)
          );

          // Record this time to use to test for a time tie with the next result
          lastTime = results[i].time;
        }
        // Else create an empty row placeholder for this high score position
        else {
          rows.push(scoreLogic.createData(i + 1));
        }
      }

      // Add the personal best time at the end
      rows.push(scoreLogic.getPersonalBestDataRow(level))

      // Supply the rows to our callback function
      callback(rows);
    });
}

/**
 * Function that returns a datastore query to get the top results for the
 * specified difficulty level and win period.
 * @param {Difficulty level string} level
 * @param {Win period enum} period
 * @param {Number of results} highScoreLimit
 * @returns Datastore query
 */
function getTopResultsQuery(level, period, highScoreLimit) {
  return DataStore.query(
    Todo,
    (hs) => hs.and(hs => [
      // Apply the supplied level and period conditions
      hs.level.eq(level),
      hs.datePeriod.eq(period)
    ]),
    {
      // Sort by shortest time first, followed by oldest date first (which will break any ties)
      sort: (s) => s.time(SortDirection.ASCENDING).date(SortDirection.ASCENDING),
      // Limit the results returned to the supplied amount
      limit: highScoreLimit
    }
  );
}

/**
 * Function to update the username of a high score entry
 * @param {ID of the original entry} id
 * @param {Username to update} username
 */
export async function updateUsername(id, username) {
  const original = await DataStore.query(Todo, id);

  if (original) {
    await DataStore.save(
      Todo.copyOf(original, updated => {
        updated.user = username
      })
    );
  }
}

/**
 * Function to delete all high score entries no longer required. These are those whose time 
 * is greater than the supplied time, or those that have an equal time but whose dates are later, 
 * for the specified difficulty level and win period.
 * @param {Time in milliseconds} time
 * @param {Date in epoch seconds} date
 * @param {Difficulty level string} level
 * @param {Win period enum} period
 */
export async function deleteDeprecatedScores(time, date, level, period) {
  await DataStore.delete(Todo,
    (hs) => hs.or(hs =>
      // Entries whose time is greater for the level and period
      [hs.and(hs =>
        [
          hs.time.gt(time),
          hs.level.eq(level),
          hs.datePeriod.eq(period)
        ]
      )],
      // Entries whose time is the same but date is later for the level and period
      [hs.and(hs =>
        [
          hs.time.eq(time),
          hs.date.gt(date),
          hs.level.eq(level),
          hs.datePeriod.eq(period)
        ]
      )]
    ));
}