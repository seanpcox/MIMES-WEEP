import * as gameText from '../resources/text/gameText.js';
import * as highScoreDB from '../logic/highScoreDB.js';
import * as settings from '../logic/gameSettings.js';
import * as sx from '../style/highScoreTableSx.js'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

/**
 * Component table showing high score and personal best times for different difficulty levels
 * It is opened with a limited number of high score entries if we are saving a new high score
 * It is opened with all entries if we are just viewing the high scores
 * Personal best row is always displayed, as is any new high score row, regardless of high score position
 * Note: The first row displayed is the personal best data row
 */


// PROP LIST

HighScoreTable.propTypes = {
    level: PropTypes.string,
    period: PropTypes.string,
    highlightRowID: PropTypes.string,
    highlightPersonalBest: PropTypes.bool
}


// COMPONENT

function HighScoreTable(props) {

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
        highScoreDB.getTopResults(props.level, props.period, setRows);
    }, [props.level, props.period]);


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
     * Function to determine if we should open the dialog in new score mode
     * @returns True if highscore or a personal best else False
    */
    function isNewScoreDialog() {
        return isPersonalBestRowHighlighted() || isHighScoreRowHighligted()
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
     * Function to return whether we should highlight the current row
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if we wish to highlight, else False
     */
    function isRowHighlighted(currentRow) {
        return isHighlightPersonalBestRow(currentRow) || isHighlightedHighScoreRow(currentRow);
    }

    /**
     * Function to decide if the row should be displayed or not
     * For a high score or personal best we only show the top n rows,
     * as well as the new high score row (which may be in the top n) and the personal best.
     * @param {Table Row} row
     * @returns True if for display, else False
     */
    function isDisplayRow(currentRow) {

        // If we are not recording a new score, just viewing scores, we show all rows
        if (!isNewScoreDialog()) {
            return true;
        }

        // We always display the personal best row (first row always)
        // and the specified number of always display rows in our settings
        if (currentRow.position === gameText.personalBestRowID ||
            Number(currentRow.position) <= (settings.numHSRowsToDisplayOnNewScore)) {
            return true;
        }

        // We always display a new high score row
        if (isHighlightedHighScoreRow(currentRow)) {
            return true;
        }

        // If we get here we do not display the row
        return false;
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
                        <sx.StyledTableCell>{gameText.hsTableScore}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDate}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableTime}</sx.StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) =>
                        !isDisplayRow(row) ? null :
                            // Check if row should be highlighted and style accordingly
                            isRowHighlighted(row) ?
                                (
                                    <sx.HighlightedTableRow key={row.position}>
                                        <sx.StyledTableCell align="center" component="th" scope="row">
                                            {getPositionContent(row.position)}
                                        </sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                        <sx.StyledTableCell align={sx.timeColumnDataAlign}>{row.score}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.time}</sx.StyledTableCell>
                                    </sx.HighlightedTableRow>
                                )
                                // Else apply the default style to the row
                                : (
                                    <sx.StyledTableRow key={row.position}>
                                        <sx.StyledTableCell align="center" component="th" scope="row">
                                            {getPositionContent(row.position)}
                                        </sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                        <sx.StyledTableCell align="right">{row.score}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                        <sx.StyledTableCell>{row.time}</sx.StyledTableCell>
                                    </sx.StyledTableRow>
                                )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


// EXPORT

export default HighScoreTable;
