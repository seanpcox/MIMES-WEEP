import * as highScoreDB from '../logic/highScoreDB.js';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { orange } from '@mui/material/colors';
import { Period } from "../models/index.js";
import { styled } from '@mui/material/styles';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/**
 * Component table showing high scores for different difficulty levels
 */

// STYLES

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Set the table header colors
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: "white"
    }
}));

const StyledTableRow = styled(TableRow)(() => ({
    // Alternate background color between rows
    '&:nth-of-type(even)': {
        backgroundColor: "#e9e9e9"
    }
}));

const HighlightedTableRow = styled(TableRow)(() => ({
    backgroundColor: orange[100]
}));

// COMPONENT

const HighScoreTable = forwardRef(function HighScoreTable(props, inputRef) {

    // STATES

    const [rows, setRows] = useState([]);


    // LOCAL VARIABLES

    // Store the rows locally as well, as state rows will not return on callback
    var rowsLocal = [];


    // EFFECTS

    useEffect(() => {
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
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>Username</StyledTableCell>
                        <StyledTableCell>Time</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Device</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) =>
                        row.position !== props.highlightRowNumber ? (
                            <StyledTableRow key={row.position}>
                                <StyledTableCell component="th" scope="row">
                                    {row.position}
                                </StyledTableCell>
                                <StyledTableCell>{row.user}</StyledTableCell>
                                <StyledTableCell align="right">{row.time}</StyledTableCell>
                                <StyledTableCell>{row.date}</StyledTableCell>
                                <StyledTableCell>{row.device}</StyledTableCell>
                            </StyledTableRow>
                        )
                            : (
                                <HighlightedTableRow key={row.position}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.position}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.user}</StyledTableCell>
                                    <StyledTableCell align="right">{row.time}</StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    <StyledTableCell>{row.device}</StyledTableCell>
                                </HighlightedTableRow>
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
