import * as gameText from '../resources/text/gameText.js';
import * as gameSettings from './gameSettings.js';
import { Period } from "../models/index.js";

/**
 * Logic common to different areas of our application
 */

const dayLengthMs = 86400000;

const hourLengthMs = 3600000;

const minLengthMs = 60000;

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
        let secondsString = getAtLeastTwoDigitNumber(seconds);

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
 * Function to create our epoch, in seconds, to a localized data string
 * @param {Date in epoch seconds} timeEpochSeconds
 * @returns Localized date string
 */
export function convertEpochToDateString(timeEpochSeconds) {
    // Date is expecting milliseconds so multiply seconds by 1000
    var date = new Date(timeEpochSeconds * 1000);

    // Format for our date string, using user's browser locale
    // eslint-disable-next-line no-undef
    let formattedDate = new Intl.DateTimeFormat(gameSettings.locale, {
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
export function convertEpochToTimeString(timeEpochSeconds) {
    // Date is expecting milliseconds so multiply seconds by 1000
    var date = new Date(timeEpochSeconds * 1000);

    // Format for our date string, using user's browser locale
    // eslint-disable-next-line no-undef
    let formattedDate = new Intl.DateTimeFormat(gameSettings.locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(date);

    // Return the date string
    return formattedDate;
}

/**
 * Function to get the number of days in a given period
 * @param {Period of time} period
 * @returns Number of days in the given period, else -1 if all time
 */
function getNumberOfDaysInPeriod(period) {
    if (period === Period.DAY) {
        return 1;
    } else if (period === Period.WEEK) {
        return 7;
    } else if (period === Period.MONTH) {
        return 30;
    } else if (period === Period.YEAR) {
        return 365;
    }

    return -1;
}

/**
 * Function to get the epoch time in seconds n days ago
 * @param {number} numOfDaysBack
 * @returns Epoch time in seconds 24 hours ago
 */
function getEpochSecondTimeInPast(numOfDaysBack) {
    return Math.floor((Date.now() - (dayLengthMs * numOfDaysBack)) / 1000);
}

/**
 * Function to get the epoch second time in the past for the length defined by the supplied time period
 * @param {Period of time} period
 * @returns Epoch second time
 */
export function getEpochSecondTimeInPastForPeriod(period) {
    return getEpochSecondTimeInPast(getNumberOfDaysInPeriod(period));
}

/**
 * Function to get a human readable string of the time that our score has left to live before it expires, given the expiry period
 * @param {Event time} eventTime 
 * @param {Period of time to live} expiryPeriod
 * @returns Time left to live string
 */
export function getTimeToLiveString(eventTime, expiryPeriod) {

    // If period is all-time the score never expires
    if (expiryPeriod === Period.ALL) {
        return gameText.neverExpires;
    }

    // Get the time left to live in milliseconds
    let expiresInMs = getTimeToLiveMs(eventTime, expiryPeriod);

    // Get the number of full days left rounded to nearest day
    var days = Math.round(expiresInMs / dayLengthMs);

    // Get the number of full hours left rounded to nearest hour
    var hours = Math.round(expiresInMs / hourLengthMs);

    // Get the number of full minutes left rounded to nearest minute
    var minutes = Math.round(expiresInMs / minLengthMs);


    // If we have more than one day left we display days left
    if (days > 1) {
        return days + gameText.days
    }

    // If we have one day left and 24 hours or more left show 1 day
    if (days === 1 && hours >= 24) {
        return gameText.day1;
    }

    // If we have more than one house left we display hours left
    if (hours > 1) {
        return hours + gameText.hours;
    }

    // If we have one day left and 60 or more minutes left show 1 hour
    if (hours === 1 && minutes >= 60) {
        return gameText.hours1;
    }

    // Show one minute
    if (minutes === 1) {
        return gameText.minutes1;
    }

    // Show minutes
    return minutes + gameText.minutes;
}

/**
 * Function to get the millisecond time that our event has left before it expires, given the expiry period
 * @param {Event time} eventTime 
 * @param {Period of time to live} expiryPeriod
 * @returns Time left before expiry in milliseconds
 */
export function getTimeToLiveMs(eventTime, expiryPeriod) {

    // Convert our time period into milliseconds
    var periodInMs = getNumberOfDaysInPeriod(expiryPeriod) * dayLengthMs;

    // Get the number of milliseconds that have occurred since our event
    var timePassedSinceEventMs = Date.now() - (eventTime * 1000);

    // Time left before expiry will be the difference between the two
    var timeLeftMs = periodInMs - timePassedSinceEventMs;

    // Return the time left in milliseconds
    return timeLeftMs;
}

/**
 * Function to add a leading zero if number if only a single digit
 * @param {Number} number 
 * @returns Two or greater digit number
 */
function getAtLeastTwoDigitNumber(number) {
    return (number === 0) ? "00" : (number < 10) ? ("0" + number) : number;
}