import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText.js';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

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
             * Function to update the square with a new number of mime neighbors
             * @param {New number of mime neighbors} newNumOfMimeNeighbors 
             */
            startTimer() {
                start();
            },
            stopTimer() {
                stop();
            },
            resetTimer() {
                reset();
            },
            getTimeElapsedTimer() {
                return getTimeElapsed();
            }
        };
    }, []);


    // EFFECTS

    useEffect(() => {
        const interval = setInterval(() => udpateTimeElapsed(), 100);

        return () => clearInterval(interval);
    }, []);


    // LOCAL FUNCTIONS

    function start() {
        timerRunning = true;
        startTime = Date.now();
        setTimeElapsed(0);
    }

    function stop() {
        timerRunning = false;
    }

    function reset() {
        stop();
        setTimeElapsed(0);
    }

    function getTimeElapsed() {
        return timeElapsed;
    }

    function getTimeElapsedString() {
        let timeElapsedSeconds = getTimeElapsed() / 1000;
        let minutes = Math.floor(timeElapsedSeconds / 60);
        let seconds = Math.floor(timeElapsedSeconds % 60);
        let secondsString = (seconds < 10) ? "0" + seconds : seconds;
        return minutes + ":" + secondsString;
    }

    function udpateTimeElapsed() {
        if (!timerRunning) {
            return;
        }

        setTimeElapsed(Date.now() - startTime);
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
            {getTimeElapsedString()}
        </Button>
    </Tooltip>;
});

// EXPORT

export default Timer;