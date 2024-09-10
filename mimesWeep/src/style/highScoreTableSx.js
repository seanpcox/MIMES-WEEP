import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Set the table header colors
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: "white"
    }
}));

export const StyledTableRow = styled(TableRow)(() => ({
    // Alternate background color between rows
    '&:nth-of-type(even)': {
        backgroundColor: "#e9e9e9"
    },
    // No border for last row
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

export const HighlightedTableRow = styled(TableRow)(() => ({
    backgroundColor: orange[100]
}));

export const tableSize = "small";

export const timeColumnDataAlign = "right";