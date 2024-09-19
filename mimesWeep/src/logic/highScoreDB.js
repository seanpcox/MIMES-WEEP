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
 * Function to determine if the user's time lists in a high score position in any of our score time periods
 * Go through each time one by one, starting at All Time and ending at Daily.
 * The highest ranked period (with All Time being the highest and Daily being the lowest) is the one that we
 * display when opening the new high score dialog. However all periods will be saved and all periods will have
 * their username updated if the user changes it for the highest period in the dialog.
 *
 * Note: I don't like the way this is whole operation is nested, there is too much code duplicate.
 * Perhaps there is another way to wait for datastore operations to complete versus having to put
 * a dependant next step in the "then" execution block. Or perhaps we could use recursion to do this.
 * For now we will leave it though.
 *
 * @param {The user's score data} scoreData
 * @param {Callback method to open the dialog if the user got a high score position and/or personal best} openDialogCallback
 * @param {Callback method to set the new score DB data if the user got a high score position/s} setNewHighScoreDataCallback
 * @param {Boolean indicating if we scored and personal bests with this score} isPersonalBest
 */
export async function saveHighScores(scoreData, openDialogCallback, setNewHighScoreDataCallback, isPersonalBest) {

  // Query the datastore for the all time high scores
  await getTopResultsQuery(scoreData.level, scoreData.datePeriod)

    // Executed once results have been retrieved 
    .then((results) => {

      // Calculate the all time high score position for the game time, if it didn't place we are returned -1
      var position = getHighScorePosition(results, scoreData.time);

      // If the user got an all time high score then we save the high score in the database and continue processing
      if (position > 0) {

        // Get the replaced all time high score, if there is one
        var deprecatedHighScore = getDeprecatedHighScoreRow(results);

        // Save the all time high score in the database, delete any deprecated all time high scores, and continue processing
        saveAllTimeScore(scoreData, deprecatedHighScore, openDialogCallback, setNewHighScoreDataCallback, isPersonalBest);
      }
      // If the user did not get an all time high score then we move on to see if they got a daily high score
      else {

        // If the user did not get an all time high score then check to see if they got a daily high score
        saveHighScoreDailyLevel(scoreData, openDialogCallback, setNewHighScoreDataCallback, false, isPersonalBest);
      }
    });
}

/**
 * Function to save the all time high score data, and delete any all time high score entries no longer required
 * @param {Score data for game} scoreData
 * @param {DB data for the now deprecated high score} deprecatedHighScore
 * @param {Callback method to open the dialog if the user got a high score position} openDialogCallback
 * @param {Callback method to set the new score DB data if the user got a high score position/s} setNewHighScoreDataCallback
 * @param {Boolean indicating if we scored and personal bests with this score} isPersonalBest
 */
async function saveAllTimeScore(scoreData, deprecatedHighScore, openDialogCallback, setNewHighScoreDataCallback, isPersonalBest) {

  // Persist the all time high score data
  await DataStore.save(
    new Todo(scoreData)
  )
    // Executed once save has been completed
    .then((savedScore) => {

      // Execute our callbacks to set the all time high score data in our calling component, for use with high score dialog
      setCallbackScoreRefs(setNewHighScoreDataCallback, savedScore.id, savedScore.datePeriod, savedScore.user);

      // If we have an all time high score to deprecate
      if (deprecatedHighScore) {

        // Delete any now deprecated all time high scores. Note we don't need for this operation to finish before we can
        // continue. It can run in the background.
        getDeleteDeprecatedQuery(deprecatedHighScore.time, deprecatedHighScore.date, scoreData.level, scoreData.datePeriod);
      }

      // Now we move on to see if the user also got a daily high score
      saveHighScoreDailyLevel(scoreData, openDialogCallback, setNewHighScoreDataCallback, true, isPersonalBest);
    });
}

/**
 * Function to check if the user got a daily high score
 * @param {Score data for game} scoreData
 * @param {Callback method to open the dialog if the user got a high score position} openDialogCallback
 * @param {Callback method to set the new score DB data if the user got a high score position/s} setNewHighScoreDataCallback
 * @param {Boolean representing if we have already saved a high score at a previous period} savedPreviousHS
 * @param {Boolean indicating if we scored and personal bests with this score} isPersonalBest
 */
async function saveHighScoreDailyLevel(scoreData, openDialogCallback, setNewHighScoreDataCallback, savedPreviousHS, isPersonalBest) {

  // Set the score time period to daily
  scoreData.datePeriod = Period.DAY;

  // Query the datastore for the daily high scores
  await getTopResultsQuery(scoreData.level, scoreData.datePeriod)

    // Executed once results have been retrieved
    .then((results) => {

      // Calculate the daily high score position for the game time, if it didn't place we are returned -1
      var position = getHighScorePosition(results, scoreData.time);

      // If the user placed then we save the daily high score in the database and continue processing
      if (position > 0) {

        // Get the replaced daily high score, if there is one
        var deprecatedHighScore = getDeprecatedHighScoreRow(results);

        // Save the daily high score in the database, delete any deprecated daily high scores, and continue processing
        saveDailyHighScore(scoreData, deprecatedHighScore, openDialogCallback, setNewHighScoreDataCallback);
      }
      // Else the user did not get a daily high score
      else {

        // If we already saved a high score at a higher level then open the dialog
        // Note this condition is likely rare, but it may happen if there are less all time high score positions
        // than daily high score positions. Or if some DB cleanup causes this issue.
        // OR if we achieved a personal best we want to open the dialog also
        if (savedPreviousHS || isPersonalBest) {
          openDialogCallback(true);
        }
      }
    });
}

/**
 * Function to save the daily high score data, and delete any daily high score entries no longer required
 * @param {Score data for game} scoreData
 * @param {Score DB entry that has now been usurped by the new high score} deprecatedHighScore
 * @param {Callback method to open the dialog if the user got a high score position} openDialogCallback
 * @param {Callback method to set the new score DB data if the user got a high score position/s} setNewHighScoreDataCallback
 * @param {Boolean indicating if we scored and personal bests with this score} isPersonalBest
 */
async function saveDailyHighScore(scoreData, deprecatedHighScore, openDialogCallback, setNewHighScoreDataCallback) {
  // Persist the high score data
  await DataStore.save(
    new Todo(scoreData)
  )
    // Executed once save has been completed
    .then((savedScore) => {

      // Execute our callbacks to set the daily high score data in our calling component, for use with high score dialog
      setCallbackScoreRefs(setNewHighScoreDataCallback, savedScore.id, savedScore.datePeriod, savedScore.user);

      // If we have a daily high score to deprecate
      if (deprecatedHighScore) {

        // Delete any now deprecated daily high scores. Note we don't need for this operation to finish before we can
        // continue. It can run in the background.
        getDeleteDeprecatedQuery(deprecatedHighScore.time, deprecatedHighScore.date, scoreData.level, scoreData.datePeriod);
      }

      // Delete any daily scores over 24 hours at this level. This can also run in the background.
      deleteOldScores(scoreData.datePeriod, scoreData.level);

      // Open the high score dialog
      openDialogCallback(true);
    });
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
 * @returns Database high score for deprecation, if any
 */
function getDeprecatedHighScoreRow(results) {

  // Get the replaced high score, if there is one
  var deprecatedHighScore;

  // Get the last high score in the list if a new high score has been achieved
  if (results.length === gameSettings.highScorePositions) {
    deprecatedHighScore = results[results.length - 1];
  }

  // Return the deprecated high score if one
  return deprecatedHighScore;
}

/**
 * Function to get the high score results from the DB, and personal best result from local storage,
 * and format them into rows for table display.
 * @param {Game difficulty level} level
 * @param {Period: DAY, MONTH, ALL} period
 * @param {Callback method to load the rows into} callback
 */
export async function getTopResults(level, period, callback) {

  // Query the datastore for the top results
  await getTopResultsQuery(level, period)
    // Executed once results have been retrieved 
    .then((results) => {

      // Rows to supply to our callback function
      var rows = [];

      // Add the personal best time at the start (so user doesn't have to scroll to very bottom)
      rows.push(scoreLogic.getPersonalBestDataRow(level, period));

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

      // Supply the rows to our callback function
      callback(rows);
    });
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

function getDeleteDeprecatedQuery(time, date, level, datePeriod) {
  return DataStore.delete(Todo,
    (hs) => hs.and(hs =>
      [
        hs.time.ge(time),
        hs.date.ge(date),
        hs.level.eq(level),
        hs.datePeriod.eq(datePeriod),
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
 * Function to delete daily scores more than the supplied period old at the supplied difficulty level
 * @param {Period} period
 * @param {Difficulty level string} level
 */
async function deleteOldScores(period, level) {
  await DataStore.delete(Todo,
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