import * as dsConfig from '../resources/config/datastore.js';
import * as settings from '../logic/gameSettings.js';
import { Amplify } from 'aws-amplify';
import { DataStore, SortDirection } from "@aws-amplify/datastore";
import { Todo } from "../models/index.js";

/**
 * Function to setup datas tore
 */
export async function configure() {
  Amplify.configure(dsConfig.settings);
  start();
}

/**
 * Function to sync the data store
 */
export async function start() {
  await DataStore.start();
}

/**
 * Function to save the score data
 * @param {Score data for game} scoreData 
 */
export async function save(scoreData) {
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
 * @param {The max number of results to return} resultLimit
 */
export async function getTopResults(level, period, callback, resultLimit = 10) {

  // Get the user's browser's preferred locale
  const locale = (navigator && navigator.language) || "en";

  /**
   * Function to create a row of data
   * @param {Function to create} position 
   * @param {Username of player} user 
   * @param {Time taken to complete the game} time 
   * @param {Date game was completed} date 
   * @param {Type of device game was played on} device 
   * @returns Row for table display
   */
  function createData(position, user, time, date, device) {
    return { position, user, time, date, device };
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
      // Sort by shortest time first
      sort: (s) => s.time(SortDirection.ASCENDING),
      // Limit the results returned to the supplied amount
      limit: resultLimit
    }
  )
  // Executed once results have been retrieved 
  .then((results) => {
    // Rows to supply to our callback function
    var rows = [];

    // Loop through to the result limit supplied
    for (var i = 0; i < resultLimit; i++) {
      // If we have data for the result position then use it
      if (i + 1 <= results.length) {
        rows.push(
          createData(
            // Result position starts at 1
            i + 1, 
            // User name
            results[i].user,
            // Time taken in minute and second format
            settings.getTimeElapsedString(results[i].time),
            // Date in localized format
            convertEpochToString(results[i].date, locale), 
            // Device type used with first letter capitalized
            results[i].deviceType[0].toUpperCase() + results[i].deviceType.slice(1)
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
function convertEpochToString(timeEpochSeconds, locale="en-US") {
  // Date is expecting milliseconds so multiply seconds by 1000
  var date = new Date(timeEpochSeconds * 1000);

  // Format for our date string, using user's browser locale
  let formattedDate = new Intl.DateTimeFormat(locale, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour12: false
  }).format(date);

  // Return the date string
  return formattedDate;
}