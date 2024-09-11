import * as gameText from '../resources/text/gameText.js';
import * as highScoreDB from '../logic/highScoreDB.js';
import * as sx from '../style/highScoreTableSx.js'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { Period } from "../models/index.js";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/**
 * Component table showing high scores for different difficulty levels
 *
 * Note 1: The last row displayed is the personal best data row
 * Note 2: The second last row is hidden (not displayed) and is an extra highscore row place,
 * which we use to determine scores we can delete without affecting the highscore positions
 * Note 3: All other rows are displayed highscore rows
 */

// COMPONENT

const HighScoreTable = forwardRef(function HighScoreTable(props, inputRef) {

    // STATES

    const [rows, setRows] = useState([]);


    // LOCAL VARIABLES

    // Store the rows locally as well, as state rows will not return on callback
    var rowsLocal = [];


    // EFFECTS

    useEffect(() => {
        // We retrieve the top results, plus one extra one that is used for delete purposes if needed
        highScoreDB.getTopResults(props.level, Period.ALL, setRowsCallback);
    }, []);


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to get the highlighted high score row
             * @returns Selected highscore row, else personal best code -2, else error code -1
             */
            getSelectedRow() {
                // Check the highlighted row is a valid highscore row and return it's data store id
                if (isValidHighScoreRowHighligted()) {
                    return rowsLocal[props.highlightRowNumber - 1];
                }
                // Else check if the selected row is our personal best row, we indicate this using code -2
                else if (isPersonalBestRowHighlighted()) {
                    return -2;
                }
                // Else return error condition, we indicate this using code -1
                else {
                    return -1;
                }
            },
            /**
             * Function to return the time of the highscore replaced if the user saves the new highscore
             * @returns Millisecond time of the recently replaced high score
             */
            getReplacedHighScoreTimeMs() {
                // Get the second last row of our high score data, this is the extra row we don't display
                // It is the row that the new high score will replace if the user chooses to save it
                let extraRow = rowsLocal[rowsLocal.length - 2];

                // If the extra row has a valid time, that is it is not an empty row, return that time
                if (!isNaN(extraRow.timeMs)) {
                    return extraRow.timeMs;
                }
                // Else return error condition, we indicate this using code -1
                else {
                    return -1;
                }
            }
        };
    }, []);


    // LOCAL FUNCTIONS

    /**
     * Function to load in the new rows from the data store
     * @param {High score rows retrieved from the data store} rows 
     */
    function setRowsCallback(rows) {
        // We save a local copy as these are needed for callback functions, state rows do not return
        rowsLocal = rows;
        // Set the state rows for render
        setRows(rows);
    }

    /**
     * Return if the highlighted row is a highscore row
     * Highscore rows are from 0 to row count -2
     * Second last row is hidden and is an extra highscore used to determine deletes for deprecated scores
     * Last row is our personal best row
     * @returns True if valid highscore row, else False
     */
    function isValidHighScoreRowHighligted() {
        return props.highlightRowNumber >= 0 && props.highlightRowNumber <= rowsLocal.length - 2;
    }

    /**
     * Return if the highlighted row is the personal best row
     * Highscore rows are from 0 to row count -2
     * Second last row is hidden and is an extra highscore used to determine deletes for deprecated scores
     * Last row is our personal best row
     * @returns True if valid personal best row, else False
     */
    function isPersonalBestRowHighlighted() {
        return props.highlightRowNumber == rowsLocal.length;
    }

    /**
     * Function to return whether this is the extra highscore row we do not display
     * It is an extra highscore used to determine deletes for deprecated scores
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if this is the row to hide, else False
     */
    function isHiddenHighScoreRow(currentRow, rows) {
        return currentRow.position === rows.length - 1;
    }

    /**
     * Function to return whether this is the row we wish to highlight
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if this is the row to highlight, else False
     */
    function isHighlightedRow(currentRow, rows) {
        // We are highlighting a high score row
        return currentRow.position === props.highlightRowNumber ||
            // We are highlighting the personal best row
            (props.highlightRowNumber === rows.length && currentRow.position === gameText.personalBestRowID)
    }


    // RENDER

    return (
        <TableContainer component={Paper}>
            <Table size={sx.tableSize}>
                <TableHead>
                    <TableRow>
                        <sx.StyledTableCell>{gameText.hsTablePosition}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableUsername}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableTime}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDate}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDevice}</sx.StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) =>
                        // Do not display the second last row, we include an extra row for delete purposes in our query results
                        isHiddenHighScoreRow(row, rows) ? null :
                            // Check if row is the one we wish to highlight and style accordingly
                            isHighlightedRow(row, rows) ?
                                (
                                    <sx.HighlightedTableRow key={row.position}>
                                        <sx.StyledTableCell component="th" scope="row">
                                            {row.position}
                                        </sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                        <sx.StyledTableCell align={sx.timeColumnDataAlign}>{row.time}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.device}</sx.StyledTableCell>
                                    </sx.HighlightedTableRow>
                                )
                                // Else apply the default style to the row
                                : (
                                    <sx.StyledTableRow key={row.position}>
                                        <sx.StyledTableCell component="th" scope="row">
                                            {row.position}
                                        </sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                        <sx.StyledTableCell align="right">{row.time}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.device}</sx.StyledTableCell>
                                    </sx.StyledTableRow>
                                )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

// PROP LIST

HighScoreTable.propTypes = {
    level: PropTypes.string,
    highlightRowNumber: PropTypes.number
}

// EXPORT

export default HighScoreTable;
