import BoardSquare from './boardSquare.js'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as logic from './gameLogic.js';
import { Box } from '@mui/material';

Board.propTypes = {
    array: PropTypes.array,
    incrementSquaresWonCallback: PropTypes.func,
    lostGameCallback: PropTypes.func,
    clearBoardCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func
}

function Board(props) {
    const [state, setState] = useState(0);

    const [clearBoard, setClearBoard] = useState(false);

    useEffect(() => {
        props.clearBoardCallback([clearBoard, setClearBoard]);
    }, [props.clearBoardCallback, clearBoard]);

    const [guessButtonToggled, setGuessButtonToggled] = useState(false);

    useEffect(() => {
        props.guessButtonToggledCallback([guessButtonToggled, setGuessButtonToggled]);
    }, [props.guessButtonToggledCallback, guessButtonToggled]);

    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    function btnLeftClickCallback(indexI, indexJ) {
        if (guessButtonToggled) {
            btnRightClickCallback(indexI, indexJ);
            return;
        }

        if (array[indexI][indexJ] >= 9) {
            return;
        }

        array[indexI][indexJ] = Number((array[indexI][indexJ] - 0.1).toFixed(1));

        if (array[indexI][indexJ] === -1) {
            array[indexI][indexJ] = -2;
            props.lostGameCallback();
        } else {
            var squaresWonOnClick = 1;

            if (array[indexI][indexJ] === 0) {
                squaresWonOnClick += logic.visitZeroNeighbors(array, indexI, indexJ);
            }

            props.incrementSquaresWonCallback(squaresWonOnClick);
        }

        setState(state + 1);
    }

    function btnRightClickCallback(indexI, indexJ) {
        if (array[indexI][indexJ] >= 9) {
            array[indexI][indexJ] = Number((array[indexI][indexJ] - 10).toFixed(1));
            props.incrementGuessCountCallback(-1);
        } else {
            array[indexI][indexJ] = Number((array[indexI][indexJ] + 10).toFixed(1));
            props.incrementGuessCountCallback(1);
        }

        setState(state + 1);
    }

    return <Box sx={{ overflowX: "scroll", justifyContent: "center" }}>
        {Array.from(Array(height)).map((_, indexI) => (
            <Box key={indexI} sx={{ display: "flex", justifyContent: "center" }}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} key={indexJ}
                        btnLeftClickCallback={btnLeftClickCallback} btnRightClickCallback={btnRightClickCallback} />
                ))}
            </Box>
        ))}
    </Box>;
}

export default Board;