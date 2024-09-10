import * as dsConfig from '../resources/config/datastore.js';
import * as settings from '../logic/gameSettings.js';
import { Amplify } from 'aws-amplify';
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { Todo } from "../models/index.js";

/**
 * Function to initialize the data store
 */
export async function init() {
  Amplify.configure(dsConfig.settings);
  DataStore.start()
  DataStore.clear().then(() => {
    DataStore.query(Todo, Predicates.ALL, { limit: 1 });
  });
}

/**
 * Function to determine if the user's time lists in a high score position 
 * and to persist the result and execute the callback if they do.
 * @param {The user's score data} scoreData
 * @param {Callback method to open the dialog if the user got a high score position} openDialogCallback
 * @param {Callback method to set the highlighted row if the user got a high score position} setHighlightRowCallback
 * @param {The max number of results to check} highScoreLimit
 */
export async function saveIfHighScore(scoreData, openDialogCallback, setHighlightRowCallback, highScoreLimit = 10) {
  // Query the datastore for the top results
  await DataStore.query(
    Todo,
    (hs) => hs.and(hs => [
      // Apply the supplied level and period conditions
      hs.level.eq(scoreData.level),
      hs.datePeriod.eq(scoreData.datePeriod)
    ]),
    {
      // Sort by shortest time first, followed by oldest date first (which will break any ties)
      sort: (s) => s.time(SortDirection.ASCENDING).date(SortDirection.ASCENDING),
      // Limit the results returned to the supplied amount
      limit: highScoreLimit
    }
  )
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

      // If the user placed then we execute the callback function
      if (position > 0) {
        save(scoreData);
        setHighlightRowCallback(position);
        openDialogCallback(true);
      }

    });
}

/**
 * Function to save the score data
 * @param {Score data for game} scoreData 
 */
async function save(scoreData) {
  // Persist the high score data
  await DataStore.save(
    new Todo(scoreData)
  );
}

/**
 * Function to get the top ten results from the DB and format them into rows for table display
 * @param {Game difficulty level} level 
 * @param {Period: DAY, MONTH, ALL} period 
 * @param {Callback method to load the rows into} callback
 * @param {The max number of results to return} highScoreLimit
 */
export async function getTopResults(level, period, callback, highScoreLimit = 10) {

  // Get the user's browser's preferred locale
  const locale = (navigator && navigator.language) || "en-US";

  /**
   * Function to create a row of data
   * @param {Function to create} position 
   * @param {Username of player} user 
   * @param {Time taken to complete the game} time 
   * @param {Date game was completed} date 
   * @param {Type of device game was played on} device 
   * @returns Row for table display
   */
  function createData(position, user, time, date, device, id) {
    return { position, user, time, date, device, id };
  }

  // Query the datastore for the top results
  await DataStore.query(
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
  )
    // Executed once results have been retrieved 
    .then((results) => {
      // Rows to supply to our callback function
      var rows = [];

      var lastTime;

      // Loop through to the result limit supplied
      for (var i = 0; i < highScoreLimit; i++) {
        // If we have data for the result position then use it
        if (i + 1 <= results.length) {
          console.log(results[i].date);
          // Convert the time milliseconds into a string
          var timeString = results[i].time.toString();
          // Get the time string in human readable format in minutes (if applicable) and seconds
          var timeHRString = settings.getTimeElapsedString(results[i].time, false);

          // If we have a time whose seconds match the last time add the first decimal of millseconds
          if (lastTime && Math.round(lastTime / 1000) === Math.round(results[i].time / 1000)) {
            timeHRString = timeHRString + "." + timeString[timeString.length - 3];
          }

          // If the times still match add the second decimal of millseconds
          if (lastTime && Math.round(lastTime / 100) === Math.round(results[i].time / 100)) {
            timeHRString = timeHRString + timeString[timeString.length - 2];
          }

          // If the times still match add the third decimal of millseconds
          if (lastTime && Math.round(lastTime / 10) === Math.round(results[i].time / 10)) {
            timeHRString = timeHRString + timeString[timeString.length - 1];
          }

          // Record this time to use to test for a match with the next result
          lastTime = results[i].time;

          // Add the data to the row array
          rows.push(
            createData(
              // Result position starts at 1
              i + 1,
              // User name
              results[i].user,
              // Time taken in minute (if applicable) and second format
              timeHRString,
              // Date in localized format
              convertEpochToString(results[i].date, locale),
              // Device type used with first letter capitalized
              results[i].deviceType[0].toUpperCase() + results[i].deviceType.slice(1),
              // The database id
              results[i].id
            ));
        }
        // Else create a row placeholder
        else {
          rows.push(createData(i + 1, "", "", "", ""));
        }
      }

      // Supply the rows to our callback function
      callback(rows);
    });
}

/**
 * Function to create our epoch, in seconds, to a localized data string
 * @param {Date in epoch seconds} timeEpochSeconds 
 * @param {User's locale string} [locale="en-US"]
 * @returns Localized date string
 */
function convertEpochToString(timeEpochSeconds, locale = "en-US") {
  // Date is expecting milliseconds so multiply seconds by 1000
  var date = new Date(timeEpochSeconds * 1000);

  // Format for our date string, using user's browser locale
  // eslint-disable-next-line no-undef
  let formattedDate = new Intl.DateTimeFormat(locale, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour12: false
  }).format(date);

  // Return the date string
  return formattedDate;
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
 * Function to delete a high score entry
 * @param {ID of the entry} id
 */
export async function deleteScore(id) {
  await DataStore.delete(Todo, id);
}