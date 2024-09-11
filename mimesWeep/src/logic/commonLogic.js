/**
 * Logic common to different areas of our application
 */

/**
 * Funtion to get the time elapsed in human readable minutes (if applicable) and seconds
 * @param {Time in milliseconds} timeElapsedMs 
 * @param {boolean} [alwaysShowMinutes=true]
 * @returns Time elapsed string
 */
export function getTimeElapsedString(timeElapsedMs, alwaysShowMinutes = true) {

    // Convert time elapsed from millseconds into seconds
    let timeElapsedSeconds = timeElapsedMs / 1000;

    // Calculate how many minutes, floored to the nearest integer, have elapsed
    let minutes = Math.floor(timeElapsedSeconds / 60);

    // Calculate how many seconds, floored to the nearest integer, have elapsed
    let seconds = Math.floor(timeElapsedSeconds % 60);

    // If we have minutes or the flag is set to always display them return a minutes and seconds format
    if (alwaysShowMinutes || minutes > 0) {
        // Create the human readable minutes and seconds elapsed string
        let secondsString = (seconds < 10) ? "0" + seconds : seconds;

        // Return the human readable string
        return minutes + ":" + secondsString;
    }
    // Else return just a seconds format
    else {
        // Return the human readable string
        return seconds.toString();
    }
}