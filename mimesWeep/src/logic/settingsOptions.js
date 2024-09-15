import * as gameText from '../resources/text/gameText.js'
import * as gameSettings from '../logic/gameSettings.js'
import { Device } from "../models/index.js";


export const placeFlagsOptionLS = "placeFlagsOption";

export const longPressTimeOptionLS = "longPressTimeOption";

export const chordingControlOptionLS = "chordingControlOption";

export const startHintOptionLS = "startHintOption";

export const gameTimeFormatOptionLS = "gameTimeFormatOption";

export const scoreTimeFormatOptionLS = "scoreTimeFormatOption";


export const defaultPlaceFlagsOption = 1;

export const placeFlagsOptions = [
    {
        value: 0,
        label: gameText.disabled
    },
    {
        value: 1,
        label: gameText.enabled
    }
]


export const defaultLongPressTimeOption = 6;

export const longPressTimeOptions = [
    {
        value: 0,
        label: "50"
    },
    {
        value: 1,
        label: "100"
    },
    {
        value: 2,
        label: "150"
    },
    {
        value: 3,
        label: "200"
    },
    {
        value: 4,
        label: "250"
    },
    {
        value: 5,
        label: "300"
    },
    {
        value: 6,
        label: "350"
    },
    {
        value: 7,
        label: "400"
    },
    {
        value: 8,
        label: "450"
    },
    {
        value: 9,
        label: "500"
    }
]


export const defaultChordingControlOption = 1;

export const chordingControlOptions = [
    {
        value: 0,
        label: gameText.disabled
    },
    {
        value: 1,
        label: gameSettings.deviceType === Device.DESKTOP ? gameText.leftClick : gameText.tap
    },
    {
        value: 2,
        label: gameSettings.deviceType === Device.DESKTOP ? gameText.rightClick : gameText.longPress
    }
]


export const defaultStartHintOption = 2;

export const startHintOptions = [
    {
        value: 0,
        label: gameText.none
    },
    {
        value: 1,
        label: gameText.safeSquare
    },
    {
        value: 2,
        label: gameText.safeSquareAndNeighbors
    }
];


export const defaultGameTimeFormatOption = 0;

export const gameTimeFormatOptions = [
    {
        value: 0,
        label: gameText.timeSeconds
    },
    {
        value: 1,
        label: gameText.timeMinutesAndSeconds
    }
]


export const defaultScoreTimeFormatOption = 0;

export const scoreTimeFormatOptions = [
    {
        value: 0,
        label: gameText.timeSeconds3Decimals
    },
    {
        value: 1,
        label: gameText.timeSeconds2Decimals
    },
    {
        value: 2,
        label: gameText.timeSeconds1Decimals
    },
    {
        value: 3,
        label: gameText.timeSeconds
    },
    {
        value: 4,
        label: gameText.timeMinutesAndSeconds
    }
]