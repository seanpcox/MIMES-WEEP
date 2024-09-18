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
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * Component table showing high score and personal best times for different difficulty levels
 * Note: The last row displayed is the personal best data row
 */

// COMPONENT

const HighScoreTable = forwardRef(function HighScoreTable(props, inputRef) {

    // STATES

    const [rows, setRows] = useState([]);


    // REFS

    // Variable to store the highlighted highscore row, if any
    const highlightedHighScoreRowRef = useRef(null);


    // EFFECTS

    useEffect(() => {
        // Clear any previous ref
        highlightedHighScoreRowRef.current = null;
        // We retrieve the high score and personal best results
        highScoreDB.getTopResults(props.level, Period.ALL, setRows);
    }, [props.level]);


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to get the highlighted high score row
             * @returns Highlighted high score row, else highlighted personal best code -2, else no highlighted row code -1
             */
            getHighlightedHighScoreRow() {
                // If the highlighted row is a valid high score row return it
                if (isHighScoreRowHighligted()) {
                    return highlightedHighScoreRowRef.current;
                }
                // Else check if the selected row is our personal best row, we indicate this using code -2
                else if (isPersonalBestRowHighlighted()) {
                    return -2;
                }
                // Else return no highlighted row condition, we indicate this using code -1
                else {
                    return -1;
                }
            }
        };
    }, []);


    // LOCAL FUNCTIONS

    /**
     * Function to determine if a high score row is highlighted. 
     * Highscore rows are from 0 to row count -1. The last row is our personal best row.
     * @returns True if highscore row is highlighted, else False
     */
    function isHighScoreRowHighligted() {
        return props.highlightRowID && highlightedHighScoreRowRef.current;
    }

    /**
     * Function to determine if the personal best row is highlighted. The last row is our personal best row.
     * @returns True if personal best row is highlighted, else False
     */
    function isPersonalBestRowHighlighted() {
        return props.highlightPersonalBest;
    }

    /**
     * Function to return whether we should highlight the current highscore row
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if we wish to highlight, else False
     */
    function isHighlightedHighScoreRow(currentRow) {
        // Are we highlighting this high score row
        if (currentRow.id === props.highlightRowID) {
            // Set the local ref, for return later if user wants to update the username on score
            highlightedHighScoreRowRef.current = currentRow;

            return true;
        }

        return false;
    }

    /**
     * Function to return whether this is the personal best row and whether it should be highlighted
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if we want to highlight the personal best row, else False
     */
    function isHighlightPersonalBestRow(currentRow) {
        // Are we highlighting the personal best row
        return props.highlightPersonalBest && currentRow.position === gameText.personalBestRowID;
    }

    /**
     * Function to return the content for the position column
     * @param {number} position 
     * @returns Icon or position number
     */
    function getPositionContent(position) {
        if (position === 1) {
            return sx.trophyIcon;
        } else if (position === 2) {
            return sx.silverMedal;
        } else if (position === 3) {
            return sx.bronzeMedal;
        }

        return position;
    }

    // RENDER

    return (
        <TableContainer component={Paper}>
            <Table size={sx.tableSize}>
                <TableHead>
                    <TableRow>
                        <sx.StyledTableCell align="center">{gameText.hsTablePosition}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableUsername}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableTime}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDate}</sx.StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) =>
                        // Check if row should be highlighted and style accordingly
                        isHighlightedHighScoreRow(row) || isHighlightPersonalBestRow(row) ?
                            (
                                <sx.HighlightedTableRow key={row.position}>
                                    <sx.StyledTableCell align="center" component="th" scope="row">
                                        {getPositionContent(row.position)}
                                    </sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                    <sx.StyledTableCell align={sx.timeColumnDataAlign}>{row.time}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                </sx.HighlightedTableRow>
                            )
                            // Else apply the default style to the row
                            : (
                                <sx.StyledTableRow key={row.position}>
                                    <sx.StyledTableCell align="center" component="th" scope="row">
                                        {getPositionContent(row.position)}
                                    </sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                    <sx.StyledTableCell align="right">{row.time}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
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
    highlightRowID: PropTypes.string,
    highlightPersonalBest: PropTypes.bool
}

// EXPORT

export default HighScoreTable;
