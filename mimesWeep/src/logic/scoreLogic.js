import * as gameText from '../resources/text/gameText.js';
import * as settings from './gameSettings.js';

/**
 * Logic related to high scores and personal best times and display
 */

export const usernameLSKey = "mimesweepUser";

/**
 * Function to create a row of data
 * @param {Table position} position
 * @param {Username of player} user
 * @param {Time taken in milliseconds} time
 * @param {EpochTimeStamp in seconds} date
 * @param {Type of device game was played on} deviceType
 * @param {Previous rows time for comparison} lastTime
 * @param {Database ID} id
 * @returns Row for table display
 */
export function createDataRow(position, user, time, date, deviceType, lastTime, id) {
    // Convert the time milliseconds into a string, always show 3 post decimal to be consistent
    var timeHRString = (time / 1000).toFixed(3);

    // Create the data row
    return createData(
        // Result position
        position,
        // User name
        user,
        // Time taken in seconds string format
        timeHRString,
        // Date in localized format
        convertEpochToString(date),
        // Device type used with first letter capitalized
        getDeviceTypeTableString(deviceType),
        // The database id
        id,
        // Time taken in millisecond format
        time,
        // Date in epoch seconds format
        date
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
 * @param {Time taken in milliseconds} dateES
 * @returns Row for table display
 */
export function createData(position, user, time, date, device, id, timeMs, dateES) {
    return { position, user, time, date, device, id, timeMs, dateES };
}

/**
 * Function to save personal data to local storage if it beats the previous personal best
 * @param {object} scoreData
 * @returns True if a personal best, else False
 */
export function updatePersonalBestTimeWithScoreData(scoreData) {
    return updatePersonalBestTime(scoreData.level, scoreData.time, scoreData.date, scoreData.user);
}

/**
 * Function to save personal data to local storage if it beats the previous personal best
 * @param {string} level
 * @param {number} time
 * @param {number} date
 * @param {string} user
 * @returns True if a personal best, else False
 */
export function updatePersonalBestTime(level, time, date, user) {
    // Get the current personal best time for the supplied level
    var pbTime = localStorage.getItem(getPersonalBestTimeKey(level));

    // If we have no personal best time for the supplied level or the new time
    // is better then save the new time.
    if (pbTime === null || pbTime === "" || isNaN(pbTime) || time < Number(pbTime)) {
        savePersonalBestData(level, time, date, user);
        return true;
    }

    return false;
}

/**
 * Function to update the personal best time at this level
 * @param {string} level
 * @param {number} time
 * @param {number} date
 * @param {string} user
 */
export function updatePersonalBestName(level, time, date, user) {
    // Get the current personal best time for the supplied level
    var pbTime = localStorage.getItem(getPersonalBestTimeKey(level));

    // Get the current personal best date for the supplied level
    var pbDate = localStorage.getItem(getPersonalBestDateKey(level));

    // If we have no personal best time for the supplied level or the new time
    // is better then save the new time.
    if (time <= Number(pbTime) && date <= Number(pbDate)) {
        savePersonalBestData(level, time, date, user);
    }
}

/**
 * Function to get the personal best data row for display
 * @param {string} level
 */
export function getPersonalBestDataRow(level) {
    // Get the current personal best time for this level
    var pbTime = localStorage.getItem(getPersonalBestTimeKey(level));

    // Get the current personal best date for this level
    var pbDate = localStorage.getItem(getPersonalBestDateKey(level));

    // Get the current personal best username for this level
    var pbName = localStorage.getItem(getPersonalBestNameKey(level));

    // If we do not have personal best data, or it is invalid, return a placeholder row
    if (!pbTime || !pbDate || isNaN(pbTime) || isNaN(pbDate)) {
        return createData(gameText.personalBestRowID);
    }

    // If we did not find a username for this personal best entry use "Unknown"
    if (!pbName) {
        pbName = gameText.unknownUsername;
    }

    // Create and return our data row
    return createDataRow(
        gameText.personalBestRowID,
        pbName,
        pbTime,
        pbDate,
        getDeviceTypeTableString(settings.deviceType)
    );
}

/**
 * Get the last username used for the last high score or personal best
 * If none found then return Unknown
 * @returns username
 */
export function getBestGuessUsername() {
    var username = getLSUsername();

    if (!username) {
        username = gameText.unknownUsername;
    }

    return username;
}

/**
 * Function to get username stored in local storage
 * @returns username from local storage, if any
 */
export function getLSUsername() {
    return localStorage.getItem(usernameLSKey);
}

/**
 * Function to set username in local storage
 * @param {string} username
 */
export function setLSUsername(username) {
    localStorage.setItem(usernameLSKey, username);
}

/**
 * Save the username for the personal best for this level, and for future use in highscores and personal bests
 * @param {string} level
 * @param {string} username
 */
export function savePersonalBestName(level, username) {
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestNameKey(level), username);
    // Save the personal best username to local storage, we will use this for furture high scores or personal bests
    setLSUsername(username);
}

/**
 * Function to create our epoch, in seconds, to a localized data string
 * @param {Date in epoch seconds} timeEpochSeconds
 * @returns Localized date string
 */
function convertEpochToString(timeEpochSeconds) {
    // Date is expecting milliseconds so multiply seconds by 1000
    var date = new Date(timeEpochSeconds * 1000);

    // Format for our date string, using user's browser locale
    // eslint-disable-next-line no-undef
    let formattedDate = new Intl.DateTimeFormat(settings.locale, {
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
 * @param {string} level
 * @param {number} time
 * @param {number} date
 * @param {string} user
 */
function savePersonalBestData(level, time, date, user) {
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestTimeKey(level), time);
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestDateKey(level), date);
    // Save the personal best username to local storage, we will use this for furture high scores or personal bests
    savePersonalBestName(level, user);
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
 * Function to get personal best name storage key
 * @param {string} level
 * @returns local storage key
 */
function getPersonalBestNameKey(level) {
    return getPersonalBestKey(level, "name");
}

/**
 * Function to get personal best storage keys
 * @param {string} level
 * @param {string} dataType
 * @returns local storage key
 */
function getPersonalBestKey(level, dataType) {
    return "pb_" + level + "_" + dataType + "_key"
}