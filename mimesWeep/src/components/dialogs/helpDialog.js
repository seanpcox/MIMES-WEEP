import * as commonSx from '../../style/commonSx.js';
import * as dialogSx from '../../style/dialogSx.js';
import * as gameText from '../../resources/text/gameText';
import * as gameSettings from '../../logic/gameSettings.js';
import * as sx from '../../style/helpDialogSx.js';
import * as userSettings from '../../logic/userSettings.js';
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

    const [dialogTitle, setDialogTitle] = useState(gameText.helpDialogTitle);

    const [dialogIcon, setDialogIcon] = useState(commonSx.helpIcon);


    // LOCAL VARIABLES

    var revealControl = gameText.leftClick;
    var revealControlLC = gameText.controlsLClickLC;
    var flagControl = gameText.rightClick;
    var revealIcon = sx.leftClickIcon;
    var flagIcon = sx.rightClickIcon;

    if (gameSettings.deviceType !== Device.DESKTOP) {
        revealControl = gameText.tap;
        revealControlLC = gameText.controlsTapLC;
        flagControl = gameText.longPress;
        revealIcon = sx.tapIcon;
        flagIcon = sx.longPressIcon;
    }


    // EFFECTS

    // Effect to open the help dialog
    useEffect(() => {
        // Set the dialog title and icon states
        setTitleAndIcon();

        props.openHelpDialogCallback([open, setOpen]);
    }, [props.openHelpDialogCallback, open]);


    // LOCAL FUNCTIONS

    /**
     * Function to set the dialog title and icon
     */
    function setTitleAndIcon() {
        // Retrieve the local property telling us if the user has ever visited this app on this browser
        var isFirstVisit = userSettings.isFirstVisit();

        // If they have never visited we display the welcome dialog title and icon
        if (isFirstVisit) {
            // Set the welcome dialog title and icon
            setDialogIcon(sx.welcomeIcon);
            setDialogTitle(gameText.helpWelcomeDialogTitle);
        }
        // Else set the default help dialog title and icon
        else {
            // Set the help dialog title and icon
            setDialogIcon(commonSx.helpIcon);
            setDialogTitle(gameText.helpDialogTitle);
        }
    }

    /**
     * Function to close the help dialog
     */
    const handleClose = () => {

        // Record that the user has visited the site so we don't show the welcome parameters on next open
        userSettings.setIsFirstVisit(false);

        // Close the dialog
        setOpen(false);
    };


    // RENDER

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                disableRestoreFocus
            >
                <DialogTitle>
                    <Box sx={dialogSx.titleDivStyle}>
                        {dialogIcon}
                        <span>&nbsp;{dialogTitle}</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={sx.spacingHeight}></Box>
                    <strong>{gameText.helpDialogObjective}</strong>
                    <Box sx={sx.spacingTitleHeight}></Box>
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
                    </List>
                    <Box sx={sx.spacingHeight}></Box>
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
                                    <Box>
                                        <Box>{gameText.helpDialogControlsRevealText}</Box>
                                        <Box>{gameText.helpDialogControlsChordingAction}</Box>
                                    </Box>
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
                    <Box sx={sx.spacingHeight}></Box>
                    <strong>{gameText.helpDialogGameplay}</strong>
                    <Box sx={sx.spacingTitleHeight}></Box>
                    <List>
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
                        <Box sx={sx.spacingTitleHeight}></Box>
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
                        <Box sx={sx.spacingTitleHeight}></Box>
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
                        <Box sx={sx.spacingTitleHeight}></Box>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.chordIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy4_1 + revealControlLC + gameText.strategy4_2}
                            />
                        </ListItem>
                        <Box sx={sx.spacingTitleHeight}></Box>
                        <ListItem disablePadding>
                            <ListItemIcon sx={sx.listItemIcon}>
                                {sx.flagHintIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.strategy5}
                            />
                        </ListItem>
                    </List>
                    <Box sx={sx.spacingHeight}></Box>
                    <strong>{gameText.helpDialogToolbar}</strong>
                    <Box sx={sx.spacingTitleHeight}></Box>
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
                                {commonSx.timerIcon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={
                                commonSx.font
                            }
                                primary={gameText.tooltipTimeElapsedHS}
                                secondary={
                                    <Box>
                                        <Box>{gameText.hTimeHSInfo1}</Box>
                                        <Box>{gameText.hTimeHSInfo2}</Box>
                                    </Box>
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
                                    <Box>
                                        <Box>{gameText.hFlagHintInfo1}</Box>
                                        <Box>{gameText.hFlagHintInfo2}</Box>
                                    </Box>
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
                    <Box sx={sx.spacingHeight}></Box>
                    <strong>{gameText.helpDialogCredits}</strong>
                    <Box sx={sx.spacingTitleHeight}></Box>
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
                        autoFocus
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