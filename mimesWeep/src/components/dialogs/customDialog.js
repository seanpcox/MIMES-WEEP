import * as commonSx from '../../style/commonSx.js';
import * as settings from '../../logic/gameSettings.js';
import * as sx from '../../style/dialogSx.js';
import * as gameText from '../../resources/text/gameText';
import * as userSettings from '../../logic/userSettings.js';
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
        if (isHeightInvalidCheck(height)) {
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
        if (isWidthInvalidCheck(width)) {
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
        if (isNumOfMimesInvalidCheck(numOfMimes)
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

        // If the parameters are all valid then save them to auto appear on next use
        userSettings.setLSCustomGameOptions(height, width, numOfMimes);

        // If entries are valid close the dialog
        handleClose();

        // Start the game with the user supplied parameters
        props.startCustomGameCallback(Number(height), Number(width), Number(numOfMimes));
    }

    /**
     * Function to determine if the custom height is invalid
     * @param {number} height
     * @returns True if custom height invalid, else False
     */
    function isHeightInvalidCheck(height) {
        return isNaN(height) || !Number.isInteger(Number(height)) || height <= 1 || height > maxHeight;
    }

    /**
     * Function to determine if the custom width is invalid
     * @param {number} width
     * @returns True if custom width invalid, else False
     */
    function isWidthInvalidCheck(width) {
        return isNaN(width) || !Number.isInteger(Number(width)) || width <= 1 || width > maxWidth;
    }

    /**
     * Function to determine if the custom number of mimes is invalid
     * @param {number} numOfMimes
     * @returns True if custom number of mimes invalid, else False
     */
    function isNumOfMimesInvalidCheck(numOfMimes) {
        return isNaN(numOfMimes) || !Number.isInteger(Number(numOfMimes)) || numOfMimes <= 0;
    }

    /**
    * Function to determine whether to autofocus the first input field on open
    * @returns True if we wish to autofocus the first input field, else False
    */
    function isFirstLabelAutoFocus() {

        // If we have a no preloaded valid height then focus on it
        if (isHeightInvalidCheck()) {
            return true;
        }

        // Else we focus on the Create button
        return false;
    }

    // RENDER

    // Retrieve the last used custom settings, if any
    var defaultHeight = userSettings.getLSCustomHeight();
    var defaultWidth = userSettings.getLSCustomWidth();
    var defaultNumOfMimes = userSettings.getLSCustomNumOfMimes();

    // If settings are invalid then default to empty string
    if (defaultHeight === undefined || defaultHeight == null) {
        defaultHeight = "";
    }
    if (defaultWidth === undefined || defaultWidth == null) {
        defaultWidth = "";
    }
    if (defaultNumOfMimes === undefined || defaultNumOfMimes == null) {
        defaultNumOfMimes = "";
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                disableRestoreFocus
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit
                }}
            >
                <DialogTitle>
                    <Box sx={sx.titleDivStyle}>
                        {commonSx.customLevelIcon}
                        <span>&nbsp;{gameText.customDialogTitle}</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {gameText.customDialogMessage}
                    </DialogContentText>
                    <TextField
                        autoFocus={isFirstLabelAutoFocus()}
                        defaultValue={defaultHeight}
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
                        defaultValue={defaultWidth}
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
                        defaultValue={defaultNumOfMimes}
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
                        autoFocus={!isFirstLabelAutoFocus()}
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