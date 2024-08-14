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
    guessButtonToggledCallback: PropTypes.func
}

// COMPONENT

function GameBoard(props) {

    // REFS

    var ref = useRef(null);

    // LOCAL VARIABLES

    var height = props.height;
    var width = props.width;
    var numOfMimes = props.numOfMimes;

    const array = logic.createNewBoard(height, width, numOfMimes);

    var squaresToWin = (height * width) - numOfMimes;
    var squaresWon = 0;

    // EFFECTS

    useEffect(() => {
        ref.current.refresh(array, height, width);
    });

    // LOCAL FUNCTIONS

    function lostGameCallback() {
        logic.clearGameBoard(array);
        ref.current.refresh(array, height, width);
        props.displayLoseMessageCallback();
    }

    function incrementSquaresWonCallback(count) {
        squaresWon += count;

        if (squaresWon === squaresToWin) {
            logic.clearGameBoard(array);
            ref.current.refresh(array, height, width);
            props.displayWinMessageCallback();
        }
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