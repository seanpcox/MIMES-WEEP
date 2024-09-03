import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText.js';
import * as sx from '../style/timerSx.js';
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
     * @returns Time elapsed in milliseconds
     */
    function getTimeElapsed() {
        return timeElapsed;
    }

    /**
     * Funtion to get the time elapsed in human readable minutes and seconds
     * @returns Time elapsed string
     */
    function getTimeElapsedString() {

        // Convert time elapsed from millseconds into seconds
        let timeElapsedSeconds = getTimeElapsed() / 1000;

        // Calculate how many minutes, floored to the nearest integer, have elapsed
        let minutes = Math.floor(timeElapsedSeconds / 60);

        // Calculate how many seconds, floored to the nearest integer, have elapsed
        let seconds = Math.floor(timeElapsedSeconds % 60);

        // Create the human readable minutes and seconds elapsed string
        let secondsString = (seconds < 10) ? "0" + seconds : seconds;

        // Return the human readable string
        return minutes + ":" + secondsString;
    }

    function udpateTimeElapsed() {
        if (!timerRunning) {
            return;
        }

        setTimeElapsed(Date.now() - startTime);
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
        timerContent = getTimeElapsedString();
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
            ref={ref}
        >
            {timerContent}
        </Button>
    </Tooltip>;
});

// EXPORT

export default Timer;