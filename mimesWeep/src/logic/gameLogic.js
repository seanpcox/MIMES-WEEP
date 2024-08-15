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
    addMimes(array, numOfMimes);

    // Update the non-mime square values to indicate how many neighoring mimes (diagonal included, so 8 neighbors max) it has.
    addMimeNeighborCount(array);

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
    const neighbors = getNeighbourCoordinates(i, j);

    // Visit each neighbor.
    for (var count = 0; count < neighbors.length; count++) {

        // Check neighbor location is within the array boundary, else skip
        if (checkWithinBounds(array, neighbors[count])) {

            // If a neighbor itself has no neighboring mimes, has not been revealved, and has not been flagged

            // 0.1 represents an unrevealed, unflagged square with no mime neighbors
            if (array[neighbors[count][0]][neighbors[count][1]] === 0.1) {

                // Reveal the square by making it a whole number (subtract 0.1).
                array[neighbors[count][0]][neighbors[count][1]] = 0;

                // Add the revealed square's coordinates to our list of visted squares
                squaresClearedCoords.push([neighbors[count][0], neighbors[count][1]]);

                // Now visit all the neighbors of this just revealed square
                var results = visitZeroNeighbors(array, neighbors[count][0], neighbors[count][1]);

                // Add all of the visited coordinates resulting from this neighbor
                for (var n = 0; n < results.length; n++) {
                    squaresClearedCoords.push(results[n]);
                }

            }

            // Else if a neighbor has neighboring mimes, is not a mime itself, has not been revealved, and has not been flagged

            // We check it is not a whole number (represents unrevealed)
            else if (array[neighbors[count][0]][neighbors[count][1]] % 1 !== 0
                // We check it is not 9 or more (represents a flagged square)
                && !(array[neighbors[count][0]][neighbors[count][1]] >= 9)) {

                // Reveal the square by making it a whole number (subtract 0.1). 
                // Fixed and Cast required as floating point numbers do not always resolve precisely.         
                array[neighbors[count][0]][neighbors[count][1]] = Number((array[neighbors[count][0]][neighbors[count][1]] - 0.1).toFixed(1));

                // Add the revealed square's coordinates to our list of visted squares
                squaresClearedCoords.push([neighbors[count][0], neighbors[count][1]]);
            }
        }
    }

    // Return the list of coordinates of squares we visited
    return squaresClearedCoords;
}

/**
 * Function to reveal all squares on a board not yet revealed
 * @param {Game board 2D array} array 
 */
export function clearGameBoard(array) {
    var height = array.length;
    var width = array[0].length;

    // Loop through every square on the board
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {

            // If the square is not a whole number it has not been visited
            if (array[i][j] % 1 !== 0) {
                // Reveal the square by making it a whole number.
                // We round here vs using Math.floor() as we can have squares with mimes with -0.9 value that we need to change to -1
                // and squares with +0.1 where we need to change to 0.0
                array[i][j] = Math.round(array[i][j]);
            }
        }
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
 */
function addMimes(array, numOfMimes) {
    var height = array.length;
    var width = array[0].length;

    // Ensure number of mimes does not exceed number of board squares
    numOfMimes = sanitizeMimeCount(height, width, numOfMimes);

    // Create a 1D array representing the coordinates of all squares on our board
    // Ex: In a 2X2 2D array the index of the first square on the second row would be 2, 
    // where 0 and 1 represent the values in the first row
    var arrayIDIndexes = [];

    for (let i = 0; i < height * width; i++) {
        arrayIDIndexes.push(i);
    }

    // Shuffle the array coordinates
    shuffleArray(arrayIDIndexes);

    // Loop through the shuffled array until we reach our mime count
    for (let count = 0; count < numOfMimes; count++) {
        // Convert the 1D array index back into an index for our 2D array
        var i = Math.floor(arrayIDIndexes[count] / width);
        var j = arrayIDIndexes[count] % width

        // Set the square to represent an unrevealed mime
        array[i][j] = -0.9;
    }
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
            // If the square is a mime (negative value) the visit its neighbors (8 max)
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