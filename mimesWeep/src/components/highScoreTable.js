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
import { useEffect, useState } from 'react';

// TABLE STYLES

const StyledTableCell = styled(TableCell)(({theme}) => ({
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

// PROP LIST

HighScoreTable.propTypes = {
    level: PropTypes.string,
    highlightRowNumber: PropTypes.number
}

/**
 * Component table showing high scores for different difficulty levels
 */


// COMPONENT

export default function HighScoreTable(props) {

    // STATES

    const [rows, setRows] = useState([]);


    // EFFECTS

    useEffect(() => {
        highScoreDB.getTopResults(props.level, Period.ALL, setRows);
    }, []);

    // RENDER

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>User</StyledTableCell>
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
                                <StyledTableCell>{row.time}</StyledTableCell>
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
                                    <StyledTableCell>{row.time}</StyledTableCell>
                                    <StyledTableCell>{row.date}</StyledTableCell>
                                    <StyledTableCell>{row.device}</StyledTableCell>
                                </HighlightedTableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}