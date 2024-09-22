import * as gameText from '../resources/text/gameText.js'


/**
 * FLAGGING
 */

export const placeFlagsOptionLS = "placeFlagsOption";

export const defaultPlaceFlagsOption = 1;

export const placeFlagsOptions = [
    [
        0, gameText.disabled, false
    ],
    [
        1, gameText.enabled, true
    ]
]

/**
 * Function to return whether we are to allow flagging
 * @returns True if flagging allowed, else False
 */
export function isFlaggingEnabled() {

    // Get the user flagging option from local storage. If none return default.
    return getOptionSelection(placeFlagsOptionLS, placeFlagsOptions, defaultPlaceFlagsOption);
}


/**
 * LONG PRESS DURATION
 */

export const longPressTimeOptionLS = "longPressTimeOption";

export const defaultLongPressTimeOption = 1;

export const longPressTimeOptions = [

    [
        0, "300", 300
    ],
    [
        1, "500", 500
    ],
    [
        10, "1000", 1000
    ],
    [
        10, "1500", 1500
    ]
]

/**
 * Function to return the duration in milliseconds that pressing the screen counts as a long press
 * @returns Long press duration in milliseconds
 */
export function getLongPressDurationMs() {

    // Get the user flagging option from local storage. If none return default.
    var selection = getOptionSelection(longPressTimeOptionLS, longPressTimeOptions, defaultLongPressTimeOption);
    console.log(selection);
    return selection;
}


/**
 * CHORDING
 */

export const chordingControlOptionLS = "chordingControlOption";

export const defaultChordingControlOption = 1;

export const chordingControlOptions = [
    [
        0, gameText.disabled, false
    ],
    [
        1, gameText.enabled, true
    ]
]

/**
 * Function to return whether we are to allow chording
 * @returns True if chording allowed, else False
 */
export function isChordingEnabled() {

    // Get the user chording option from local storage. If none return default.
    return getOptionSelection(chordingControlOptionLS, chordingControlOptions, defaultChordingControlOption);
}


/**
 * START HINT
 */

export const startHintOptionLS = "startHintOption";

export const defaultStartHintOption = 2;

export const startHintOptions = [
    [
        0, gameText.none
    ],
    [
        1, gameText.safeSquare
    ],
    [
        2, gameText.safeSquareAndNeighbors
    ]
];

/**
 * Function to return the start hint option index
 * @returns Start hint option index
 */
export function getStartHintOption() {

    // Get the start hint option index from local storage. If none return default.
    return getOptionIndex(startHintOptionLS, startHintOptions, defaultStartHintOption);
}


/**
 * GAME TIME FORMAT
 */

export const gameTimeFormatOptionLS = "gameTimeFormatOption";

export const defaultGameTimeFormatOption = 2;

export const gameTimeFormatOptions = [
    [
        0, gameText.timeSeconds1Decimals
    ],
    [
        1, gameText.timeSeconds
    ],
    [
        2, gameText.timeMinutesAndSeconds
    ]
]

/**
 * Function to return the game time format option index
 * @returns Game time format option index
 */
export function getGameTimeFormatOption() {

    // Get the start hint option index from local storage. If none return default.
    return getOptionIndex(gameTimeFormatOptionLS, gameTimeFormatOptions, defaultGameTimeFormatOption);
}


/**
 * SCORE TIME FORMAT
 */

export const scoreTimeFormatOptionLS = "scoreTimeFormatOption";

export const defaultScoreTimeFormatOption = 4;

export const scoreTimeFormatOptions = [
    [
        0, gameText.timeSeconds3Decimals
    ],
    [
        1, gameText.timeSeconds2Decimals
    ],
    [
        2, gameText.timeSeconds1Decimals
    ],
    [
        3, gameText.timeSeconds
    ],
    [
        4, gameText.timeMinutesAndSeconds
    ]
]

/**
 * Function to return the score time format option index
 * @returns Score time format option index
 */
export function getScoreTimeFormatOption() {

    // Get the start hint option index from local storage. If none return default.
    return getOptionIndex(scoreTimeFormatOptionLS, scoreTimeFormatOptions, defaultScoreTimeFormatOption);
}


/**
 * SAVED USERNAME
 */

export const usernameLSKey = "mimesweepUser";

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
 * Function to get the last used username stored in local storage
 * @returns username from local storage, if any
 */
export function getLSUsername() {
    return localStorage.getItem(usernameLSKey);
}

/**
 * Function to set the last used username in local storage
 * @param {string} username
 */
export function setLSUsername(username) {
    localStorage.setItem(usernameLSKey, username);
}


/**
 * CUSTOM GAME SETTINGS
 */

const customHeightLSKey = "customHeight";

const customWidthLSKey = "customWidth";

const customNumOfMimesLSKey = "customNumOfMimes";

/**
 * Function to get last used custom height stored in local storage
 * @returns custom height from local storage, if any
 */
export function getLSCustomHeight() {
    return localStorage.getItem(customHeightLSKey);
}

/**
 * Function to set the last used custom height in local storage
 * @param {number} height
 */
export function setLSCustomHeight(height) {
    localStorage.setItem(customHeightLSKey, height);
}

/**
 * Function to get last used custom width stored in local storage
 * @returns custom width from local storage, if any
 */
export function getLSCustomWidth() {
    return localStorage.getItem(customWidthLSKey);
}

/**
 * Function to set the last used custom width in local storage
 * @param {number} width
 */
export function setLSCustomWidth(width) {
    localStorage.setItem(customWidthLSKey, width);
}

/**
 * Function to get last used custom number of mimes stored in local storage
 * @returns custom number of mimes from local storage, if any
 */
export function getLSCustomNumOfMimes() {
    return localStorage.getItem(customNumOfMimesLSKey);
}

/**
 * Function to set the last used custom number of mimes in local storage
 * @param {number} numberOfMimes
 */
export function setLSCustomNumOfMimes(numberOfMimes) {
    localStorage.setItem(customNumOfMimesLSKey, numberOfMimes);
}

/**
 * Function to set the last used custom game parameters
 * @param {number} height
 * @param {number} width
 * @param {number} numOfMimes
 */
export function setLSCustomGameOptions(height, width, numOfMimes) {
    setLSCustomHeight(height);
    setLSCustomWidth(width);
    setLSCustomNumOfMimes(numOfMimes);
}


/**
 * GENERIC FUNCTIONS
 */

/**
 * Function to get the user selected option, else to return the default
 * @param {string} optionLS - option key used for local storage
 * @param {array} availableOptions - available options for selection
 * @param {number} defaultOptionIndex - the default option index
 * @returns The user option, else the default
 */
function getOptionSelection(optionLS, availableOptions, defaultOptionIndex) {

    // Get the user's option index from local storage
    var userOptionIndex = localStorage.getItem(optionLS);

    // If no user option index found then return the default option value
    if (userOptionIndex === undefined || userOptionIndex === null) {
        return availableOptions[defaultOptionIndex][2];
    }

    // Try and retrieve the value from the options map using the user's index
    var userOptionValue = availableOptions[userOptionIndex][2];

    // If no value found for the user option index then again return the default option value
    if (userOptionValue === undefined || userOptionValue === null) {
        return availableOptions[defaultOptionIndex][2];
    }

    // Return the user's option value
    return userOptionValue;
}

/**
 * Function to get the user selected index, else to return the default
 * @param {string} optionLS - option key used for local storage
 * @param {array} availableOptions - available options for selection
 * @param {number} defaultOptionIndex - the default option index
 * @returns The user index, else the default
 */
function getOptionIndex(optionLS, availableOptions, defaultOptionIndex) {
    // Get the user's option index from local storage
    var userOptionIndex = localStorage.getItem(optionLS);

    // If no user option index found then return the default option index
    if (userOptionIndex === undefined || userOptionIndex === null || isNaN(userOptionIndex)
        || availableOptions === undefined || availableOptions === null
        || userOptionIndex < 0 || userOptionIndex >= availableOptions.length) {
        return defaultOptionIndex;
    }

    return Number(userOptionIndex);
}

/**
 * Function to determine if this is the user's first visit on this browser
 * @returns True if user's first visit on this browser, else False
 */
export function isFirstVisit() {
    // Retrieve the local property telling us if this is the user's first visit on this browser
    var isFirstVisitLS = localStorage.getItem("isFirstVisit");

    // If they have never visited we display the welcome/help screen and record they have visited
    if (isFirstVisitLS === undefined || isFirstVisitLS === null || isFirstVisitLS === "yes") {
        return true;
    }

    return false;
}

/**
 * Function to record, in local storage, whether the user has visited this site before on this browser
 * @param {bool} isFirstVisit
 */
export function setIsFirstVisit(isFirstVisit) {
    if (isFirstVisit) {
        // Record that the user has not visited the site on this browser
        localStorage.setItem("isFirstVisit", "yes");
    } else {
        // Record that the user has visited the site on this browser
        localStorage.setItem("isFirstVisit", "no");
    }
}