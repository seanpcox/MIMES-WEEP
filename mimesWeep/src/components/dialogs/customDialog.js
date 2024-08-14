import * as settings from '../../logic/gameSettings.js';
import * as sx from '../../style/customDialogSx.js';
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

// PROP LIST

CustomDialog.propTypes = {
    openCustomDialogCallback: PropTypes.func,
    startCustomGameCallback: PropTypes.func
}

// COMPONENT

function CustomDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [widthError, setWidthError] = useState(false);

    const [heightError, setHeightError] = useState(false);

    const [numOfMimesError, setNumOfMimesError] = useState(false);

    // LOCAL VARIABLES

    const maxDimensions = settings.getMaxCustomHeightWidth();

    var maxHeight = maxDimensions[0];
    var maxWidth = maxDimensions[1];

    // EFFECTS

    useEffect(() => {
        props.openCustomDialogCallback([open, setOpen]);
    }, [props.openCustomDialogCallback, open]);

    // INTERNAL FUNCTIONS

    const handleClose = () => {
        setOpen(false);
        setWidthError(false);
        setHeightError(false);
        setNumOfMimesError(false);
    };

    function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        var isInvalid = false;

        const width = formJson.width;
        const height = formJson.height;
        const numOfMimes = formJson.numOfMimes;

        if (isNaN(width) || width <= 0 || width > maxWidth) {
            setWidthError(true);
            isInvalid = true;
        } else {
            setWidthError(false);
        }

        if (isNaN(height) || height <= 0 || height > maxHeight) {
            setHeightError(true);
            isInvalid = true;
        } else {
            setHeightError(false);
        }

        if (isNaN(numOfMimes) || numOfMimes <= 0 || numOfMimes > ((maxWidth * maxHeight) - 1)) {
            setNumOfMimesError(true);
            isInvalid = true;
        } else {
            setNumOfMimesError(false);
        }

        if (isInvalid) {
            return;
        }

        handleClose();

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
                        label={gameText.customDialogHeight + " (1-" + maxHeight + ")"}
                        variant={sx.tfVariantType}
                    />
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        error={widthError}
                        required
                        margin={sx.tfMarginType}
                        id="width"
                        name="width"
                        label={gameText.customDialogWidth + " (1-" + maxWidth + ")"}
                        variant={sx.tfVariantType}
                    />
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        error={numOfMimesError}
                        required
                        margin={sx.tfMarginType}
                        id="numOfMimes"
                        name="numOfMimes"
                        label={gameText.customDialogMimes + " (1-" + ((maxWidth * maxHeight) - 1) + ")"}
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