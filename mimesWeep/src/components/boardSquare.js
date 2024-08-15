import * as commonSx from '../style/commonSx.js';
import * as sx from '../style/boardSquareSx.js';
import IOSContextMenuHandler from '../logic/iosContextMenuHandler.js';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { isIOS } from 'react-device-detect';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Component representing an individual square on the board
 */

// COMPONENT

const BoardSquare = forwardRef(function BoardSquare(props, inputRef) {

    // STATES

    const [numOfMimeNeighbors, setNumOfMimeNeighbors] = useState(props.numOfMimeNeighbors);

    const isDeviceIOS = useState(isIOS);


    // REFS

    const ref = useRef(null);


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
            }
        };
    }, []);


    // LOCAL FUNCTIONS

    /**
     * IOS device handler that allows us to distinguish between tap and long-press
     * IOS devices do not support long-press triggers like onContextMenu so we have to 
     * implement it ourselves
     */
    const contextMenuHandler = new IOSContextMenuHandler(
        () => {
            // Tap occured, perform its action
            setLeftClickState();
        },
        () => {
            // Long press occured, perform its action
            setRightClickState();
        }
    );

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


    // RENDER

    // IOS Square
    if (isDeviceIOS[0]) {

        // Flagged Square
        if (numOfMimeNeighbors >= 9) {
            return <Button
                ref={ref}
                variant={sx.unrevealedVariant}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
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
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx} />
        }

        // Revealed Square
        else {
            return <Button
                ref={ref}
                variant={sx.revealedVariant}
                disabled={true}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    }

    // Desktop or Android Square
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
                sx={sx.squareSx}
            />
        }

        // Revealed Square
        else {
            return <Button
                variant={sx.revealedVariant}
                disabled={true}
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={sx.squareSx}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    }
});

// EXTERNAL FUNCTIONS

/**
 * Function to return the icon that represents a revealed or flagged square's current state
 * @param {Square's number of neighboring mimes} numOfMimeNeighbors 
 * @returns Icon that represents revealed square's state
 */
function getIcon(numOfMimeNeighbors) {
    switch (numOfMimeNeighbors) {

        // Mime Square Detonated
        case -2:
            return sx.mimeDetonated;

        // Mime
        case -1:
            return sx.mime;

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
            return sx.mimeFlagged;

        // Flagged Square, Unrevealed or Incorrect
        default:
            return <commonSx.flagIcon />;
    }
}

/**
 * Function to return a color, representing the status, of a flagged square
 * @param {Function} numOfMimeNeighbors 
 * @returns 
 */
function getFlaggedColor(numOfMimeNeighbors) {

    // If the flagged square has been revealed (represented by a whole number)
    if (numOfMimeNeighbors % 1 === 0) {

        // Correctly revealed flagged square, i.e. contains a mime, is represented by 9
        // Incorrectly revealed flagged square, i.e. didn't contain a mime, is represented by > 9
        return (numOfMimeNeighbors >= 10) ? sx.flaggedIncorrectColor : sx.flaggedCorrectColor;
    }

    // Else the square has been flagged but not revealed so we do not know if correct or incorrect yet
    return sx.flaggedUnknownColor;
}

// PROP LIST

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnLeftClickCallback: PropTypes.func,
    btnRightClickCallback: PropTypes.func
}

// EXPORT

export default BoardSquare;
