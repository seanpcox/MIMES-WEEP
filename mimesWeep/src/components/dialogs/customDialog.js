import * as settings from '../../logic/gameSettings.js';
import * as sx from '../../style/dialogSx.js';
import * as gameText from '../../resources/text/gameText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import { useState, useEffect, Fragment } from 'react';

/**
 * Dialog to allow the user to choose a custom board size and mime density
 */

// PROP LIST

CustomDialog.propTypes = {
    openCustomDialogCallback: PropTypes.func,
    startCustomGameCallback: PropTypes.func
}

// COMPONENT

function CustomDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [heightError, setHeightError] = useState(false);

    const [widthError, setWidthError] = useState(false);

    const [numOfMimesError, setNumOfMimesError] = useState(false);

    const [width, setWidth] = useState(null);

    const [height, setHeight] = useState(null);


    // LOCAL VARIABLES

    const maxDimensions = settings.getMaxCustomHeightWidth();

    var maxHeight = maxDimensions[0];
    var maxWidth = maxDimensions[1];


    // EFFECTS

    // Effect to open the custom dialog
    useEffect(() => {
        props.openCustomDialogCallback([open, setOpen]);
    }, [props.openCustomDialogCallback, open]);


    // INTERNAL FUNCTIONS

    /**
     * Function called on dialog close, resets all existing state
     */
    const handleClose = () => {
        setOpen(false);
        setWidthError(false);
        setHeightError(false);
        setNumOfMimesError(false);
        setHeight(null);
        setWidth(null);
    };

    /**
     * Function to validate and parse user input data
     * @param {Form submit event} event
     */
    function onSubmit(event) {
        event.preventDefault();

        // Retrieve the user game parameters for height, width, and number of mimes
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const height = formJson.height;
        const width = formJson.width;
        const numOfMimes = formJson.numOfMimes;

        // We validate the data before we proceed
        var isHeightInvalid = false;
        var isWidthInvalid = false;
        var isNumOfMimesInvalid = false;

        // Validate height is a positive whole number greater than 1 and less or equal to the max allowed height
        if (isNaN(height) || !Number.isInteger(Number(height)) || height <= 1 || height > maxHeight) {
            // Set error status on the height text field
            setHeightError(true);
            setHeight(null);
            isHeightInvalid = true;
        } else {
            // Clear error status on the height text field
            setHeightError(false);
            setHeight(height);
            isHeightInvalid = false;
        }

        // Validate width is a positive whole number greater than 1 and less or equal to the max allowed width
        if (isNaN(width) || !Number.isInteger(Number(width)) || width <= 1 || width > maxWidth) {
            // Set the error status on the width text field
            setWidthError(true);
            setWidth(null);
            isWidthInvalid = true;
        } else {
            // Clear the error status on the width text field
            setWidthError(false);
            setWidth(width);
            isWidthInvalid = false;
        }

        // Validate number of mimes is a positive none zero whole number and, if height and
        // width valid, not greater or equal to the number of squares on the proposed board
        if (isNaN(numOfMimes) || !Number.isInteger(Number(numOfMimes)) || numOfMimes <= 0
            || (!isHeightInvalid && !isWidthInvalid && numOfMimes >= (width * height))) {
            // Set the error status on the number of mimes text field
            setNumOfMimesError(true);
            isNumOfMimesInvalid = true;
        } else {
            // Clear the error status on the number of mimes text field
            setNumOfMimesError(false);
            isNumOfMimesInvalid = false;
        }

        // If we encountered a height or width or number of mimes error return to the dialog for new entries
        if (isHeightInvalid || isWidthInvalid || isNumOfMimesInvalid) {
            return;
        }

        // If entries are valid close the dialog
        handleClose();

        // Start the game with the user supplied parameters
        props.startCustomGameCallback(Number(height), Number(width), Number(numOfMimes));
    }


    // RENDER

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit
                }}
            >
                <DialogTitle>
                    {gameText.customDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {gameText.customDialogMessage}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        error={heightError}
                        required
                        margin={sx.tfMarginType}
                        id="height"
                        name="height"
                        label={gameText.customDialogHeight + " (2-" + maxHeight + ")"}
                        variant={sx.tfVariantType}
                    />
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        error={widthError}
                        required
                        margin={sx.tfMarginType}
                        id="width"
                        name="width"
                        label={gameText.customDialogWidth + " (2-" + maxWidth + ")"}
                        variant={sx.tfVariantType}
                    />
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        error={numOfMimesError}
                        required
                        margin={sx.tfMarginType}
                        id="numOfMimes"
                        name="numOfMimes"
                        label={gameText.customDialogMimes + " (1-" +
                            // We don't know the max number of mimes until user has submitted with a valid height and width so show "?"
                            // We will show max number of mimes though if after width and height validation the number is incorrect
                            ((width == null || height == null) ? "?" : ((width * height) - 1))
                            + ")"}
                        variant={sx.tfVariantType}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        {gameText.cancelButtonText}
                    </Button>
                    <Button
                        type="submit"
                    >
                        {gameText.createButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

// EXPORT

export default CustomDialog;