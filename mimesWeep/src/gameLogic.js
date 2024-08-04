export function createEmptyBoard(height, width) {
    const array = new Array(height)

    for (var i = 0; i < height; i++) {
        array[i] = new Array(width).fill(0.1)
    }

    return array;
};

export function addMimes(array, numOfMimes) {
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
        } while (array[i][j] !== 0.1);

        array[i][j] = -0.9;
    }
}

export function addMimeNeighborCount(array) {
    var height = array.length;
    var width = array[0].length;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (array[i][j] < 0) {
                visitMimeNeighbors(array, i, j);
            }
        }
    }
}

export function clearGameBoard(array) {
    var height = array.length;
    var width = array[0].length;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (array[i][j] % 1 != 0) {
                array[i][j] = Math.round(array[i][j]);
            }
        }
    }
}

export function visitMimeNeighbors(array, i, j) {
    const neighbors = getNeighbourCoordinates(i, j);

    for (var count = 0; count < neighbors.length; count++) {
        // Check neighbor location is within the array boundary
        if (checkWithinBounds(array, neighbors[count])) {
            // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes.
            if (array[neighbors[count][0]][neighbors[count][1]] >= 0) {
                array[neighbors[count][0]][neighbors[count][1]]++;
            }
        }
    }
}

export function visitZeroNeighbors(array, i, j, squaresCleared = 0) {
    const neighbors = getNeighbourCoordinates(i, j);

    for (var count = 0; count < neighbors.length; count++) {
        // Check neighbor location is within the array boundary
        if (checkWithinBounds(array, neighbors[count])) {
            // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes.
            if (array[neighbors[count][0]][neighbors[count][1]] === 0.1) {
                array[neighbors[count][0]][neighbors[count][1]] = 0;
                squaresCleared++;
                squaresCleared += visitZeroNeighbors(array, neighbors[count][0], neighbors[count][1]);
            } else if (array[neighbors[count][0]][neighbors[count][1]] % 1 != 0 && !(array[neighbors[count][0]][neighbors[count][1]] >= 9)) {
                array[neighbors[count][0]][neighbors[count][1]] = Number((array[neighbors[count][0]][neighbors[count][1]] - 0.1).toFixed(1));
                squaresCleared++;
            }
        }
    }

    return squaresCleared;
}

function getNeighbourCoordinates(i, j) {
    return [[i + 1, j],
    [i + 1, j + 1],
    [i + 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i - 1, j - 1],
    [i, j + 1],
    [i, j - 1]];
}

function checkWithinBounds(array, coordinates) {
    var height = array.length;
    var width = array[0].length;

    return coordinates[0] >= 0 && coordinates[0] < height
        && coordinates[1] >= 0 && coordinates[1] < width;
}