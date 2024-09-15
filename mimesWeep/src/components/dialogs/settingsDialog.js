import * as gameText from '../../resources/text/gameText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useState, useEffect, Fragment } from 'react';

/**
 * Dialog to display game help and instructions to the user
 */

// PROP LIST

SettingsDialog.propTypes = {
    openSettingsDialogCallback: PropTypes.func
}

// COMPONENT

function SettingsDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);


    // EFFECTS

    // Effect to open the settings dialog
    useEffect(() => {
        props.openSettingsDialogCallback([open, setOpen]);
    }, [props.openSettingsDialogCallback, open]);


    // LOCAL FUNCTIONS

    /**
     * Function to close the help dialog
     */
    const handleClose = () => {
        setOpen(false);
    };


    // RENDER

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {gameText.settingsDialogTitle}
                </DialogTitle>
                <DialogContent>
                    Under Construction!
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        {gameText.cancelButtonText}
                    </Button>
                    <Button
                        onClick={handleClose}
                    >
                        {gameText.updateButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

// EXPORT

export default SettingsDialog;