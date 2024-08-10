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

    var revealControl = "Left Click";
    var flagControl = "Right Click";

    if (isMobile) {
        revealControl = "Tap";
        flagControl = "Press";
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
                    <p><strong><ins>Objective</ins></strong>
                        <ul>
                            <li>Reveal all squares that do not hide a mime.</li>
                        </ul>
                    </p>
                    <p />
                    <p><strong><ins>Controls</ins></strong>
                        <ul>
                            <li><strong>{revealControl}:</strong> Reveal a square</li>
                            <li><strong>{flagControl}:</strong> Place or remove a flag</li>
                            <li><strong>Flag Toggle Button:</strong> Place or remove a flag</li>
                        </ul>
                    </p>
                    <p />
                    <p><strong><ins>Tips</ins></strong>
                        <ul>
                            <li>
                                The initial count on the flag toggle button shows the number of mimes hidden on the board.
                            </li>
                            <li>
                                Place flags on squares you suspect of hiding a mime to avoid revealing them by mistake.
                            </li>
                            <li>
                                A number on a revealed square indicates how many neighboring squares have hidden mimes.
                            </li>
                            {isMobile ?
                                <li>
                                    Use the edge of your screen when scrolling to avoid accidentally revealing a square.
                                </li>
                                : null
                            }
                        </ul>
                    </p>
                    <p />
                    <p><strong><ins>Credits</ins></strong>
                        <ul>
                            <li>
                                Sean Cox
                            </li>
                        </ul>
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default HelpDialog;