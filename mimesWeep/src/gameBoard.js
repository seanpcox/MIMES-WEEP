import './mimesWeep.css';
import * as logic from './gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';

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
    var height = props.height;
    var width = props.width;
    var numOfMimes = props.numOfMimes;

    const array = logic.createNewBoard(height, width, numOfMimes);

    var squaresToWin = (height * width) - numOfMimes;
    var squaresWon = 0;

    var clearBoardChildFunction;

    const clearBoardCallback = (setStateCallback) => {
        if (setStateCallback) {
            clearBoardChildFunction = setStateCallback[1];
        } else {
            clearBoardChildFunction(true);
        }
    };

    function lostGameCallback() {
        logic.clearGameBoard(array);
        clearBoardCallback();
        props.displayLoseMessageCallback();
    }

    function incrementSquaresWonCallback(count) {
        squaresWon += count;

        if (squaresWon === squaresToWin) {
            logic.clearGameBoard(array);
            clearBoardCallback();
            props.displayWinMessageCallback();
        }
    }

    return (
        <Board array={array} incrementSquaresWonCallback={incrementSquaresWonCallback}
            lostGameCallback={lostGameCallback} clearBoardCallback={clearBoardCallback}
            incrementGuessCountCallback={props.incrementGuessCountCallback}
            guessButtonToggledCallback={props.guessButtonToggledCallback} />
    );
}

export default GameBoard;