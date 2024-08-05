import './mimesWeep.css';
import * as logic from './gameLogic.js';
import Board from './board.js'
import PropTypes from 'prop-types';

GameBoard.propTypes = {
    difficulty: PropTypes.number,
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func
}

function GameBoard(props) {
    var height;
    var width;
    var numOfMimes;

    switch (props.difficulty) {
        case 2:
            height = 16;
            width = 16;
            numOfMimes = 40;
            break;
        case 3:
            height = 16;
            width = 30;
            numOfMimes = 99;
            break;
        case 4:
            height = 18;
            width = 42;
            numOfMimes = 190;
            break;
        default:
            height = 9;
            width = 9;
            numOfMimes = 10;
            break;
    }

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