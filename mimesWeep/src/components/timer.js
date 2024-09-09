import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText.js';
import * as settings from '../logic/gameSettings.js';
import * as sx from '../style/timerSx.js';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * Component displaying the time elapsed, in minutes and seconds, in the current game since the first square was revealed
 */

// COMPONENT

const Timer = forwardRef(function Timer(props, inputRef) {

    // STATES

    const [timeElapsed, setTimeElapsed] = useState(0);


    // REFS

    const ref = useRef(null);


    // LOCAL VARIABLES

    var timerRunning = false;
    var timeElapsedLocal = 0;
    var startTime = Date.now();


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to start the timer
             */
            startTimer() {
                start();
            },
            /**
             * Function to stop the timer
             */
            stopTimer() {
                stop();
            },
            /**
             * Function to reset the timer
             */
            resetTimer() {
                reset();
            },
            /**
             * Function to retrieve the elapsed time in milliseconds
             */
            getTimeElapsedTimer() {
                return getTimeElapsed();
            }
        };
    }, []);


    // EFFECTS

    // Effect to update the timer display every 100ms
    useEffect(() => {
        const interval = setInterval(() => udpateTimeElapsed(), 100);

        return () => clearInterval(interval);
    }, []);


    // LOCAL FUNCTIONS

    /**
     * Function to start the timer from zero
     */
    function start() {
        timerRunning = true;
        startTime = Date.now();
        setTimeElapsed(0);
    }

    /**
     * Function to stop the timer at the current value
     */
    function stop() {
        timerRunning = false;
    }

    /**
     * Function to stop the timer and reset it to zero
     */
    function reset() {
        stop();
        setTimeElapsed(0);
    }

    /**
     * Function to get the time elapsed in milliseconds
     * Uses a local variable as state variable updated value is only accessible inside this component
     * @returns Time elapsed in milliseconds
     */
    function getTimeElapsed() {
        return timeElapsedLocal;
    }

    /**
     * Function to update the time elapsed variables
     * @returns Exit if timer stopped
     */
    function udpateTimeElapsed() {
        if (!timerRunning) {
            return;
        }

        // Calculate the time elapsed in ms by subtraing the start time from the current time
        let newTimeElapsed = Date.now() - startTime;

        // Update our state variable used in this component
        setTimeElapsed(newTimeElapsed);

        // Update our local variable which can be queried by external components
        timeElapsedLocal = newTimeElapsed;
    }


    // LOGIC

    // This will be what we display in our timer container
    let timerContent;

    // If we have not begun conuting then display the high score icon
    if (timeElapsed === 0) {
        timerContent = <sx.highScoresIcon />;
    }
    // Else if we have started counting then display the current elapsed time
    else {
        timerContent = settings.getTimeElapsedString(timeElapsed);
    }


    // RENDER

    return <Tooltip
        title={gameText.tooltipTimeElapsed}
        placement={commonSx.tooltipPlacement}
        arrow={commonSx.tooltipArrow}
    >
        <Button
            variant={commonSx.btnVariant}
            sx={commonSx.btnMedium}
            onClick={props.openHighScoreDialogCallback}
            ref={ref}
        >
            {timerContent}
        </Button>
    </Tooltip>;
});

// PROP LIST

Timer.propTypes = {
    openHighScoreDialogCallback: PropTypes.func
}

// EXPORT

export default Timer;