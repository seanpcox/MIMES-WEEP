import * as logic from '../logic/gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Component that wraps the board and tracks the game progress
 */

// COMPONENT

const GameBoard = forwardRef(function GameBoard(props, inputRef) {

    // REFS

    let ref = useRef(null);

    let squaresWonRef = useRef(new Set([]));


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to give the user a hint
             * @returns True if hint give, else False
             */
            giveHint() {
                return ref.current.giveHint();
            }
        };
    }, []);


    // EFFECTS

    // Effect to clear the squares won set on load and unload
    useEffect(() => {
        squaresWonRef.current = new Set([]);

        return () => squaresWonRef.current = new Set([]);
    });


    // LOCAL VARIABLES

    // Game properties
    let height = props.height;
    let width = props.width;
    let numOfMimes = props.numOfMimes;

    // Create the 2D array that represents the game board
    const array = logic.createNewBoard(height, width, numOfMimes);

    // Track the number of squares we need to reveal to win (all squares except mimes must be revealed)
    let squaresToWin = (height * width) - numOfMimes;


    // EFFECTS

    // Effect to update the child board component with the new game array
    useEffect(() => {
        ref.current.update(array);
    });


    // LOCAL FUNCTIONS

    /**
     * Function called when the game has been lost
     */
    function lostGameCallback() {

        // Reveal all unrevealed square components on the board
        ref.current.revealAll();

        // Display lose message to the user
        props.displayFinishMessageCallback(0);
    }

    /**
     * Function called when a square, or squares, none a mime, is successfully revealed
     * @param {1D coordinates of revealed squares} revealed1DCoords
     */
    function incrementSquaresWonCallback(revealed1DCoords) {

        // If this is the first square clicked on then start the timer
        if (squaresWonRef.current.size === 0) {
            props.firstSquareRevealvedCallback();
        }

        // Add the coordinates of all squares successfully revealed to our squares won set
        // We use a set to ensure no duplicates are accidently added
        for (const coords1D of revealed1DCoords) {
            squaresWonRef.current.add(coords1D);
        }

        // If the number of squares revealed equal the number of squares needed to win, we have won
        if (squaresWonRef.current.size === squaresToWin) {
            // Call the game won function
            gameWon();
        }
    }

    /**
     * Function to call if the user wins a game
     */
    function gameWon() {

        // Reveal all unrevealed square components on the board, these should only be unflagged mimes
        ref.current.revealAll();

        // Display win message to the user
        props.displayFinishMessageCallback(1);
    }


    // RENDER

    return (
        <Board
            ref={ref}
            array={array}
            incrementSquaresWonCallback={incrementSquaresWonCallback}
            lostGameCallback={lostGameCallback}
            incrementGuessCountCallback={props.incrementGuessCountCallback}
        />
    );
}
);

// PROP LIST

GameBoard.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfMimes: PropTypes.number,
    displayFinishMessageCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    firstSquareRevealvedCallback: PropTypes.func
}

// EXPORT

export default GameBoard;