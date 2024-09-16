import * as commonSx from '../../style/commonSx.js';
import * as gameText from '../../resources/text/gameText';
import * as settings from '../../logic/gameSettings.js';
import * as dialogSx from '../../style/dialogSx.js';
import * as sx from '../../style/helpDialogSx.js';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
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


    // LOCAL VARIABLES

    var revealControl = gameText.leftClick;
    var flagControl = gameText.rightClick;
    var revealIcon = sx.leftClickIcon;
    var flagIcon = sx.rightClickIcon;

    if (settings.deviceType !== Device.DESKTOP) {
        revealControl = gameText.tap;
        flagControl = gameText.longPress;
        revealIcon = sx.tapIcon;
        flagIcon = sx.longPressIcon;
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
                    <div style={dialogSx.titleDivStyle}>
                        {commonSx.helpIcon}
                        <span>&nbsp;{gameText.helpDialogTitle}</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <p />
                    <strong>{gameText.helpDialogObjective}</strong>
                    <Box sx={sx.spacingHeight}></Box>
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.winIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.helpDialogObjectiveText}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.hintIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy1}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.numberIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy2}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.flagIconHtml}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy3}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.flagHintIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy4}
                            />
                        </ListItem>
                    </List>
                    <p />
                    <strong>{gameText.helpDialogControls}</strong>
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {revealIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={revealControl}
                                secondary={
                                    <div>
                                        <div>{gameText.helpDialogControlsRevealText}</div>
                                        <div>{gameText.chordingAction}</div>
                                    </div>
                                }
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {flagIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={flagControl}
                                secondary={gameText.helpDialogControlsFlagText}
                            />
                        </ListItem>
                    </List>
                    <p />
                    <strong>{gameText.helpDialogToolbar}</strong>
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.newGameIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipNew}
                                secondary={gameText.hNewGameInfo}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.easyLevelIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipDifficulty}
                                secondary={gameText.hDifficultyLevelInfo}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.highScoreIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipTimeElapsedHS}
                                secondary={
                                    <div>
                                        <div>{gameText.hTimeHSInfo1}</div>
                                        <div>{gameText.hTimeHSInfo2}</div>
                                    </div>
                                }
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.flagIconHtml}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipHint}
                                secondary={
                                    <div>
                                        <div>{gameText.hFlagHintInfo1}</div>
                                        <div>{gameText.hFlagHintInfo2}</div>
                                    </div>
                                }
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.settingsIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipSettings}
                                secondary={gameText.hSettingsInfo}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {commonSx.helpIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipHelp}
                                secondary={gameText.hHelpInfo}
                            />
                        </ListItem>
                    </List>
                    <p />
                    <strong>{gameText.helpDialogCredits}</strong>
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.creatorIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.helpDialogCreditsBullet1}
                            />
                        </ListItem>
                    </List>
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