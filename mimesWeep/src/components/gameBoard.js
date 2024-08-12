import * as logic from '../logic/gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

GameBoard.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfMimes: PropTypes.number,
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func
}

function GameBoard(props) {
    var ref = useRef(null);

    var height = props.height;
    var width = props.width;
    var numOfMimes = props.numOfMimes;

    const array = logic.createNewBoard(height, width, numOfMimes);

    useEffect(() => {
        ref.current.refresh(array, height, width);
    });

    var squaresToWin = (height * width) - numOfMimes;
    var squaresWon = 0;

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

export default GameBoard;