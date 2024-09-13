import * as logic from '../logic/gameLogic.js';
import * as sx from '../style/boardSx.js';
import BoardSquare from './boardSquare.js'
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

/**
 * Component containing all the board squares
 */

// COMPONENT

const Board = forwardRef(function Board(props, inputRef) {

    // STATES

    const [guessButtonToggled, setGuessButtonToggled] = useState(true);


    // LOCAL VARIABLES

    var tempRef = [];

    var array = props.array;
    var height = array.length;
    var width = array[0].length;


    // REFS

    var ref = useRef(null);

    const pushRef = (square) => {
        // On render all board square components will be pushed into 1D array tempRef
        // Ex: In a 2X2 2D array the index of the first square on the second row would be 2, 
        // where 0 and 1 represent the values in the first row
        if (square !== null) {
            tempRef.push(square);
        }
    };


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Imperative function that sets new game parameters and refreshes all board squares
             * @param {The new game board 2D array} newArray 
             */
            refresh(newArray) {

                // Update the game parameters
                array = newArray;
                height = array.length;
                width = array[0].length;

                // Refresh all square components
                refreshAllSquares();
            }
        };
    }, []);


    // EFFECTS

    // Effect to reference all of our board squares in a 1D array
    useEffect(() => {
        // After render we update our actual ref object to match tempRef
        ref.current = tempRef;

        return () => {
            // On unmount we clear the ref so it is empty for next render
            ref.current = null;
        }
    });

    // Effect to toggle whether the Flag Button has been selected 
    // Flags are used to mark where we guess mimes are
    useEffect(() => {
        props.guessButtonToggledCallback([guessButtonToggled, setGuessButtonToggled]);
    }, [props.guessButtonToggledCallback, guessButtonToggled]);


    // LOCAL FUNCTIONS

    /**
     * Function to get the 1D ref array index of a specific board square
     * @param {The board width} width 
     * @param {The square's row} indexI 
     * @param {The square's column} indexJ 
     * @returns Board square index in 1D ref array
     */
    function getRefIndex(width, indexI, indexJ) {
        return (indexI * width) + indexJ;
    }

    /**
     * Function to process square left-clicked (Desktop) or tapped (Mobile or Tablet)
     * The main function is to reveal the square
     * @param {The square's row} indexI 
     * @param {The square's column} indexJ
     */
    function btnLeftClickCallback(indexI, indexJ) {

        // If the square is flagged then return, flag must be removed before it can be reveraled
        if (array[indexI][indexJ] >= 9) {
            return;
        }

        // Reveal the square by making it a whole number (represents a revealed square)
        array[indexI][indexJ] = Math.floor(array[indexI][indexJ]);

        // If the revealed square is a mime (-1) we have lost the game
        if (array[indexI][indexJ] === -1) {

            // Update the square to mark it as the mime that was triggered
            array[indexI][indexJ] = -2;

            // Callback that the game has been lost
            props.lostGameCallback();

            // Call the mime revealed function on the board square
            ref.current[getRefIndex(width, indexI, indexJ)].mimeRevealed();

            // Exit function
            return;
        }

        // Else the revealed square is not a mime
        else {

            // Array to hold any squares that are revealed if the clicked on square had no neighboring mimes
            var zeroNeighbors = [];

            // The clicked on square has no neighboring mimes, in this case we reveal all its neighbors by updating the board array
            // If any of its neighbors also have no neighboring mimes we reveal its neighbors, and so on, recursively
            // This is a time saver for the user and is a better experience than them clicking through all of these
            if (array[indexI][indexJ] === 0) {

                // Store the coordinates of all visited squares
                zeroNeighbors = logic.visitZeroNeighbors(array, indexI, indexJ);
            }

            // Callback to increment the number of squares we revealed, this is how we track if the user has won
            props.incrementSquaresWonCallback(zeroNeighbors.length + 1);

            // For all the neighbors visited we need to refresh their component on screen
            for (var n = 0; n < zeroNeighbors.length; n++) {

                // Get the index in the 1D ref array of the visited neighbors
                var refIndex = getRefIndex(width, zeroNeighbors[n][0], zeroNeighbors[n][1]);

                // Call the refresh function on the board square component
                ref.current[refIndex].refresh(array[zeroNeighbors[n][0]][zeroNeighbors[n][1]]);
            }
        }

        // Refresh the initially clicked on square component
        ref.current[getRefIndex(width, indexI, indexJ)].refresh(array[indexI][indexJ]);
    }

    /**
     * Function to process square right-clicked (Desktop) or long-pressed (Mobile or Tablet)
     * The main function is to flag the square as potentially hiding a mime
     * @param {The square's row} indexI 
     * @param {The square's column} indexJ
     */
    function btnRightClickCallback(indexI, indexJ) {

        // If the Flag Guess toggle button is disabled we do not allow flags, so return
        if (!guessButtonToggled) {
            return;
        }

        // If the square is already flagged we remove the flag
        if (array[indexI][indexJ] >= 9) {

            // Square is marked unflagged by removing 10 from it (>= 9 represents a flagged square)
            array[indexI][indexJ] = Number((array[indexI][indexJ] - 10).toFixed(1));

            // Update the number of flags we have placed on the board
            props.incrementGuessCountCallback(-1);
        }

        // Else we flag the square
        else {

            // Square is marked flagged by adding 10 to it (>= 9 represents a flagged square)
            array[indexI][indexJ] = Number((array[indexI][indexJ] + 10).toFixed(1));

            // Update the number of flags we have placed on the board
            props.incrementGuessCountCallback(1);
        }

        // Refresh the board square component selected
        ref.current[getRefIndex(width, indexI, indexJ)].refresh(array[indexI][indexJ]);
    }

    /**
     * Function to process a chord action, which is when we left-click (Desktop)
     * or tap (Mobile or Tablet) a revealed number square.
     * A chord action will reveal all neighboring squares of this square, providing that
     * the correct amount of flags have been placed around the square.
     * Ex: If we click on a Number 2 square. If there are already 2 flags beside it then we will reveal
     * all the other unrevealed and unflagged squares that are its neighbors.
     * This is to improve gameplay by making clearing the board faster and less monotonous.
     * @param {The square's row} indexI
     * @param {The square's column} indexJ
     */
    function btnChordActionCallback(indexI, indexJ) {

        // Get the coordinates of squares to be revealed as part of the chord action
        var revealedNeighbors = logic.getChordActionNeighbors(array, indexI, indexJ);

        // Perform left click action on all of the neighbors we wish to reveal
        for (var index = 0; index < revealedNeighbors.length; index++) {
            btnLeftClickCallback(revealedNeighbors[index][0], revealedNeighbors[index][1]);
        }
    }

    /**
     * Function to refresh all squares on the board, required when we start a new game or clear the board on win/lose
     */
    function refreshAllSquares() {

        // Loop through every square on the board
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {

                // Call refresh on the board square component
                ref.current[getRefIndex(width, i, j)].refresh(array[i][j]);
            }
        }
    }


    // RENDER

    return <Box
        sx={sx.board}
    >
        {Array.from(Array(height)).map((_, indexI) => (
            <Box
                key={indexI}
                sx={sx.squareRow}
            >
                {Array.from(Array(width)).map((_, indexJ) => (
                    <BoardSquare
                        key={indexI + "_" + indexJ}
                        ref={pushRef}
                        numOfMimeNeighbors={array[indexI][indexJ]}
                        indexI={indexI}
                        indexJ={indexJ}
                        btnLeftClickCallback={btnLeftClickCallback}
                        btnRightClickCallback={btnRightClickCallback}
                        btnChordActionCallback={btnChordActionCallback}
                    />
                ))}
            </Box>
        ))}
    </Box>;
});

// PROP LIST

Board.propTypes = {
    array: PropTypes.array,
    incrementSquaresWonCallback: PropTypes.func,
    lostGameCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func
}

// EXPORT

export default Board;