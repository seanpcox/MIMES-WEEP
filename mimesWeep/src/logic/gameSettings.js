import * as gameText from '../resources/text/gameText.js';
import { isIOS, isIPad13, isMobile, isTablet } from 'react-device-detect';
import { Device } from "../models/index.js";
import { Period } from "../models/index.js";

/**
 * Logic to determine board sizes for Easy, Medium, and Hard levels. Also sets max Custom board settings.
 * Board sizes are also dependent on device type (desktop, tablet, or phone).
 * This is to accomodate the different screen sizes and to avoid horizontal scrolling (which is not a good user 
 * experience and can result in the Browser accidently moving back or foward a page).
 * The height of the and width of the medium and hard boards were chosen to ensure they fit inside the screen's viewport without scrolling.
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

// The number of mimes in the easy level: default 10
const numOfMimesOnEasyLevel = 10;

// The number of high score positions we support: default 10
export const highScorePositions = 10;

// Do we want to clear local storage on startup, this would delete all personal bests: default false
export const clearLocalStorageOnStartup = false;

// Constant for the type of device game is being currently being played on, will not change during play
export const deviceType = getDeviceType();

// Constant for the user's browser's preferred locale, will not change during play
export const locale = (navigator && navigator.language) || "en-US";

// Currently the two periods we use, in order of greatest, all-time and 24hrs, this may expand in future
export const periodsInUse = [Period.ALL, Period.MONTH, Period.DAY];

// The number of high scores we show if user achieves a high score or personal best
export const numHSRowsToDisplayOnNewScore = 3;

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
      numOfMimes = numOfMimesOnEasyLevel;

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
 * Function to get a human readable difficulty level string including board size
 * Includes board size as different devices have differing board sizes for the same difficulty level
 * @returns Human readable difficulty level string
 */
export function getLevelString(difficulty) {
  // Get the game settings for this device and difficulty level
  var settings = getGameSettings(difficulty);
  // Generate and return the level string, used in our database
  return getDifficultyString(difficulty) + " (" + settings[0] + "x" + settings[1] + ")"
}

/**
 * Function to get user's device type
 * @returns Device type enum: Device.MOBILE, Device.TABLET, Device.DESKTOP
 */
function getDeviceType() {
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
 * Function to get a display string for the supplied Period enum
 * @param {Period} period
 * @returns Period string for display
 */
export function getPeriodString(period) {
  if (period === Period.DAY) {
    return gameText.period24Hours;
  } else if (period === Period.MONTH) {
    return gameText.period30Days;
  }

  return gameText.periodAllTime;
}