export function createNewBoard(height, width, numOfMimes) {
    const array = createEmptyBoard(height, width);

    addMimes(array, numOfMimes);

    addMimeNeighborCount(array);

    return array;
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
            } else if (array[neighbors[count][0]][neighbors[count][1]] % 1 !== 0 && !(array[neighbors[count][0]][neighbors[count][1]] >= 9)) {
                array[neighbors[count][0]][neighbors[count][1]] = Number((array[neighbors[count][0]][neighbors[count][1]] - 0.1).toFixed(1));
                squaresCleared++;
            }
        }
    }

    return squaresCleared;
}

export function clearGameBoard(array) {
    var height = array.length;
    var width = array[0].length;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (array[i][j] % 1 !== 0) {
                array[i][j] = Math.round(array[i][j]);
            }
        }
    }
}

function createEmptyBoard(height, width) {
    const array = new Array(height)

    for (var i = 0; i < height; i++) {
        array[i] = new Array(width).fill(0.1)
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

    var arrayIDIndexes = [];

    for (let i = 0; i < height * width; i++) {
        arrayIDIndexes.push(i);
    }

    randomizeArray(arrayIDIndexes);

    for (let count = 0; count < numOfMimes; count++) {
        var i = Math.floor(arrayIDIndexes[count] / width);
        var j = arrayIDIndexes[count] % width

        array[i][j] = -0.9;
    }
}

function addMimeNeighborCount(array) {
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

function visitMimeNeighbors(array, i, j) {
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

// Fisher–Yates (aka Knuth) Shuffle
function randomizeArray(array) {
    var i = array.length;

    while (i !== 0) {
        var randomI = Math.floor(Math.random() * i);
        i--;

        [array[i], array[randomI]] = [
            array[randomI], array[i]];
    }
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