import * as dsConfig from '../resources/config/datastore.js';
import * as gameSettings from '../logic/gameSettings.js';
import * as scoreLogic from './scoreLogic.js';
import { Amplify } from 'aws-amplify';
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { Period } from "../models/index.js";
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
* Function to determine if the user's time lists in a high score position in any of our score time periods or personal bests
* Go through each time period one by one, starting at All Time and ending at Daily.
* The highest ranked period (with All Time being the highest and Daily being the lowest) is the one that we
* display when opening the new high score dialog. However all periods will be saved and all periods will have
* their username updated if the user changes it for the highest period in the dialog.
* We also update any personal bests achieved through this function. If no high score but a personal best we will also open
* the high score dialog, at the highest period a personal best was achieved at.
*
* @param {The user's score data} scoreData
* @param {Callback method to open the dialog if the user got a high score position and/or personal best} openDialogCallback
* @param {Callback method to set the new score DB data if the user got a high score position/s} setNewHighScoreDataCallback
* @param {Callback method to set the new personal best periods achieved, if any} setPersonalBestPeriodsCallback
*/
export async function saveScores(scoreData, openDialogCallback, setNewHighScoreDataCallback, setPersonalBestPeriodsCallback) {

  // Record if we scored a high score in any period, so we know whether to open the high score dialog
  let isHighScoreAchieved = false;

  // Try to access the data store
  try {

    // Loop through each period we support
    for (const period of gameSettings.periodsInUse) {

      // Set the period on the score data, which will be saved to the database
      scoreData.datePeriod = period;

      // Query the datastore for the high scores in this period
      const existingHighScores = await getTopResultsQuery(scoreData.level, period);

      // Calculate the high score position for the current game time, if it didn't place we are returned -1
      let position = getHighScorePosition(existingHighScores, scoreData.time);

      // If the user got an all time high score then we save the high score in the database and continue processing
      if (position > 0) {

        // We have achieved a high score, so set our boolean
        isHighScoreAchieved = true;

        // Persist the high score data
        let newHighScore = await DataStore.save(new Todo(scoreData));

        // Execute our callbacks to set the high score data in our calling component, for use with high score dialog
        setCallbackScoreRefs(setNewHighScoreDataCallback, newHighScore.id, newHighScore.datePeriod, newHighScore.user);

        // Get the high score that will be replaced by this new high score, if there is one
        let usurpedHighScore = getUsurpedHighScoreRow(existingHighScores);

        // Delete any now usurped high scores, if we have one. This can run in the background.
        deleteUsurperdHighScores(usurpedHighScore);

        // Delete any expired high scores for this period. This can run in the background.
        deleteExpiredHighScores(period, scoreData.level);
      }
    }
  }
  // If we get an exception on data store access then catch it and print to console, then continue to personal bests
  // If we can't show high scores we still want to show personal bests.
  catch (exception) {
    console.log("Exception trying to access data store for high score retrieval and save operations.")
    console.log(exception.message);
  }

  // Record any personal bests we achieved
  let isPersonalBest = scoreLogic.updatePersonalBestTimeWithScoreData(scoreData, setPersonalBestPeriodsCallback);

  // If we saved a high score or if we achieved a personal best we want to open the high score dialog
  if (isHighScoreAchieved || isPersonalBest) {
    openDialogCallback(true);
  }
}

/**
 * Function to set the high score data in our parent component, for use when opening the high score dialog
 * @param {function} setNewHighScoreDataCallback
 * @param {string} id
 * @param {Period} datePeriod
 * @param {string} user
 */
function setCallbackScoreRefs(setNewHighScoreDataCallback, id, datePeriod, user) {

  // Set the high score row id to highlight
  setNewHighScoreDataCallback(scoreLogic.createNewHighScoreData(id, datePeriod, user));
}

/**
 * Function to determine the high score position, if any, of our user's score versus what is in the database
 * @param {Database high scores} results
 * @param {User's game time} gameTime
 * @returns High score position, or -1 if did not place
 */
function getHighScorePosition(results, gameTime) {

  // If no results then score is high score position 1, else assume the user did not place to start
  var position = (results.length === 0) ? 1 : -1

  // Loop through the results to see if the user time placed
  for (var i = 0; i < results.length; i++) {

    // Check if the user's time is better than each time in our high score list, fastest time first
    if (gameTime < results[i].time) {

      // High score positions start at 1
      position = i + 1;

      // If the user time has already placed we can break out of the loop
      break;
    }
  }

  // If we did not find a position but there are not enough results to fill our limit
  // then we have a high score at the next available spot.
  if (position <= 0 && results.length < gameSettings.highScorePositions) {
    position = results.length + 1;
  }

  // Return the position we found
  return position;
}

/**
 * Function to get the database high score that has been usurped by our new high score, if any
 * @param {Database high scores} results
 * @returns Database high score to be usurped, if any
 */
function getUsurpedHighScoreRow(results) {

  // Get the replaced high score, if there is one
  var usurpedHighScore;

  // Get the last high score in the list if a new high score has been achieved
  if (results.length === gameSettings.highScorePositions) {
    usurpedHighScore = results[results.length - 1];
  }

  // Return the usurped high score if one
  return usurpedHighScore;
}

/**
 * Function to get the high score results from the DB, and personal best result from local storage,
 * and format them into rows for table display.
 * @param {Game difficulty level} level
 * @param {Period: DAY, MONTH, ALL} period
 * @param {Callback method to load the rows into} callback
 */
export async function getTopResults(level, period, callback) {

  // Rows to supply to our callback function
  var rows = [];

  // Add the personal best time at the start (so user doesn't have to scroll to very bottom)
  rows.push(scoreLogic.getPersonalBestDataRow(level, period));

  // Try to access the data store
  try {

    // Query the datastore for the top results
    await getTopResultsQuery(level, period)
      // Executed once results have been retrieved
      .then((results) => {

        // Loop through all results, if any
        if (results) {
          for (var i = 0; i < results.length; i++) {
            // Add the data to the row array
            rows.push(
              scoreLogic.createDataRow(
                // Result position starts at 1
                i + 1,
                results[i].user,
                results[i].time,
                results[i].date,
                results[i].deviceType,
                results[i].id)
            );
          }
        }

      });
  }
  // If we get an exception on data store access then catch it and print to console, then continue to personal bests
  // If we can't show high scores we still want to show personal bests.
  catch (exception) {
    console.log("Exception trying to access data store for high score retrieval.")
    console.log(exception.message);
  }

  // Supply the rows to our callback function
  callback(rows);
}

/**
 * Function that returns a datastore query to get the top results for the
 * specified difficulty level and win period.
 * @param {Difficulty level string} level
 * @param {Win period enum} period
 * @returns Datastore query
 */
function getTopResultsQuery(level, period) {
  var dateAfterEpochSeconds = 0;

  // If we are working with a period other than ALL then limit the query by date
  if (period !== Period.ALL) {
    dateAfterEpochSeconds = getEpochSecondTimeInPast(getNumberOfDaysInPeriod(period));
  }

  // Execute the query
  return DataStore.query(
    Todo,
    (hs) => hs.and(hs => [
      // Apply the supplied level and period conditions
      hs.level.eq(level),
      hs.datePeriod.eq(period),
      // Apply the current device type, don't think it's fair to compare scores across them
      hs.deviceType.eq(gameSettings.deviceType),
      hs.date.ge(dateAfterEpochSeconds)
    ]),
    {
      // Sort by shortest time first, followed by oldest date first (which will break any ties)
      sort: (s) => s.time(SortDirection.ASCENDING).date(SortDirection.ASCENDING),
      // Limit the results returned to the supplied amount
      limit: gameSettings.highScorePositions
    }
  );
}

/**
 * Delete any high score entries that have been usurped / replaced by a new high score
 * @param {DB entry for high score to be usurped} usurpedHighScore
 * @param {Game difficulty level} level
 * @param {Period: DAY, MONTH, ALL} period
 */
function deleteUsurperdHighScores(usurpedHighScore) {

  // If we have no usurped high score then return
  if (usurpedHighScore === undefined || usurpedHighScore === null) {
    return;
  }

  // Note we need date as well as time here, as date is the tie breaker in if we have tied high score times
  // High scores scored earlier win out in these cases
  DataStore.delete(Todo,
    (hs) => hs.and(hs =>
      [
        hs.time.ge(usurpedHighScore.time),
        hs.date.ge(usurpedHighScore.date),
        hs.level.eq(usurpedHighScore.level),
        hs.datePeriod.eq(usurpedHighScore.datePeriod),
        // High scores are device type specific, as don't think its fair to compare times between them
        hs.deviceType.eq(gameSettings.deviceType)
      ]
    ));
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
 * Function to delete high scores that have now expired for the supplied period and level
 * @param {Game difficulty level} level
 * @param {Period: DAY, MONTH, ALL} period
 */
function deleteExpiredHighScores(period, level) {

  // We never delete all time high scores so return here
  if (level === Period.ALL) {
    return;
  }

  DataStore.delete(Todo,
    (hs) => hs.and(hs =>
      [
        hs.date.lt(getEpochSecondTimeInPast(getNumberOfDaysInPeriod(period))),
        hs.level.eq(level),
        hs.datePeriod.eq(period),
        // High scores are device type specific, as don't think its fair to compare times between them
        hs.deviceType.eq(gameSettings.deviceType)
      ]
    ));
}

/**
 * Function to get the number of days in a given period
 * @param {Period} period
 * @returns Number of days in the given period, else -1 if all time
 */
function getNumberOfDaysInPeriod(period) {
  if (period === Period.DAY) {
    return 1;
  } else if (period === Period.MONTH) {
    return 30;
  }

  return -1;
}

/**
 * Function to get the epoch time in seconds n days ago
 * @param {number} numOfDaysBack
 * @returns Epoch time in seconds 24 hours ago
 */
function getEpochSecondTimeInPast(numOfDaysBack) {
  return Math.floor((Date.now() - (86400000 * numOfDaysBack)) / 1000);
}