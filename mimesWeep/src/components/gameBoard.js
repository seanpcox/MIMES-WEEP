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

    var ref = useRef(null);


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


    // LOCAL VARIABLES

    // Game properties
    var height = props.height;
    var width = props.width;
    var numOfMimes = props.numOfMimes;

    // Create the 2D array that represents the game board
    const array = logic.createNewBoard(height, width, numOfMimes);

    // Track the number of squares we need to reveal to win (all squares except mimes must be revealed)
    var squaresToWin = (height * width) - numOfMimes;

    // Track the number of squares currently revealed
    var squaresWon = 0;


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
     * Function called when square, or squares, none a mime, is successfully revealed
     * @param {Number of squares revealed} count 
     */
    function incrementSquaresWonCallback(count) {

        // If the first square clicked then start the timer
        if (squaresWon === 0) {
            props.firstSquareRevealvedCallback();
        }

        // Increment the number of squares successfully revealed
        squaresWon += count;

        // If the number of squares revealed equal the number of squares need to win, we have won
        if (squaresWon === squaresToWin) {
            // Call the game won function
            gameWon();
        }
    }

    /**
     * Function to call if the user wins a game
     */
    function gameWon() {

        // Reveal all unrevealed square components on the board
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