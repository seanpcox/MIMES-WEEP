/**
 * Logic for Mimes Weep game functions: board creation, board validation, and board clear.
 * 
 * Note: Game logic was written as an exercise in keeping all state in-place in the array
 *       An object representing this state with variables and methods would otherwise be used 
 * 
 * A 2D array of floating point numbers is used to represent the entire board state.
 * 
 *  States:
 *
 *   v = -2
 *       Revealed and Triggered Mine
 *
 *   v = -1
 *       Revealed Mine
 *
 *   v = -0.9
 *       Unrevealed Mine
 *
 *   v = 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0
 *       Revelead Square with Math.floor(v) Mime Neighbors
 *
 *   v = 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1
 *       Unrevealed Square with Math.floor(v) Mime Neighbors
 *
 *   v = 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 8.2
 *       Unrevealed First Hint Square with Math.floor(v) Mime Neighbors
 *
 *   v = 9.0
 *       Correctly Flagged and Revealed Mime
 *
 *   v = 9.1
 *       Correctly Flagged and unrevealed Mime
 *
 *   v = 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0
 *       Incorrectly Flagged and Revealed Square
 *
 *   v = 10.1, 11.1, 12.1, 13.1, 14.1, 15.1, 16.1, 17.1, 18.1
 *       Incorrectly Flagged and Unrevealed Square
 *
 *   v = 19.0
 *       Hinted Correctly Flagged and Revealed Square
 *
 *   v = 19.1
 *       Hinted Correctly Flagged and Unrevealed Square
 *
 *
 *  Heuristics:
 *  
 *   v < 0:             Indicates a square with a mime
 *   v = 0 or 0.1:      Indicates a square with no neighboring mimes
 *   v >= 1 && v < 9:   Indicates a square with Math.floor(v) neighboring mimes
 *   v >= 9:            Indicates a square that has been flagged as a potential mime
 * 
 *   Whole number:      Indicates a revealed square
 *   Floating number:   Indicates an unrevealed square
 * 
 * 
 *  Logic:
 * 
 *   Game Start:        Mimes placed randomly on the board. The number is dependent on difficulty level or custom settings.
 *                      Non-mime squares are marked with the number of neighboring mimes they have (diagonal neighbors included).
 *                      0.1 is added to every square; a floating point number represents an unrevealed state.
 *                      The number of squares without a mime is recorded.
 *                      Flag badge count is set to the mime count.
 * 
 *   Square Selected:   0.1 is subtracted from the square; a whole number represents a revealed state.
 *                      The number of squares revealed by the user is tracked and incremented by 1.
 *                      If the square is now 0.0 all neighbouring squares are revealed by subracting 0.1 from them.
 *                          This is safe, and implemented as a time saver for the user, as none of its neighbors can be a mime.
 *                          If any neighboring squares are now 0.0 the same process is repeated for them; this continues recursively.
 *                      If the square is now -1.0 the game is lost, as the user clicked on a mime.
 *                          The square is marked as -2.0 to indicate this was the mime the user clicked on.
 *                      If the number of squares revealed by the user equals the number of squares without a mime the game is won.
 * 
 *   Square Flagged:    10 is added to the square.
 *                      Flag badge count is reduced by 1.
 * 
 *   Square Unflagged:  10 is subtracted from the square.
 *                      Flag badge count is increased by 1.
 * 
 *   Game Over:         0.1 is subtracted from any squares that are not whole numbers, thus revealing the entire board.
 *                      
 */

/**
 * Function to create a new 2D array representing the game board to play. Each entry representing a game square.
 * @param {Number of board rows} height 
 * @param {Number of board columns} width 
 * @param {Number of board mimes} numOfMimes 
 * @returns 2D array representing game board to play
 */
export function createNewBoard(height, width, numOfMimes) {

    // Create a array with {height} rows of {width} squares. All values assigned 0.1.
    const array = createEmptyBoard(height, width);

    // Randomly add the specified number of mimes to the board. Those values will be -0.9.
    // We are returned the shuffled 1D array of coordinates to use for the hint add.
    var arrayIDIndexes = addMimes(array, numOfMimes);

    // Update the non-mime square values to indicate how many neighoring mimes (diagonal included, so 8 neighbors max) it has.
    addMimeNeighborCount(array);

    // Add a hint to one square in the array i.e. indicate it is not a mime
    addHint(array, arrayIDIndexes, numOfMimes, width);

    // Return the board array to play.
    return array;
}

/**
 * Recursive function to visit and reveal all neighbors of a square that has no neighboring mimes.
 * This is safe, and implemented as a time saver for the user, as none of the square's neighbors can be a mime.
 * @param {Game board 2D array} array 
 * @param {Row of square with no neighboring mimes} i 
 * @param {Column of square with no neighboring mimes} j 
 * @param {Coordinates of squares revealed by this method} squaresClearedCoords 
 * @returns List of coordinates of squares revealed in this recursive operation
 */
export function visitZeroNeighbors(array, i, j, squaresClearedCoords = []) {

    // Get the coordinates of the square's potential 8 neighbors.
    const nCoords = getNeighbourCoordinates(i, j);

    // Visit each neighbor.
    for (var index = 0; index < nCoords.length; index++) {

        // Check neighbor location is within the array boundary, else skip
        if (checkWithinBounds(array, nCoords[index])) {

            // If a neighbor itself has no neighboring mimes, has not been revealved, and has not been flagged

            // 0.1 represents an unrevealed, unflagged square with no mime neighbors
            if (array[nCoords[index][0]][nCoords[index][1]] === 0.1) {

                // Reveal the square by making it a whole number (subtract 0.1).
                array[nCoords[index][0]][nCoords[index][1]] = 0;

                // Add the revealed square's coordinates to our list of visted squares
                squaresClearedCoords.push([nCoords[index][0], nCoords[index][1]]);

                // Now visit all the neighbors of this just revealed square
                var results = visitZeroNeighbors(array, nCoords[index][0], nCoords[index][1]);

                // Add all of the visited coordinates resulting from this neighbor
                for (var n = 0; n < results.length; n++) {
                    squaresClearedCoords.push(results[n]);
                }

            }

            // Else if a neighbor has neighboring mimes, is not a mime itself, has not been revealved, and has not been flagged

            // We check it is not a whole number (represents unrevealed)
            else if (array[nCoords[index][0]][nCoords[index][1]] % 1 !== 0
                // We check it is not 9 or more (represents a flagged square)
                && !(array[nCoords[index][0]][nCoords[index][1]] >= 9)) {

                // Reveal the square by making it a whole number (subtract 0.1). 
                // Fixed and Cast required as floating point numbers do not always resolve precisely.         
                array[nCoords[index][0]][nCoords[index][1]]
                    = Number((array[nCoords[index][0]][nCoords[index][1]] - 0.1).toFixed(1));

                // Add the revealed square's coordinates to our list of visted squares
                squaresClearedCoords.push([nCoords[index][0], nCoords[index][1]]);
            }
        }
    }

    // Return the list of coordinates of squares we visited
    return squaresClearedCoords;
}

/**
 * Function to get any squares to reveal as part of a "chord" action.
 * A chord action reveals all unrevealed and unflagged neighboring squares of a supplied
 * revealed number square, but only if it has the correct amount of neighboring squares flagged.
 * Ex: If we click on a Number 2 square. If there are already 2 flags beside it then we will reveal
 * all the other unrevealed and unflagged squares that are its neighbors.
 * This is to improve gameplay by making clearing the board faster and less monotonous.
 * @param {array} array
 * @param {number} i
 * @param {number} j
 * @return array of coordinates of any squares to reveal
 */
export function getChordActionNeighbors(array, i, j) {

    // The value of the supplied array position tells us how many flags we are expecting
    var flags = array[i][j];

    // The coordinates of the squares 8 potential neighbors
    var nCoords = getNeighbourCoordinates(i, j);

    // Visit each neighboring coordinate to count which are flags
    for (let index = 0; index < nCoords.length; index++) {

        // Check neighbor coordinate is within the array boundary, else skip
        if (checkWithinBounds(array, nCoords[index])) {

            // Check if neighbor is an unrevealed flag, and if so decrement our flag count
            if (array[nCoords[index][0]][nCoords[index][1]] > 9) {
                flags = flags - 1;
            }
        }
    }

    // If we have too few or too many neighboring flags then exit now
    if (flags !== 0) {
        return [];
    }

    // Return our 2d array of square coordinates to reveal
    return getUnrevleadUnflaggedNeighbors(array, i, j, nCoords);
}

/**
 * Function to get any neighboring squares that are unrevealed and unflagged for
 * a revealed square number.
 * @param {array} array
 * @param {number} i
 * @param {number} j
 * @param {any[][]} [nCoords=getNeighbourCoordinates(i, j)]
 * @return array of coordinates of unrevealed and unflagged neighboring squares
 */
export function getUnrevleadUnflaggedNeighbors(array, i, j, nCoords = getNeighbourCoordinates(i, j)) {

    // 2D array for return, containing coordinates of unrevealed and unflagged neighboring squares
    var potentialMimeCoords = [];

    // Visit each neighboring coordinate to see if it should be included
    for (let index = 0; index < nCoords.length; index++) {

        // Check neighbor coordinate is within the array boundary, else skip
        if (checkWithinBounds(array, nCoords[index])) {

            // We check it is not a whole number (represents already unrevealed)
            if (array[nCoords[index][0]][nCoords[index][1]] % 1 !== 0
                // We check it is not 9 or more (represents a flagged square)
                && !(array[nCoords[index][0]][nCoords[index][1]] >= 9)) {

                // Add the revealed square's coordinates to our list
                potentialMimeCoords.push([nCoords[index][0], nCoords[index][1]]);
            }
        }
    }

    // Return our 2d array of potential mime neighbor coordinates
    return potentialMimeCoords;
}

/**
 * Function to give us the location of a mime on the board as a hint for the user.
 * First we will attempt to find a mime next to a random revealed number square (more useful)
 * If that is not possible we will just show a random mime position.
 * Finally if that is not possible we will confirm any user placed flags
 * We also ensure we do not return a previous hint for the game by flagging in the calling function
 * @param {array} array
 * @param {Set} previousHints
 * @returns array of length 4: [0] i coord, [1] j coord, [2] 1D index, [3] bool user flagged
 */
export function getHint(array) {

    // Get the width
    var width = array[0].length;

    // Randomize the array's indexes, so we don't always show the most top-left hint
    var random1DIndexes = generate1DRandomizedArrayIndexes(array);

    // Backup mime location if we cannot find a mime beside a revealed number square
    var backupMimeCoords;

    // Backup flagged location if we cannot find an unflagged mime. This is to stop cheating
    // the hint count by placing flags and then using the guess to see if they don't get processed
    var backupFlaggedCoords;

    // Loop through the shuffled array until we reach our mime count
    for (let index1D = 0; index1D < random1DIndexes.length; index1D++) {

        // Convert the 1D array index back into an index for our 2D array
        let coords = getCoordsFromArrayIDIndex(random1DIndexes, index1D, width);

        // Find a revealed number square, we want to find mimes near these first if possible
        if (array[coords[0]][coords[1]] % 1 === 0) {

            // The coordinates of the squares 8 potential neighbors
            var nCoords = getNeighbourCoordinates(coords[0], coords[1]);

            // Visit each neighboring coordinate to see if there is an unrevealed mime
            for (let nIndex = 0; nIndex < nCoords.length; nIndex++) {

                // Check neighbor coordinate is within the array boundary, else skip
                if (checkWithinBounds(array, nCoords[nIndex])) {

                    // Check if unrevealed and unflagged mime, and if so return its coordinates
                    if (array[nCoords[nIndex][0]][nCoords[nIndex][1]] === -0.9) {

                        // Set the value of the hinted board square to be a hinted flag square
                        array[nCoords[nIndex][0]][nCoords[nIndex][1]] = 19.1;

                        // Return the coodrinates so we can refresh the square
                        return [nCoords[nIndex][0], nCoords[nIndex][1], random1DIndexes[index1D], false];
                    }
                }
            }
        }
        // Else if we do not have a backup mime hint and the index we are investigating
        // is a mime, and we have not previsouly unflagged this mime, then store its coordinates
        // in case we need them later for return
        else if (!backupMimeCoords && array[coords[0]][coords[1]] === -0.9) {
            backupMimeCoords = [coords[0], coords[1], random1DIndexes[index1D], false];
        }
        // Else if there are no unflagged mimes, but we have user flagged mimes we will
        // replace it with a hint flagged mime to confirm their flag. Do this to stop
        // cheating hint count by using hint to see if flag is correct.
        else if (!backupFlaggedCoords && array[coords[0]][coords[1]] === 9.1) {
            backupFlaggedCoords = [coords[0], coords[1], random1DIndexes[index1D], true];
        }
    }

    // If we found and need to use a backup mime coordinates then return it
    if (backupMimeCoords) {
        // Set the value of the hinted board square to be a hinted flag square
        array[backupMimeCoords[0]][backupMimeCoords[1]] = 19.1;

        // Return the coodrinates so we can refresh the square
        return backupMimeCoords;
    }

    // If we found and need to use user flagged mime coordinates then return it
    if (backupFlaggedCoords) {
        // Set the value of the hinted board square to be a hinted flag square
        array[backupFlaggedCoords[0]][backupFlaggedCoords[1]] = 19.1;

        // Return the coodrinates so we can refresh the square
        return backupFlaggedCoords;
    }
}

/**
 * Function to ensure mime count does not exceed the number of board squares available
 * @param {Number of board rows} height 
 * @param {Number of board columns} width 
 * @param {Number of board mimes} numOfMimes 
 * @returns Sanatized number of mimes
 */
export function sanitizeMimeCount(height, width, numOfMimes) {
    // Check that numOfMimes is not greater than the number of board squares
    if (numOfMimes > (height * width)) {

        // If it is then make the number of mimes equal to the number of board squares
        numOfMimes = (height * width);
        console.warn("Mime count exceeded board squares. Mime count will be set to the number of board squares.");
    }

    // Return the sanatized number of mimes
    return numOfMimes;
}

/**
 * Create the empty board (2D array) for our game
 * @param {Number of board rows} height 
 * @param {Number of board columns} width 
 * @returns 2D array represented empty board of unvisted squares
 */
function createEmptyBoard(height, width) {

    // Create an empty 1D array representing our board rows of size height
    const array = new Array(height)

    // For each entry add an array of 0.1 values of size width
    // 0.1 represents an unrevealed, unflagged square with no mime neighbors
    for (var i = 0; i < height; i++) {
        array[i] = new Array(width).fill(0.1)
    }

    // Return our 2D array
    return array;
};

/**
 * Function to add a specified number of mimes to random locations in our 2D array game board
 * @param {Game board 2D array} array 
 * @param {Number of board mimes} numOfMimes 
 * @returns array of shuffled coordinates in 1D format
 */
function addMimes(array, numOfMimes) {
    var height = array.length;
    var width = array[0].length;

    // Ensure number of mimes does not exceed number of board squares
    numOfMimes = sanitizeMimeCount(height, width, numOfMimes);

    // Get a randmoized order of our arrays' indexes
    var arrayIDIndexes = generate1DRandomizedArrayIndexes(array);

    // Loop through the shuffled array until we reach our mime count
    for (let index = 0; index < numOfMimes; index++) {
        // Convert the 1D array index back into an index for our 2D array
        let coords = getCoordsFromArrayIDIndex(arrayIDIndexes, index, width);

        // Set the square to represent an unrevealed mime
        array[coords[0]][coords[1]] = -0.9;
    }

    return arrayIDIndexes;
}

/**
 * Create a 1D array representing the coordinates of all squares on our board put in random order
 *  Ex: In a 2X2 2D array the index of the first square on the second row would be 2,
 *  where 0 and 1 represent the values in the first row
 * @param {array} array
 * @returns Randmoized 1D array representing every index in the board
 */
function generate1DRandomizedArrayIndexes(array) {

    // Get the dimensions
    var height = array.length;
    var width = array[0].length;

    // Create a 1D array representing the coordinates of all squares on our board
    // Ex: In a 2X2 2D array the index of the first square on the second row would be 2, 
    // where 0 and 1 represent the values in the first row
    var arrayIDIndexes = [];

    for (let i = 0; i < height * width; i++) {
        arrayIDIndexes.push(i);
    }

    // Shuffle the array coordinates
    shuffleArray(arrayIDIndexes);

    return arrayIDIndexes;
}

/**
 * Function to label how many mimes are adjacent to each square
 * @param {Game board 2D array} array 
 */
function addMimeNeighborCount(array) {
    var height = array.length;
    var width = array[0].length;

    // Loop through every square on the board
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            // If the square is a mime (negative value) then visit its neighbors (8 max)
            if (array[i][j] < 0) {
                visitMimeNeighbors(array, i, j);
            }
        }
    }
}

/**
 * Function to visit all neighbors (8 max) of a mime square and increment their value, 
 * representing their mime neighbor count.
 * @param {Game board 2D array} array 
 * @param {Row of square} i 
 * @param {Column of square} j 
 */
function visitMimeNeighbors(array, i, j) {

    // Get the coordinates of the square's potential 8 neighbors.
    const neighbors = getNeighbourCoordinates(i, j);

    // Loop through each coordinate
    for (var count = 0; count < neighbors.length; count++) {
        // Check neighbor location is within the array boundary
        if (checkWithinBounds(array, neighbors[count])) {
            // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes (negative values)
            if (array[neighbors[count][0]][neighbors[count][1]] >= 0) {
                array[neighbors[count][0]][neighbors[count][1]]++;
            }
        }
    }
}

/**
 * Function to add a hint to the array according to the hint code number:
 * 0: No hint
 * 1: Hint on any non-mime square
 * 2: Hint on any non-mime square with no mime neighbors, if not possible fall back to 1
 * @param {array} array
 * @param {array} arrayIDIndexes
 * @param {array} numOfMimes
 * @param {number} width 
 * @param {number} hintCode
 */
function addHint(array, arrayIDIndexes, numOfMimes, width, hintCode = 2) {
    // We have chosen not to add any hints so return
    if (hintCode === 0) {
        return;
    } else if (hintCode === 2) {
        // We previously added mimes to the index range (0 to numOfMimes - 1) using this shuffled array
        // Therefore we know we can not hint an indexes before numOfMimes index
        // We loop through until we find an entry with no mime neighbors and mark it as a hint
        // If we find none, then we fallback to hint code 1 logic
        for (var index = numOfMimes; index < arrayIDIndexes.length; index++) {
            // Convert the 1D array index back into an index for our 2D array
            let coords = getCoordsFromArrayIDIndex(arrayIDIndexes, index, width);

            if (array[coords[0]][coords[1]] === 0.1) {
                // Set the square to represent a hint, that is it has no mime or mime neighbors
                // We need to do casting and to fixed decimal place as performing operations with decimals is not exact
                array[coords[0]][coords[1]] = Number(Number(array[coords[0]][coords[1]] + 0.1).toFixed(1));
                return;
            }
        }
    }

    // If we are here either our hint code was 1 or it was 2 but we found no squares without a mime neighbor

    // Convert the 1D array index back into an index for our 2D array
    // We previously added mimes to the index range (0 to numOfMimes - 1) using this shuffled array
    // Therefore we know that index at numOfMimes does not have a mime, so we will use it
    let coords = getCoordsFromArrayIDIndex(arrayIDIndexes, numOfMimes, width);

    // Set the square to represent a hint, that is it has no mime
    // We need to do casting and to fixed decimal place as performing operations with decimals is not exact
    array[coords[0]][coords[1]] = Number(Number(array[coords[0]][coords[1]] + 0.1).toFixed(1));
}

/**
 * Function to shuffle the values of an array using Fisher–Yates (aka Knuth) Shuffle
 * @param {1D array to shuffle} array 
 */
function shuffleArray(array) {

    // Fisher–Yates (aka Knuth) Shuffle
    var i = array.length;

    while (i !== 0) {
        var randomI = Math.floor(Math.random() * i);
        i--;

        [array[i], array[randomI]] = [
            array[randomI], array[i]];
    }
}

/**
 * Function to get the i and j coordinates back from a 1D index array
 * @param {array} arrayIDIndexes 
 * @param {number} index 
 * @param {number} width 
 * @returns array with i and j coordinates
 */
function getCoordsFromArrayIDIndex(arrayIDIndexes, index, width) {
    // Convert the 1D array index back into an index for our 2D array
    let i = Math.floor(arrayIDIndexes[index] / width);
    let j = arrayIDIndexes[index] % width;

    return [i, j];
}

/**
 * Function to return the coorindates of 8 potential neighbors (up, down, left, right, and the 4 diagonals)
 * @param {Row of square} i 
 * @param {Column of square} j 
 * @returns Coorindates of 8 potential neighbors
 */
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

/**
 * Function to check that a set of coordinates are within a 2D array's bounds
 * @param {Game board 2D array} array 
 * @param {Row and column coorindates} coordinates 
 * @returns True if coordinates are in array bounds, else False
 */
function checkWithinBounds(array, coordinates) {
    var height = array.length;
    var width = array[0].length;

    return coordinates[0] >= 0 && coordinates[0] < height
        && coordinates[1] >= 0 && coordinates[1] < width;
}