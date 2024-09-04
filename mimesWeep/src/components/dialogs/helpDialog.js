import * as gameText from '../../resources/text/gameText';
import * as settings from '../../logic/gameSettings.js';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Device } from "../../models/index.js";
import { useState, useEffect, Fragment } from 'react';

/**
 * Dialog to display game help and instructions to the user
 */

// PROP LIST

HelpDialog.propTypes = {
    openHelpDialogCallback: PropTypes.func
}

// COMPONENT

function HelpDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const isNotDesktop = useState(settings.getDeviceType() != Device.DESKTOP);


    // LOCAL VARIABLES

    var revealControl = gameText.helpDialogControlsLClick;
    var flagControl = gameText.helpDialogControlsRClick;
    var flagControlSecondary = gameText.controlsLClickLC;

    if (isNotDesktop[0]) {
        revealControl = gameText.helpDialogControlsTap;
        flagControl = gameText.helpDialogControlsPress;
        flagControlSecondary = gameText.controlsTapLC;
    }


    // EFFECTS

    // Effect to open the help dialog
    useEffect(() => {
        props.openHelpDialogCallback([open, setOpen]);
    }, [props.openHelpDialogCallback, open]);


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
                    {gameText.helpDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <strong><ins>{gameText.helpDialogObjective}</ins></strong>
                    <ul>
                        <li>
                            {gameText.helpDialogObjectiveText}
                        </li>
                    </ul>
                    <p />
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
                    <p />
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
                        {isNotDesktop[0] ?
                            <li>
                                {gameText.helpDialogTipsBullet4}
                            </li>
                            : null
                        }
                    </ul>
                    <p />
                    <strong><ins>{gameText.helpDialogCredits}</ins></strong>
                    <ul>
                        <li>
                            {gameText.helpDialogCreditsBullet1}
                        </li>
                    </ul>
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