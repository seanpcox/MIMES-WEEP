import BoardSquare from './boardSquare.js'
import { Grid } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

Board.propTypes = {
    array: PropTypes.array,
    incrementSquaresWonCallback: PropTypes.func,
    startNewGameCallback: PropTypes.func
}

function Board(props) {
    const [state, setState] = useState(0);

    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    function btnLeftClickCallback(indexI, indexJ) {
        if(array[indexI][indexJ] >= 9) {
            return;
        }

        var squaresWonOnClick = 1;

        array[indexI][indexJ] = Number((array[indexI][indexJ] - 0.1).toFixed(1));

        if (array[indexI][indexJ] === 0) {
            squaresWonOnClick += visitZeroNeighbors(array, indexI, indexJ);
            console.log(squaresWonOnClick);
        } else if (array[indexI][indexJ] === -1) {
            alert("Sorry, you have lost.");
            props.startNewGameCallback();
            return;
        }

        setState(state + 1);

        props.incrementSquaresWonCallback(squaresWonOnClick);
    }

    function btnRightClickCallback(indexI, indexJ) {
        if(array[indexI][indexJ] >= 9) {
            array[indexI][indexJ] = Number((array[indexI][indexJ] - 10).toFixed(1));
        } else {
            array[indexI][indexJ] = Number((array[indexI][indexJ] + 10).toFixed(1));
        }

        setState(state + 1);
    }

    return <div>
        {Array.from(Array(height)).map((_, indexI) => (
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} key={indexI}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <Grid item xs={1} sm={1} md={1} key={indexJ}>
                        <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} 
                            btnLeftClickCallback={btnLeftClickCallback} btnRightClickCallback={btnRightClickCallback} />
                    </Grid>
                ))}
            </Grid>
        ))}
    </div>;
}

function visitZeroNeighbors(array, i, j, squaresCleared=0) {
    var height = array.length;
    var width = array[0].length;

    const neighbors = [[i + 1, j],
    [i + 1, j + 1],
    [i + 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i - 1, j - 1],
    [i, j + 1],
    [i, j - 1]];

    for (var count = 0; count < neighbors.length; count++) {
        // Check neighbor location is within the array boundary
        if (neighbors[count][0] >= 0 && neighbors[count][0] < height &&
            neighbors[count][1] >= 0 && neighbors[count][1] < width) {

            console.log(array[neighbors[count][0]][neighbors[count][1]], array[neighbors[count][0]][neighbors[count][1]] % 1,
                array[neighbors[count][0]][neighbors[count][1]] % 1 != 0,
                !(array[neighbors[count][0]][neighbors[count][1]] >= 9),
                array[neighbors[count][0]][neighbors[count][1]] % 1 != 0 && !(array[neighbors[count][0]][neighbors[count][1]] >= 9)
            );

            // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes.
            if (array[neighbors[count][0]][neighbors[count][1]] === 0.1) {
                array[neighbors[count][0]][neighbors[count][1]] = 0;
                squaresCleared++;
                squaresCleared += visitZeroNeighbors(array, neighbors[count][0], neighbors[count][1]);
            } else if (array[neighbors[count][0]][neighbors[count][1]] % 1 != 0 && !(array[neighbors[count][0]][neighbors[count][1]] >= 9)) {
                console.log("Here");
                array[neighbors[count][0]][neighbors[count][1]] = Number((array[neighbors[count][0]][neighbors[count][1]] - 0.1).toFixed(1));
                squaresCleared++;
            }
        }
    }

    return squaresCleared;
}

export default Board;