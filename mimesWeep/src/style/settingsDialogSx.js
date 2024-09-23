import * as commonSx from './commonSx.js';
import DeleteIcon from '@mui/icons-material/Delete';

export const dialogWidth = {
    minWidth: '250px',
    maxWidth: '350px',
    width: '350px'
}

export const deleteBtn = {
    ...commonSx.font,
    ...commonSx.btnColor,
    color: "error"
};

export const deleteBtnPosition = {
    width: "100%",
    textAlign: "center"
}

export const deleteInfo = {
    color: '#00000099',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    fontSize: 12
}

export const deleteBtnVariant = "outlined";

export const deleteBtnSpacingHeight = { height: 20 };

export const deleteIcon = <DeleteIcon />

export const deleteInitialColor = "warning";

export const deleteConfirmColor = "error";