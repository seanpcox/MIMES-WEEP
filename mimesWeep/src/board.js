import BoardSquare from './boardSquare.js'
import { Grid } from '@mui/material';

import PropTypes from 'prop-types';

Board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    numOfMimes: PropTypes.number,
}

function Board(props) {    
    if(props.height <= 0 || props.width <= 0) {
        alert("Board height and width must be greater than zero.")
        return;
    }

    const array = createEmptyBoard(props.height, props.width);
    
    addMimes(array, props.numOfMimes);
    
    addMimeNeighborCount(array);

    return <div>
        {Array.from(Array(props.height)).map((_, indexI) => (
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} key={indexI}>
            {Array.from(Array(props.width)).map((_, indexJ) => (
            <Grid item xs={1} sm={1} md={1} key={indexJ}>
                <BoardSquare height={props.height} width={props.width} mimeNeighborCount={array[indexI][indexJ]} callbackFunction={squareClicked} />
            </Grid>
            ))}
        </Grid>
        ))}
    </div>;
}

function createEmptyBoard(height, width) {
    const array = new Array(height)

    for (var i = 0; i < height; i++) {
        array[i] = new Array(width).fill(0)
    }

    return array;
};

function addMimes(array, numOfMimes) {
    var height = array.length;
    var width = array[0].length;

    // Add check that numOfMimes is less than the number of board squares
    if (numOfMimes > (height * width)) {
        numOfMimes = (height * width);
        console.warn("Mime count exceeded board spaces. Mime count will be set to the number of board spaces.")
    }

    // Is there a better way to do this? May take a while for a large board and a high mime count.
    for (var count = 0; count < numOfMimes; count++) {
        do {
            var i = Math.floor(Math.random() * height);
            var j = Math.floor(Math.random() * width);
        } while (array[i][j] !== 0);

        array[i][j] = -1;
    }
}

function addMimeNeighborCount(array) {
    var height = array.length;
    var width = array[0].length;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (array[i][j] == -1) {
                visitMimeNeighbors(array, i, j);
            }
        }
    }
}

function visitMimeNeighbors(array, i, j) {
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

            // Update the number of nearby mimes on the neighbour. We ignore neighbors themselves mimes.
            if (array[neighbors[count][0]][neighbors[count][1]] != -1) {
                array[neighbors[count][0]][neighbors[count][1]]++;
            }
        }
    }
}

function squareClicked(i, j) {
    console.log(i,j);
}

export default Board;