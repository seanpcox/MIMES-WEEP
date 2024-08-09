import { useState, useEffect, Fragment } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

CustomDialog.propTypes = {
    openCustomDialogCallback: PropTypes.func,
    startCustomGameCallback: PropTypes.func
}

function CustomDialog(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.openCustomDialogCallback([open, setOpen]);
    }, [props.openCustomDialogCallback, open]);

    const handleClose = () => {
        setOpen(false);
        setWidthError(false);
        setHeightError(false);
        setNumOfMimesError(false);
    };

    const [widthError, setWidthError] = useState(false);

    const [heightError, setHeightError] = useState(false);

    const [numOfMimesError, setNumOfMimesError] = useState(false);

    // Max that's fits on my Macbook Pro 2021
    // Scrolling left horizontally can cause the page to go backwards
    var maxHeight = 20;
    var maxWidth = 45;

    function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        var isInvalid = false;

        const width = formJson.width;
        const height = formJson.height;
        const numOfMimes = formJson.numOfMimes;

        console.log(width, height, numOfMimes);

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
                <DialogTitle>Create Custom Board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the height, width, and number of mimes.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        error={heightError}
                        required
                        margin="dense"
                        id="height"
                        name="height"
                        label={"Height (1-" + maxHeight + ")"}
                        variant="standard"
                    />
                    <Box width={10} />
                    <TextField
                        error={widthError}
                        required
                        margin="dense"
                        id="width"
                        name="width"
                        label={"Width (1-" + maxWidth + ")"}
                        variant="standard"
                    />
                    <Box width={10} />
                    <TextField
                        error={numOfMimesError}
                        required
                        margin="dense"
                        id="numOfMimes"
                        name="numOfMimes"
                        label={"Mimes (1-" + ((maxWidth * maxHeight) - 1) + ")"}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default CustomDialog;