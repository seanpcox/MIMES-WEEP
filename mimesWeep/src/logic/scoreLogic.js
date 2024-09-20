import * as gameText from '../resources/text/gameText.js';
import * as settings from './gameSettings.js';
import * as timeFormatLogic from '../logic/timeFormatLogic.js'
import * as userSettings from '../logic/userSettings.js';

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
 * @param {Database ID} id
 * @returns Row for table display
 */
export function createDataRow(position, user, time, date, deviceType, id) {

    // Get the user option for time format display
    var timeFormatOption = userSettings.getScoreTimeFormatOption();

    var timeHRString;

    // Seconds with 3 decimal places
    if (timeFormatOption === 0) {
        timeHRString = (time / 1000).toFixed(3);
    }
    // Seconds with 2 decimal places
    else if (timeFormatOption === 1) {
        timeHRString = (time / 1000).toFixed(2);
    }
    // Seconds, no decimal places
    else if (timeFormatOption === 3) {
        timeHRString = (time / 1000).toFixed(0);
    }
    // Minutes and Seconds, no decimal places
    else if (timeFormatOption === 4) {
        timeHRString = timeFormatLogic.getTimeElapsedString(time);
    }
    // Seconds with 1 decimal places (default)
    else {
        timeHRString = (time / 1000).toFixed(1);
    }

    // Create the data row
    return createData(
        // Result position
        position,
        // User name
        user,
        // Score in human readable format
        timeHRString,
        // Date in localized format
        convertEpochToDateString(date),
        // Device type used with first letter capitalized
        getDeviceTypeTableString(deviceType),
        // The database id
        id,
        // Time taken in millisecond format
        time,
        // Date in epoch seconds format
        date,
        // Time in human readable format
        convertEpochToTimeString(date)
    );
}

/**
 * Function to create a the data object of data
 * @param {Table position} position
 * @param {Username of player} user
 * @param {Human readable time taken string} score
 * @param {Date game was completed} date
 * @param {Type of device game was played on} device
 * @param {Database ID} id
 * @param {Time taken in milliseconds} scoreMs
 * @param {Date in epoch seconds} dateES
 * @param {Human readable time of score} time
 * @returns Row for table display
 */
export function createData(position, user, score, date, device, id, scoreMs, dateES, time) {
    return { position, user, score, date, device, id, scoreMs, dateES, time };
}

/**
 * Function to create a new high score data object
 * @param {Database primary ID} id
 * @param {Period the score was in} period
 * @param {String username} name
 * @returns New high score data object
 */
export function createNewHighScoreData(id, period, name) {
    return { id, period, name };
}

/**
 * Function to save personal data to local storage if it beats any previous personal best
 * @param {Score data object} scoreData
 * @param {Callback function to set any personal best periods in calling component} setPersonalBestPeriodsCallback
 * @returns True if any personal best was achieved, else False
 */
export function updatePersonalBestTimeWithScoreData(scoreData, setPersonalBestPeriodsCallback) {
    return updatePersonalBestTime(scoreData.level, scoreData.time, scoreData.date, scoreData.user, setPersonalBestPeriodsCallback);
}

/**
 * Function to save personal data to local storage if it beats any previous personal best
 * @param {Level diifculty string} level
 * @param {Time taken for game to complete in milliseconds} time
 * @param {Date in epoch seconds format} date
 * @param {User who played the game} user
 * @param {Callback function to set any personal best periods in calling component} setPersonalBestPeriodsCallback
 * @returns True if any personal best was achieved, else False
 */
function updatePersonalBestTime(level, time, date, user, setPersonalBestPeriodsCallback) {

    // We record whether we acheived any personal best for return
    var isPersonalBest = false;

    for (const period of settings.periodsInUse) {
        // Get the current personal best time for the supplied level and period
        var pbTime = localStorage.getItem(getPersonalBestTimeKey(level, period));

        // If we have no personal best time for the supplied level or the new time
        // is better then save the new time.
        if (pbTime === null || pbTime === "" || isNaN(pbTime) || time < Number(pbTime)) {

            // Record that we scored a personal best
            isPersonalBest = true;

            // Save our personal best data to local storage
            savePersonalBestData(level, period, time, date, user);

            // Notify the calling component that a personal best was achieved in this period
            setPersonalBestPeriodsCallback(period);
        }
    }

    // Return the highest period of personal best achieved, if any
    return isPersonalBest;
}

/**
 * Function to update the personal best name at this level and period
 * @param {Level diifculty string} level
 * @param {Time taken for game to complete in milliseconds} time
 * @param {Date in epoch seconds format} date
 * @param {User who played the game} user
 */
export function updatePersonalBestName(level, period, user) {
    // Save the personal best username to local storage, we will use this for furture high scores or personal bests
    savePersonalBestName(level, period, user);
}

/**
 * Function to get the personal best data row for display
 * @param {Level diifculty string} level
 * @param {Period the high score was in} period
 */
export function getPersonalBestDataRow(level, period) {
    // Get the current personal best time for this level
    var pbTime = localStorage.getItem(getPersonalBestTimeKey(level, period));

    // Get the current personal best date for this level
    var pbDate = localStorage.getItem(getPersonalBestDateKey(level, period));

    // Get the current personal best username for this level
    var pbName = localStorage.getItem(getPersonalBestNameKey(level, period));

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
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @param {Username string} username
 */
export function savePersonalBestName(level, period, username) {
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestNameKey(level, period), username);
    // Save the personal best username to local storage, we will use this for furture high scores or personal bests
    setLSUsername(username);
}

/**
 * Function to create our epoch, in seconds, to a localized data string
 * @param {Date in epoch seconds} timeEpochSeconds
 * @returns Localized date string
 */
function convertEpochToDateString(timeEpochSeconds) {
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
 * Function to create our epoch, in seconds, to a localized time string
 * @param {Date in epoch seconds} timeEpochSeconds
 * @returns Localized time string
 */
function convertEpochToTimeString(timeEpochSeconds) {
    // Date is expecting milliseconds so multiply seconds by 1000
    var date = new Date(timeEpochSeconds * 1000);

    // Format for our date string, using user's browser locale
    // eslint-disable-next-line no-undef
    let formattedDate = new Intl.DateTimeFormat(settings.locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @param {Time taken for game to complete in milliseconds} time
 * @param {Date in epoch seconds format} date
 * @param {User who played the game} user
 */
function savePersonalBestData(level, period, time, date, user) {
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestTimeKey(level, period), time);
    // Save the personal best time to local storage for this level
    localStorage.setItem(getPersonalBestDateKey(level, period), date);
    // Save the personal best username to local storage, we will use this for furture high scores or personal bests
    savePersonalBestName(level, period, user);
}

/**
 * Function to get personal best time storage key
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @returns local storage key
 */
function getPersonalBestTimeKey(level, period) {
    return getPersonalBestKey(level, period, "time");
}

/**
 * Function to get personal best date storage key
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @returns local storage key
 */
function getPersonalBestDateKey(level, period) {
    return getPersonalBestKey(level, period, "date");
}

/**
 * Function to get personal best name storage key
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @returns local storage key
 */
function getPersonalBestNameKey(level, period) {
    return getPersonalBestKey(level, period, "name");
}

/**
 * Function to get personal best storage keys
 * @param {Level diifculty string} level
 * @param {Period the score was in} period
 * @param {Type of data we are saving} dataType
 * @returns local storage key
 */
function getPersonalBestKey(level, period, dataType) {
    return "pb_" + level + "_" + period + "_" + dataType + "_key"
}