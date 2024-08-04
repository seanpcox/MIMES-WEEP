import BoardSquare from './boardSquare.js'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as logic from './gameLogic.js';

Board.propTypes = {
    array: PropTypes.array,
    incrementSquaresWonCallback: PropTypes.func,
    lostGameCallback: PropTypes.func,
    clearBoardCallback: PropTypes.func
}

function Board(props) {
    const [state, setState] = useState(0);

    useEffect(() => {
        props.clearBoardCallback([state, setState]);
    }, [props.clearBoardCallback, state]);

    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    function btnLeftClickCallback(indexI, indexJ) {
        if (array[indexI][indexJ] >= 9) {
            return;
        }

        var squaresWonOnClick = 1;

        array[indexI][indexJ] = Number((array[indexI][indexJ] - 0.1).toFixed(1));

        if (array[indexI][indexJ] === 0) {
            squaresWonOnClick += logic.visitZeroNeighbors(array, indexI, indexJ);
        } else if (array[indexI][indexJ] === -1) {
            props.lostGameCallback();
            return;
        }

        setState(state + 1);

        props.incrementSquaresWonCallback(squaresWonOnClick);
    }

    function btnRightClickCallback(indexI, indexJ) {
        if (array[indexI][indexJ] >= 9) {
            array[indexI][indexJ] = Number((array[indexI][indexJ] - 10).toFixed(1));
        } else {
            array[indexI][indexJ] = Number((array[indexI][indexJ] + 10).toFixed(1));
        }

        setState(state + 1);
    }

    return <div>
        {Array.from(Array(height)).map((_, indexI) => (
            <div key={indexI}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} key={indexJ}
                        btnLeftClickCallback={btnLeftClickCallback} btnRightClickCallback={btnRightClickCallback} />
                ))}
            </div>
        ))}
    </div>;
}

export default Board;