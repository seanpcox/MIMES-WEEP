import { useState, useEffect, Fragment } from 'react';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import * as gameText from './resources/text/gameText';

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

    var revealControl = gameText.helpDialogControlsLClick;
    var flagControl = gameText.helpDialogControlsRClick;
    var flagControlSecondary = gameText.controlsLClickLC;

    if (isMobile) {
        revealControl = gameText.helpDialogControlsTap;
        flagControl = gameText.helpDialogControlsPress;
        flagControlSecondary = gameText.controlsTapLC;
    }

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

export default HelpDialog;