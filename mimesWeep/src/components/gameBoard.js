import * as logic from '../logic/gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';


// PROP LIST

GameBoard.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfMimes: PropTypes.number,
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func,
    firstSquareRevealvedCallback: PropTypes.func
}

/**
 * Component that wraps the board and tracks the game progress
 */

// COMPONENT

function GameBoard(props) {

    // REFS

    var ref = useRef(null);


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

    // Effect to refresh the child board component with the new game array
    useEffect(() => {
        ref.current.refresh(array);
    });


    // LOCAL FUNCTIONS

    /**
     * Function called when the game has been lost
     */
    function lostGameCallback() {

        // Reveals all values in the gameboard 2D array not yet revealed
        logic.clearGameBoard(array);

        // Refresh all square components on the board
        ref.current.refresh(array);

        // Display lose message to the user
        props.displayLoseMessageCallback();
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

        // Reveals all values in the gameboard 2D array not yet revealed, which would be unflagged mimes
        logic.clearGameBoard(array);

        // Refresh all square components on the board
        ref.current.refresh(array);

        // Display win message to the user
        props.displayWinMessageCallback();
    }


    // RENDER

    return (
        <Board
            ref={ref}
            array={array}
            incrementSquaresWonCallback={incrementSquaresWonCallback}
            lostGameCallback={lostGameCallback}
            incrementGuessCountCallback={props.incrementGuessCountCallback}
            guessButtonToggledCallback={props.guessButtonToggledCallback}
        />
    );
}

// EXPORT

export default GameBoard;