import * as gameText from '../resources/text/gameText.js';
import { isIOS, isIPad13, isMobile, isTablet } from 'react-device-detect';
import { Device } from "../models/index.js";

/**
 * Logic to determine board sizes for Easy, Medium, and Hard levels. Also sets max Custom board settings.
 * Board sizes are also dependent on device type (desktop, tablet, or phone).
 * This is to accomodate the different screen sizes and to avoid horizontal scrolling (which is not a good user 
 * experience and can result in the Browser accidently moving back or foward a page).
 * Devices tested to determine these values were Mac Desktop, Windows Desktop, Android Phone, iPhone, and iPad
 * Max custom board sizes are set to adhere to the above and also ensure the application is still responsive.
 * Free space on either side of the board is ensured to allow for horiztonal scrolling, using touch, without
 * having to touch the board and accidently reveal a square.
 * 
 * The maximum number of board squares that fitted horizontally, allowing for some touch space either side, are as follows:
 * 
 *   Mac, Windows:  45
 *   iPhone, Android: 9
 *   iPad:  20
 */

/**
 * Function to return our game parameters (board size and mime density) for a set difficuly level and device.
 * Reasons for device choices are explained above.
 * @param {Number value representing the game difficulty desired} difficulty 
 * @returns 3 value array representing height, width, and number of mimes
 */
export function getGameSettings(difficulty) {
  var height, width, numOfMimes;

  // Notes: A tablet will return true for both isTablet and isMobile
  //        iPad13's were at some stage, perhaps still, not returning true for isTablet

  switch (difficulty) {

    // Medium Difficulty: 16% Mime Density
    case 2:

      // Mobile
      if (isMobile && !(isTablet || isIPad13)) {
        height = 13;
        width = 9;
        numOfMimes = 18;
      }

      // Desktop or Tablet
      else {
        height = 16;
        width = 16;
        numOfMimes = 40;
      }

      break;

    // Hard Difficulty: 20% Mime Density
    case 3:

      // Tablet
      if (isTablet || isIPad13) {
        height = 20;
        width = 20;
        numOfMimes = 80;
      }

      // Mobile
      else if (isMobile) {
        height = 14;
        width = 9;
        numOfMimes = 25;
      }

      // Desktop
      else {
        height = 16;
        width = 30;
        numOfMimes = 99;
      }

      break;

    // Easy or Default Difficulty: 12% Mime Density
    default:

      // Mobile, Tablet, or Desktop
      height = 9;
      width = 9;
      numOfMimes = 10;

      break;
  }

  // Return 3 value array
  return [height, width, numOfMimes];
}

/**
 * Function to return the max dimensions for a custom board, based on device type
 * Max board sizes chosen and tested to ensure good performance and user experience regardless of size
 * Reasons for device choices are explained above
 * @returns 2 value array representing max height and width allowed
 */
export function getMaxCustomHeightWidth() {
  // Max Mac and Windows Desktop Size
  var maxHeight = 20;
  var maxWidth = 45;

  // Max iPhone and Android Phone Size
  if (isMobile && !(isTablet || isIPad13)) {
    maxHeight = 100;
    maxWidth = 9;
  }
  // Max iPad and Android Tablet size
  else if (isTablet || isIPad13) {
    maxHeight = 45;
    maxWidth = 20;
  }

  // Return 2 value array
  return [maxHeight, maxWidth];
}

/**
 * Function to return a string representation of the difficulty level
 * @param {Number value representing the game difficulty desired} difficulty 
 * @returns String representation of the difficulty level
 */
export function getDifficultyString(difficulty) {
  if (difficulty === 1) {
    return gameText.difficultyEasy;
  }
  else if (difficulty === 2) {
    return gameText.difficultyMedium;
  }
  else if (difficulty === 3) {
    return gameText.difficultyHard;
  }
  else {
    return gameText.difficultyCustom;
  }
}

/**
 * Function to get user's device type
 * @returns Device type enum: Device.MOBILE, Device.TABLET, Device.DESKTOP
 */
export function getDeviceType() {
  if (isTablet || isIPad13) {
    return Device.TABLET;
  }
  else if (isMobile || isIOS) {
    return Device.MOBILE;
  }
  else {
    return Device.DESKTOP;
  }
}

/**
 * Funtion to get the time elapsed in human readable minutes (if applicable) and seconds
 * @param {Time in milliseconds} timeElapsedMs 
 * @param {boolean} [alwaysShowMinutes=true]
 * @returns Time elapsed string
 */
export function getTimeElapsedString(timeElapsedMs, alwaysShowMinutes = true) {

  // Convert time elapsed from millseconds into seconds
  let timeElapsedSeconds = timeElapsedMs / 1000;

  // Calculate how many minutes, floored to the nearest integer, have elapsed
  let minutes = Math.floor(timeElapsedSeconds / 60);

  // Calculate how many seconds, floored to the nearest integer, have elapsed
  let seconds = Math.floor(timeElapsedSeconds % 60);

  // If we have minutes or the flag is set to always display them return a minutes and seconds format
  if (alwaysShowMinutes || minutes > 0) {
    // Create the human readable minutes and seconds elapsed string
    let secondsString = (seconds < 10) ? "0" + seconds : seconds;

    // Return the human readable string
    return minutes + ":" + secondsString;
  }
  // Else return just a seconds format
  else {
    // Return the human readable string
    return seconds.toString();
  }
}

/**
 * Function to create a row of data
 * @param {Table position} position
 * @param {Username of player} user
 * @param {Time taken in milliseconds} time
 * @param {EpochTimeStamp in seconds} date
 * @param {Type of device game was played on} deviceType
 * @param {Device locale} locale
 * @param {Previous rows time for comparison} lastTime
 * @param {Database ID} id
 * @returns Row for table display
 */
export function createDataRow(position, user, time, date, deviceType, locale, lastTime, id) {
  // Convert the time milliseconds into a string
  var timeString = time.toString();
  // Get the time string in human readable format in minutes (if applicable) and seconds
  var timeHRString = getTimeElapsedString(time, false);

  // If we have a time whose seconds match the last time add the first decimal of millseconds
  if (lastTime && Math.floor(lastTime / 1000) === Math.floor(time / 1000)) {
    timeHRString = timeHRString + "." + timeString[timeString.length - 3];
  }

  // If the times still match add the second decimal of millseconds
  if (lastTime && Math.floor(lastTime / 100) === Math.floor(time / 100)) {
    timeHRString = timeHRString + timeString[timeString.length - 2];
  }

  // If the times still match add the third decimal of millseconds
  if (lastTime && Math.floor(lastTime / 10) === Math.floor(time / 10)) {
    timeHRString = timeHRString + timeString[timeString.length - 1];
  }

  // Create the data row
  return createData(
    // Result position
    position,
    // User name
    user,
    // Time taken in minutes (if applicable) and seconds string format
    timeHRString,
    // Date in localized format
    convertEpochToString(date, locale),
    // Device type used with first letter capitalized
    getDeviceTypeTableString(deviceType),
    // The database id
    id,
    // Time taken in millisecond format
    time
  );
}

/**
 * Function to create a the data object of data
 * @param {Table position} position
 * @param {Username of player} user
 * @param {Human readable time taken string} time
 * @param {Date game was completed} date
 * @param {Type of device game was played on} device
 * @param {Database ID} id
 * @param {Time taken in milliseconds} timeMs
 * @returns Row for table display
 */
export function createData(position, user, time, date, device, id, timeMs) {
  return { position, user, time, date, device, id, timeMs };
}

/**
 * Function to save personal data to local storage if it beats the previous personal best
 * @param {object} scoreData
 */
export function updatePersonalBestTime(scoreData) {
  // Get the current personal best time for the supplied level
  var pbTime = localStorage.getItem(getPersonalBestTimeKey(scoreData.level));

  console.log(pbTime, scoreData.time, isNaN(pbTime));

  // If we have no personal best time for the supplied level or the new time
  // is better then save the new time.
  if (pbTime === null || pbTime === "" || isNaN(pbTime) || scoreData.time < Number(pbTime)) {
    console.log("save time");
    savePersonalBestTime(scoreData);
  }
}

/**
 * Function to get the personal best data row for display
 * @param {string} level
 */
export function getPersonalBestDataRow(level) {
  // Get the current personal best time
  var pbTime = localStorage.getItem(getPersonalBestTimeKey(level));

  // Get the current personal best date
  var pbDate = localStorage.getItem(getPersonalBestDateKey(level));

  console.log(pbTime, pbDate);

  // If we do not have personal best data, or it is invalid, return a placeholder row
  if (!pbTime || !pbDate || isNaN(pbTime) || isNaN(pbDate)) {
    return createData("PB");
  }

  return createDataRow(
    "PB",
    "Personal Best",
    pbTime,
    pbDate,
    getDeviceTypeTableString(getDeviceType()),
    getLocale()
  );
}

/**
 * Function to get the user's browser's preferred locale
 * @returns Browser preferred locale
 */
export function getLocale() {
  return (navigator && navigator.language) || "en-US";
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
 * Function to update the device type enum to have a capital first letter
 * @param {Device enum} deviceType
 * @returns Uppercase first letter device type
 */
function getDeviceTypeTableString(deviceType) {
  // Device type used with first letter capitalized
  return deviceType[0].toUpperCase() + deviceType.slice(1);
}

/**
 * Function to save personal best data to local storage
 * @param {object} scoreData
 */
function savePersonalBestTime(scoreData) {
  console.log(scoreData.time, scoreData.date);
  // Save the personal best time to local storage
  localStorage.setItem(getPersonalBestTimeKey(scoreData.level), scoreData.time);
  // Save the personal best time to local storage
  localStorage.setItem(getPersonalBestDateKey(scoreData.level), scoreData.date);
}

/**
 * Function to get personal best time storage key
 * @param {string} level
 * @returns local storage key
 */
function getPersonalBestTimeKey(level) {
  return getPersonalBestKey(level, "time");
}

/**
 * Function to get personal best date storage key
 * @param {string} level
 * @returns local storage key
 */
function getPersonalBestDateKey(level) {
  return getPersonalBestKey(level, "date");
}

/**
 * Function to get personal best storage keys
 * @param {string} level
 * @param {string} dataType
 * @returns local storage key
 */
function getPersonalBestKey(level, dataType) {
  return "apb_" + level + "_" + dataType + "_key"
}

export const unknownUser = "Unknown";

export const usernameLSKey = "mimesweepUser";

export const highScorePositions = 10;