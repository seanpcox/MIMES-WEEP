import * as highScoreDB from '../logic/highScoreDB.js';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { Period } from "../models/index.js";
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#282c34",
        color: theme.palette.common.white,
        fontSize: 12
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: "#e9e9e9",
        color: theme.palette.common.white
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    },
}));

// PROP LIST

HighScoreTable.propTypes = {
    level: PropTypes.string
}

/**
 * Component table showing high scores for different difficulty levels
 */


// COMPONENT

export default function HighScoreTable(props) {

    const [rows, setRows] = useState([]);

    // EFFECTS

    useEffect(() => {
        highScoreDB.getTopResults(props.level, Period.ALL, setRows);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>User</StyledTableCell>
                        <StyledTableCell>Time</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.position}>
                            <StyledTableCell component="th" scope="row">
                                {row.position}
                            </StyledTableCell>
                            <StyledTableCell>{row.user}</StyledTableCell>
                            <StyledTableCell>{row.time}</StyledTableCell>
                            <StyledTableCell>{row.date}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}