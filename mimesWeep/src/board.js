import BoardSquare from './boardSquare.js'
import { Grid } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

Board.propTypes = {
    array: PropTypes.array
}

function Board(props) {
    const [state, setState] = useState(0);

    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    function btnClickedCallback(indexI, indexJ) {
        array[indexI][indexJ] -= 0.1;

        console.log(indexI, indexJ, array[indexI][indexJ])

        if (array[indexI][indexJ] === 0) {
            visitZeroNeighbors(array, indexI, indexJ);
        } else if (array[indexI][indexJ] === -1) {
            alert("Sorry, you have lost.");
        }

        setState(state + 1);
    }

    return <div>
        {Array.from(Array(height)).map((_, indexI) => (
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} key={indexI}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <Grid item xs={1} sm={1} md={1} key={indexJ}>
                        <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} btnClickedCallback={btnClickedCallback} />
                    </Grid>
                ))}
            </Grid>
        ))}
    </div>;
}

function visitZeroNeighbors(array, i, j) {
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

            // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes.
            if (array[neighbors[count][0]][neighbors[count][1]] === 0.1) {
                array[neighbors[count][0]][neighbors[count][1]] = 0;
                visitZeroNeighbors(array, neighbors[count][0], neighbors[count][1]);
            }
        }
    }
}

export default Board;