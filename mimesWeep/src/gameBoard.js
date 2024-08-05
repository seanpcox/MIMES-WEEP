import './mimesWeep.css';
import * as logic from './gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';

GameBoard.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfMimes: PropTypes.number,
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func
}

function GameBoard(props) {
    var height = props.height;
    var width = props.width;
    var numOfMimes = props.numOfMimes;

    const array = logic.createNewBoard(height, width, numOfMimes);

    var squaresToWin = (height * width) - numOfMimes;
    var squaresWon = 0;

    var clearBoard = 0;

    const clearBoardCallback = (setStateCallback) => {
        if (setStateCallback) {
            clearBoard = setStateCallback[1];
        } else {
            clearBoard(clearBoard + 1);
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
            lostGameCallback={lostGameCallback} clearBoardCallback={clearBoardCallback} />
    );
}

export default GameBoard;