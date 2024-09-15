import * as logic from '../logic/gameLogic.js';
import * as sx from '../style/boardSx.js';
import BoardSquare from './boardSquare.js'
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

/**
 * Component containing all the board squares
 */

// COMPONENT

const Board = forwardRef(function Board(props, inputRef) {

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
             * Imperative function that reveals all unrevealed squares
             */
            revealAll() {

                // Reveal all unrevealed squares
                revealAllSquares();
            },
            /* Imperative function that sets new game parameters and refreshes all revealed board squares
             * @param {The new game board 2D array} newArray
             */
            update(newGameArray) {
                // Update the game parameters
                array = newGameArray;
                height = array.length;
                width = array[0].length;

                // Refresh all squares
                refreshAllSquares();
            },
            /**
            * Imperative function to give the user a hint
            */
            giveHint() {
                return giveMimeHint();
            }
        };
    }, []);


    // EFFECTS

    // Effect to reference all of our board squares in a 1D array
    useEffect(() => {
        // After render we update our actual ref object to match tempRef
        ref.current = tempRef;

        return () => {
            // On unmount we reset the refs so they are empty for next render
            ref.current = null;
        }
    });


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

        // If a hinted flag we do not remove it or allow it to be altered at game end
        if (array[indexI][indexJ] >= 19) {
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
     * or tap (Mobile or Tablet) a revealed number square, if isReveal set to true.
     * Or function to highlight potential mimesquares only when we press down
     * and to unhighlight them when we press up or move away, if isReveal set to false.
     * A chord action will reveal all neighboring squares of this square, providing that
     * the correct amount of flags have been placed around the square.
     * Ex: If we click on a Number 2 square. If there are already 2 flags beside it then we will reveal
     * all the other unrevealed and unflagged squares that are its neighbors.
     * This is to improve gameplay by making clearing the board faster and less monotonous.
     * @param {The square's row} indexI
     * @param {The square's column} indexJ
     * @param {bool} isReveal
     * @param {boolean} [isHighlight=false] 
     */
    function btnChordActionCallback(indexI, indexJ, isReveal, isHighlight = false) {

        // Get the coordinates of squares to be revealed as part of the chord action
        var revealNeighborsCoords = logic.getChordActionNeighbors(array, indexI, indexJ);

        // If we have neighbors to reveal
        if (revealNeighborsCoords && revealNeighborsCoords.length > 0 && isReveal) {
            // Perform left click action on all of the neighbors we wish to reveal
            for (let index = 0; index < revealNeighborsCoords.length; index++) {
                btnLeftClickCallback(revealNeighborsCoords[index][0], revealNeighborsCoords[index][1]);
            }

            // Exit
            return;
        }

        // Else highlight any neighboring squares that could be potential mimes
        var hNgCoords = logic.getUnrevleadUnflaggedNeighbors(array, indexI, indexJ);

        // Perform highlight on all of the unrevealed and unflagged neighbors
        for (let index = 0; index < hNgCoords.length; index++) {
            ref.current[getRefIndex(width, hNgCoords[index][0], hNgCoords[index][1])].hightlight(isHighlight);
        }
    }

    /**
     * Function to reveal all unrevealed squares on the board
     */
    function revealAllSquares() {

        // Loop through every square on the board
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {

                // If the square is not a whole number it has not been revealed
                if (array[i][j] % 1 !== 0) {
                    // Reveal the square by making it a whole number.
                    // We round here vs using Math.floor() as we can have squares with mimes with -0.9 that 
                    // we need to change to -1 and squares with +0.1, +0.2 where we need to change to 0.0
                    array[i][j] = Math.round(array[i][j]);

                    // Call refresh on the board square component
                    ref.current[getRefIndex(width, i, j)].refresh(array[i][j]);
                }
            }
        }
    }

    /**
    * Function to refresh all squares on the board
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

    /**
     * Function to give a hint to the user by displaying the position of a mime on the board
     * First we will attempt to show a mime next to a random revealed number square
     * If that is not possible we will just show a random mime position
     */
    function giveMimeHint() {

        // Get the location of an unrevealed mime on the board, preferably one beside a revealed number square
        // Provide the previous 1D hint indexes to ensure we don't get the same hint repeated
        var mimeCoords = logic.getHint(array);

        // If we found no hint then return false to indicate we did not find a mime
        if (!mimeCoords) {
            return false;
        }

        // Update the number of flags we have placed on the board
        // Only do this if we are not replacing a user flag
        if (!mimeCoords[3]) {
            props.incrementGuessCountCallback(1);
        }

        // Refresh the board square component hinted to display the hint icon
        ref.current[getRefIndex(width, mimeCoords[0], mimeCoords[1])].refresh(array[mimeCoords[0]][mimeCoords[1]]);

        // Return true to indicate we did not find a mime
        return true;
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
    incrementGuessCountCallback: PropTypes.func
}

// EXPORT

export default Board;