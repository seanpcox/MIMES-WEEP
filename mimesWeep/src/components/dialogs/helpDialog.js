import * as gameText from '../../resources/text/gameText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { useState, useEffect, Fragment } from 'react';

// PROP LIST

HelpDialog.propTypes = {
    openHelpDialogCallback: PropTypes.func
}

// COMPONENT

function HelpDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    // LOCAL VARIABLES

    var revealControl = gameText.helpDialogControlsLClick;
    var flagControl = gameText.helpDialogControlsRClick;
    var flagControlSecondary = gameText.controlsLClickLC;

    if (isMobile) {
        revealControl = gameText.helpDialogControlsTap;
        flagControl = gameText.helpDialogControlsPress;
        flagControlSecondary = gameText.controlsTapLC;
    }

    // EFFECTS

    useEffect(() => {
        props.openHelpDialogCallback([open, setOpen]);
    }, [props.openHelpDialogCallback, open]);

    // LOCAL FUNCTIONS

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
                    {gameText.helpDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <p>
                        <strong><ins>{gameText.helpDialogObjective}</ins></strong>
                        <ul>
                            <li>
                                {gameText.helpDialogObjectiveText}
                            </li>
                        </ul>
                    </p>
                    <p />
                    <p>
                        <strong><ins>{gameText.helpDialogControls}</ins></strong>
                        <ul>
                            <li>
                                <strong>{revealControl}</strong>
                                {gameText.helpDialogControlsRevealText}
                            </li>
                            <li>
                                <strong>{flagControl}</strong>
                                {gameText.helpDialogControlsFlagText}
                            </li>
                            <li>
                                <strong>{gameText.helpDialogControlsFlagButton}</strong>
                                {gameText.helpDialogControlsFlagTextToggle + flagControlSecondary}
                            </li>
                        </ul>
                    </p>
                    <p />
                    <p>
                        <strong><ins>{gameText.helpDialogTips}</ins></strong>
                        <ul>
                            <li>
                                {gameText.helpDialogTipsBullet1}
                            </li>
                            <li>
                                {gameText.helpDialogTipsBullet2}
                            </li>
                            <li>
                                {gameText.helpDialogTipsBullet3}
                            </li>
                            {isMobile ?
                                <li>
                                    {gameText.helpDialogTipsBullet4}
                                </li>
                                : null
                            }
                        </ul>
                    </p>
                    <p />
                    <p>
                        <strong><ins>{gameText.helpDialogCredits}</ins></strong>
                        <ul>
                            <li>
                                {gameText.helpDialogCreditsBullet1}
                            </li>
                        </ul>
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        {gameText.okButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

// EXPORT

export default HelpDialog;