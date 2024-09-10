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