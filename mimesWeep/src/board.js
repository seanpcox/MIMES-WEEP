import BoardSquare from './boardSquare.js'
import { useState, useEffect, useRef } from 'react';
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
    console.log("refresh board");

    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    var ref = useRef(null);
    var tempRef = [];

    const pushRef = (square) => {
        if (square !== null) {
            tempRef.push(square);
        }
    };

    useEffect(() => {
        ref.current = tempRef;

        return () => {
            ref.current = null;
        }
    });

    function getRefIndex(indexI, indexJ, width) {
        return (indexI * width) + indexJ;
    }

    const [state, setState] = useState(0);

    const [clearBoard, setClearBoard] = useState(false);

    useEffect(() => {
        props.clearBoardCallback([clearBoard, setClearBoard]);
    }, [props.clearBoardCallback, clearBoard]);

    const [guessButtonToggled, setGuessButtonToggled] = useState(false);

    useEffect(() => {
        props.guessButtonToggledCallback([guessButtonToggled, setGuessButtonToggled]);
    }, [props.guessButtonToggledCallback, guessButtonToggled]);

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

        ref.current[getRefIndex(width, indexI, indexJ)].refresh();

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

        ref.current[getRefIndex(width, indexI, indexJ)].refresh();

        setState(state + 1);
    }

    return <Box sx={{ overflowX: "scroll", justifyContent: "center" }}>
        {Array.from(Array(height)).map((_, indexI) => (
            <Box key={indexI} sx={{ display: "flex", justifyContent: "center", mx: 3 }}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} key={indexJ}
                        ref={pushRef}
                        btnLeftClickCallback={btnLeftClickCallback} btnRightClickCallback={btnRightClickCallback} />
                ))}
            </Box>
        ))}
    </Box>;
}

export default Board;