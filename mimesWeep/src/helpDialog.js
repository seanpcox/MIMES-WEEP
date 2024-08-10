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

    var uncoverControl = "Left Click";
    var flagControl = "Right Click";

    if (isMobile) {
        uncoverControl = "Tap";
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
                            <li>Reveal all squares that do not contain a mime.</li>
                        </ul>
                    </p>
                    <p />
                    <p><strong><ins>Controls</ins></strong>
                        <ul>
                            <li><strong>{uncoverControl}:</strong> Uncover a square</li>
                            <li><strong>{flagControl}:</strong> Place or remove a flag</li>
                            <li><strong>Flag Toggle Button:</strong> Place or remove a flag</li>
                        </ul>
                    </p>
                    <p />
                    <p><strong><ins>Tips</ins></strong>
                        <ul>
                            <li>
                                The initial count on the flag toggle button shows the number of mimes on the board.
                            </li>
                            <li>
                                Place flags on squares you suspect of hiding a mime to avoid uncovering them by mistake.
                            </li>
                            <li>
                                A number on an uncovered square indicates how many neighboring squares contain hidden mimes.
                            </li>
                            {isMobile ?
                                <li>
                                    To avoid accidentally uncovering a square, use the very edge of your screen when scrolling.
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