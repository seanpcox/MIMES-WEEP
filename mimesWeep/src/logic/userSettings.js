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

export const defaultLongPressTimeOption = 6;

export const longPressTimeOptions = [
    [
        0, "50", 50
    ],
    [
        1, "100", 100
    ],
    [
        2, "150", 150
    ],
    [
        3, "200", 200
    ],
    [
        4, "250", 250
    ],
    [
        5, "300", 300
    ],
    [
        6, "350", 350
    ],
    [
        7, "400", 400
    ],
    [
        8, "450", 450
    ],
    [
        9, "500", 500
    ]
    ,
    [
        10, "750", 750
    ]
    ,
    [
        11, "1000", 1000
    ]
]

/**
 * Function to return the duration in milliseconds that pressing the screen counts as a long press
 * @returns Long press duration in milliseconds
 */
export function getLongPressDurationMs() {

    // Get the user flagging option from local storage. If none return default.
    return getOptionSelection(longPressTimeOptionLS, longPressTimeOptions, defaultLongPressTimeOption);
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

export const defaultGameTimeFormatOption = 1;

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

export const defaultScoreTimeFormatOption = 2;

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
    if (userOptionIndex === undefined || userOptionIndex === null || isNaN(userOptionIndex
        || availableOptions === null || availableOptions === undefined
        || userOptionIndex < 0 || userOptionIndex >= availableOptions.length)) {
        return defaultOptionIndex;
    }

    return Number(userOptionIndex);
}