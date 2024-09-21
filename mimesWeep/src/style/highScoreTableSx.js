import * as gameSettings from '../logic/gameSettings.js';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Device } from '../models/index.js';

// I don't like the date column half showing on mobile, think it looks messy.
// So setting a min width on name to keep date out of screen unless scrolled to.
// Width determined by widest name I could find 'WWWWWWWWWW'.
const nameColumnWidthMobile = {
    minWidth: '80px'
}

const nameColumnWidthOther = {
    minWidth: '0px'
}

/**
 * Function to return the minimum width of the name column
 * @param {TableRow array} rows
 * @returns Min width of name column
 */
export function getNameColumn(rows) {

    // If we are on mobile and we have rows in our table then return the min mobile width
    if (gameSettings.deviceType === Device.MOBILE && rows !== undefined && rows !== null && rows.length > 0) {
        return nameColumnWidthMobile;
    }

    // Else return no min width
    return nameColumnWidthOther;
}

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

export const positionColumnDataAlign = "center";

export const trophyIcon = <EmojiEventsTwoToneIcon fontSize="small" sx={{ color: "#c9b037" }} />;

export const silverMedal = <MilitaryTechTwoToneIcon fontSize="small" sx={{ color: "#78909c" }} />;

export const bronzeMedal = <MilitaryTechTwoToneIcon fontSize="small" sx={{ color: "#ad8a56" }} />;