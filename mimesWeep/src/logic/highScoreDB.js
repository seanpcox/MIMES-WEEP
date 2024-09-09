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
  // Persist the store data
  await DataStore.save(
    new Todo(scoreData)
  );
}

/**
 * Function to get the top ten results from the DB
 * @param {Game difficulty level} level 
 * @param {Period: DAY, MONTH, ALL} period 
 * @param {Callback method to load the rows into} callback
 * @param {The max number of results to return} resultLimit
 */
export async function getTopResults(level, period, callback, resultLimit = 10) {

  function createData(position, user, time, date) {
    return { position, user, time, date };
  }

  await DataStore.query(
    Todo,
    (hs) => hs.and(hs => [
      hs.level.eq(level),
      hs.datePeriod.eq(period)
    ]),
    {
      sort: (s) => s.time(SortDirection.ASCENDING),
      limit: resultLimit
    }
  ).then((results) => {
    var rows = [];

    // Loop through every square on the board
    for (var i = 0; i < resultLimit; i++) {
      if (i + 1 <= results.length) {
        rows.push(createData(i + 1, results[i].user, settings.getTimeElapsedString(results[i].time), convertEpochToString(results[i].date)));
      } else {
        rows.push(createData(i + 1, "012345678901", "", ""));
      }
    }

    callback(rows);
  });
}

export function convertEpochToString(timeEpochSeconds) {
  var date = new Date(timeEpochSeconds * 1000);

  let formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour12: false
  }).format(date);

  return formattedDate;
}