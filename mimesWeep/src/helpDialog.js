import { useState, useEffect, Fragment } from 'react';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

HelpDialog.propTypes = {
    openHelpDialogCallback: PropTypes.func
}

function HelpDialog(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.openHelpDialogCallback([open, setOpen]);
    }, [props.openHelpDialogCallback, open]);

    const handleClose = () => {
        setOpen(false);
    };

    var uncoverControl = "Left-click";
    var flagControl = "Right-click";

    if (isMobile) {
        uncoverControl = "Tap";
        flagControl = "Long-press";
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    Help
                </DialogTitle>
                <DialogContent>
                    <p><strong>Objective: </strong>Reveal all squares that do not contain a mime.</p>
                    <ul>
                        <li><strong>{uncoverControl}</strong>: Uncover a square.</li>
                        <li><strong>{flagControl} / Flag toggle button</strong>: Place or remove a flag.</li>
                    </ul>
                    <p />
                    <p><strong>Tips: </strong>The number of mimes on the board is shown by the inital count on the flag toggle button.
                        Place flags on squares suspected of hiding a mime to avoid accidental uncover.
                        A number on an uncovered square indicates the number of neighboring squares with hidden mimes.</p>
                    <p />
                    <p><strong>Credits: </strong>Sean Cox, Robert Donner, Curt Johnson, Microsoft</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default HelpDialog;