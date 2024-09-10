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
             * Function to get the highlighted row id
             */
            getSelectedRowID() {
                // Check the highlighted row is valid and return it's data store id
                if (props.highlightRowNumber >= 0 && props.highlightRowNumber <= rowsLocal.length) {
                    return rowsLocal[props.highlightRowNumber - 1].id;
                }
                // Else return error condition
                else {
                    return -1;
                }
            },
            getReplacedHighScoreTimeMs() {
                // Get the second last row of our high score data, this is the extra row we don't display
                // And the row that the new high score will replace if the user chooses to save it
                let extraRow = rowsLocal[rowsLocal.length - 2];

                // If the extra row has a valid time, that is not an empty row, return it
                if (!isNaN(extraRow.timeMs)) {
                    return extraRow.timeMs;
                }
                // Else return error condition
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
                        row.position === rows.length - 1 ? null :
                            // Check if row is the highlighted one we want to save and style accordingly
                            row.position !== props.highlightRowNumber ?
                                (
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
                                // Else apply the default style to the row
                                : (
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
