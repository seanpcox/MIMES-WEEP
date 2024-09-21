import * as commonSx from '../style/commonSx.js';
import * as gameSettings from '../logic/gameSettings.js';
import * as sx from '../style/boardSquareSx.js';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Device } from "../models/index.js";
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Component representing an individual square on the board
 */

// COMPONENT


const BoardSquare = forwardRef(function BoardSquare(props, inputRef) {

    // STATES

    const [numOfMimeNeighbors, setNumOfMimeNeighbors] = useState(props.numOfMimeNeighbors);

    const [mimeDetonatedIconSize, setMimeDetonatedIconSize] = useState(sx, sx.mimeDetonatedIconInitialSize);

    const [highlight, setHighlight] = useState(false);


    // REFS

    const ref = useRef(null);

    const longPressCountdown = useRef(null);

    const longPressOccurred = useRef(false);


    // LOCAL VARIABLES

    const longPressDurationMs = 350;

    const clearLongPressFlagMs = 100;

    // Mime detonated is declared locally as we need to adjust its size for mime detonated animation
    const mimeDetonatedIcon = <img
        src={sx.mimeDetonatedImage}
        width={mimeDetonatedIconSize}
        height={mimeDetonatedIconSize}
        alt={sx.mimeDetonatedAltText} />;


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to update the square with a new number of mime neighbors
             * @param {New number of mime neighbors} newNumOfMimeNeighbors 
             */
            refresh(newNumOfMimeNeighbors) {

                // Setting to a new state refreshes the component
                setNumOfMimeNeighbors(newNumOfMimeNeighbors);
            },
            /**
             * Function to call when a mime has been revealed
             */
            mimeRevealed() {

                // Trigger the mime detonated animation
                triggeredMimeDetonatedAnimation();
            },
            hightlight(isHighlight) {
                setHighlight(isHighlight);
            }
        };
    }, []);


    // LOCAL FUNCTIONS

    /**
     * IOS devices do not support long-press triggers like onContextMenu so we have to 
     * implement it ourselves
     * 
     * Note: Using this for Android as well, to ensure the long-press time is consistent across devices.
     * This is to ensure high-scores are not easier to achieve on one device type vs another.
     */

    // On touch start we kick off a timer that will let us differentiate between a tap or a long-press
    const onTouchStart = e => {
        console.log();
        // Prevent any default IOS action, just as open share menu etc.
        e.preventDefault();

        // If timer runs out perform long-press action and flag we have done so
        longPressCountdown.current = setTimeout(() => {
            longPressOccurred.current = true;
            setRightClickState();
        }, longPressDurationMs);
    };

    // On move clear the timer
    const onTouchMove = e => {
        // Prevent any default IOS action, just as open share menu etc.
        e.preventDefault();

        clearLongPressFlag();
    };

    // On cancel clear the timer
    const onTouchCancel = e => {
        // Prevent any default IOS action, just as open share menu etc.
        e.preventDefault();

        clearLongPressFlag();
    };

    // On touch end if long-press was not already triggered then perform tap action.
    // Regardless we clear the timeout and long-press flag.
    const onTouchEnd = e => {
        // Prevent any default IOS action, just as open share menu etc.
        e.preventDefault();

        // User did not touch screen for long enough to be considered a long-press so perform tap action
        if (!longPressOccurred.current) {
            setLeftClickState();
        }

        clearLongPressFlag();
    };

    function clearLongPressFlag() {
        setTimeout(() => {
            clearTimeout(longPressCountdown.current);
            longPressOccurred.current = false;
        }, clearLongPressFlagMs);
    }

    /**
     * Callback function executed when left-click/tap occurs on the square
     */
    const setLeftClickState = () => {
        props.btnLeftClickCallback(props.indexI, props.indexJ);
    };

    /**
     * Callback function executed when right-click/long-press occurs on the square
     */
    const setRightClickState = () => {
        props.btnRightClickCallback(props.indexI, props.indexJ);
    };

    /**
     * Callback function executed when left-click/tap occurs on a revealed number square
     */
    const setChordClickState = () => {
        props.btnChordActionCallback(props.indexI, props.indexJ, true);
    }

    /**
     * Callback function executed when we press down on a revealed number square
     */
    const setMouseDownState = () => {
        props.btnChordActionCallback(props.indexI, props.indexJ, false, true);
    }

    /**
     * Callback function executed when we end the press down on a revealed number square
     */
    const setMouseDownEndedState = () => {
        props.btnChordActionCallback(props.indexI, props.indexJ, false, false);
    }

    /**
     * Function to return the icon that represents a revealed or flagged square's current state
     * @param {Square's number of neighboring mimes} numOfMimeNeighbors 
     * @returns Icon that represents revealed square's state
     */
    function getIcon(numOfMimeNeighbors) {
        switch (numOfMimeNeighbors) {

            // Mime Square Detonated
            case -2:
                return mimeDetonatedIcon;

            // Mime
            case -1:
                return sx.mimeIcon;

            // Square No Mime Neighbors
            case 0:
                return null;

            // Square One Mime Neighbor
            case 1:
                return sx.oneIcon;

            // Square Two Mime Neighbors
            case 2:
                return sx.twoIcon;

            // Square Three Mime Neighbors
            case 3:
                return sx.threeIcon;

            // Square Four Mime Neighbors
            case 4:
                return sx.fourIcon;

            // Square Five Mime Neighbors
            case 5:
                return sx.fiveIcon;

            // Square Six Mime Neighbors
            case 6:
                return sx.sixIcon;

            // Square Seven Mime Neighbors
            case 7:
                return sx.sevenIcon;

            // Square Eight Mime Neighbors
            case 8:
                return sx.eightIcon;

            // Corrently Flagged Mime
            case 9:
            case 19:
                return sx.mimeFlaggedIcon;

            // Flagged Square, Unrevealed or Incorrect
            default:
                return <commonSx.flagIcon />;
        }
    }

    /**
    * Function to return a color, representing the status, of a flagged square
    * @param {Function} numOfMimeNeighbors 
    * @returns Color of flagged square
    */
    function getFlaggedColor(numOfMimeNeighbors) {

        // If a hinted flagged square
        if (numOfMimeNeighbors >= 19) {
            return sx.flaggedHintedColor;
        }

        // If the flagged square has been revealed (represented by a whole number)
        if (numOfMimeNeighbors % 1 === 0) {

            // Correctly revealed flagged square, i.e. contains a mime, is represented by 9
            // Incorrectly revealed flagged square, i.e. didn't contain a mime, is represented by > 9
            return (numOfMimeNeighbors >= 10) ? sx.flaggedIncorrectColor : sx.flaggedCorrectColor;
        }

        // Else the square has been flagged but not revealed so we do not know if correct or incorrect yet
        return sx.flaggedUnknownColor;
    }

    /**
     * Function to trigger an animation on the clicked on mime square
     */
    function triggeredMimeDetonatedAnimation() {

        // Return if no animation plays are requested
        if (sx.mimeDetonatedAnimationPlayCount <= 0) {
            return;
        }

        let id = null;
        let increment = true;
        let iconSize = sx.mimeDetonatedIconInitialSize;
        let playCount = 0;

        // Set the square's state to indicate tripped mime and set inital icon size for animation
        setNumOfMimeNeighbors(-2);
        setMimeDetonatedIconSize(iconSize);

        // Clear any previous timer and start a new one
        clearInterval(id);
        id = setInterval(frame, sx.mimeDetonatedAnimationSpeed);

        /**
         * Function to perform while the timer runs
         * We will first increment the mime detonated icon size then decrement it to the normal icon sizes
         */
        function frame() {

            // If we are decrementing the icon size and reach the original size then check if we are finished
            if (!increment && iconSize <= sx.mimeIconSize) {

                // Increase the number of times we have played the animation
                playCount++;

                // If we have played the animation the requested amount of times then quit
                if (playCount >= sx.mimeDetonatedAnimationPlayCount) {
                    clearInterval(id);
                }

                // Else continue the animation and start to increase the icon size from its original size again
                else {
                    increment = true;
                }
            }

            // Else we are incrementing and we reach the max icon size we desire then we start decrement
            else if (increment && iconSize >= sx.mimeDetonatedIconMaxSize) {
                increment = false;
            }

            // Else increment the icon size
            else if (increment) {
                iconSize++;
                setMimeDetonatedIconSize(iconSize);
            }

            // Else`decrement the icon size
            else {
                iconSize--;
                setMimeDetonatedIconSize(iconSize);
            }
        }
    }

    /**
     * Return if the square is a game start first hint i.e. is not a mime
     * @returns True if a hint, else False
     */
    function isFirstHint() {
        // Ensure we are dealing with a non-mime
        if (numOfMimeNeighbors >= 0) {
            // We need to do casting and to fixed decimal place as performing operations with decimals is not exact
            return Number(Number(numOfMimeNeighbors - Math.floor(numOfMimeNeighbors)).toFixed(1)) === 0.2;
        }

        return false;
    }


    // RENDER

    // Mobile or Tablet Square
    // Touch events are IOS and Mouse events are Android
    if (gameSettings.deviceType !== Device.DESKTOP) {

        // Flagged Square
        if (numOfMimeNeighbors >= 9) {
            return <Button
                ref={ref}
                variant={sx.unrevealedVariant}
                onTouchStart={onTouchStart}
                onTouchCancel={onTouchCancel}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
                onMouseDown={onTouchStart}
                onMouseLeave={onTouchCancel}
                onMouseUp={onTouchEnd}
                onMouseMove={onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx}
                color={getFlaggedColor(numOfMimeNeighbors)}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }

        // Unrevealed Square
        else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button
                ref={ref}
                variant={sx.unrevealedVariant}
                onTouchStart={onTouchStart}
                onTouchCancel={onTouchCancel}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
                onMouseDown={onTouchStart}
                onMouseLeave={onTouchCancel}
                onMouseUp={onTouchEnd}
                onMouseMove={onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={(highlight) ? sx.highlightSquareSx : sx.squareSx}
            >
                {isFirstHint() ? commonSx.hintIcon : null}
            </Button>
        }

        // Revealed Square
        else {
            return <sx.RevealedButton
                disabled={numOfMimeNeighbors === 0}
                variant={sx.revealedVariant}
                ref={ref}
                onTouchStart={setMouseDownState}
                onTouchCancel={setMouseDownEndedState}
                onTouchEnd={setMouseDownEndedState}
                onMouseDown={setMouseDownState}
                onMouseUp={setMouseDownEndedState}
                onMouseLeave={setMouseDownEndedState}
                onClick={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
            >
                {getIcon(numOfMimeNeighbors)}
            </sx.RevealedButton>;
        }
    }

    // Desktop Square
    else {

        // Flagged Square
        if (numOfMimeNeighbors >= 9) {
            return <Button
                variant={sx.unrevealedVariant}
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={sx.squareSx}
                color={getFlaggedColor(numOfMimeNeighbors)}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }

        // Unrevealed Square
        else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button
                variant={sx.unrevealedVariant}
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={(highlight) ? sx.highlightSquareSx : sx.squareSx}
            >
                {isFirstHint() ? commonSx.hintIcon : null}
            </Button>
        }

        // Revealed Square
        else {
            return <sx.RevealedButton
                disabled={numOfMimeNeighbors === 0}
                variant={sx.revealedVariant}
                ref={ref}
                onMouseDown={setMouseDownState}
                onMouseUp={setMouseDownEndedState}
                onMouseLeave={setMouseDownEndedState}
                onClick={setChordClickState}
                onContextMenu={(e) => e.preventDefault()}
            >
                {getIcon(numOfMimeNeighbors)}
            </sx.RevealedButton>;
        }
    }
});

// PROP LIST

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnLeftClickCallback: PropTypes.func,
    btnRightClickCallback: PropTypes.func,
    btnChordActionCallback: PropTypes.func
}

// EXPORT

export default BoardSquare;
