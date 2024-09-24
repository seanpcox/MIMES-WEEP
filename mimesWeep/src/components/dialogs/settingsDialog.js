import * as commonSx from '../../style/commonSx.js';
import * as gameText from '../../resources/text/gameText';
import * as gameSettings from '../../logic/gameSettings.js';
import * as dialogSx from '../../style/dialogSx.js';
import * as sx from '../../style/settingsDialogSx.js';
import * as userSettings from '../../logic/userSettings.js';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { Device } from "../../models/index.js";
import { useState, useEffect, Fragment } from 'react';

/**
 * Dialog to change game settings for this device and browser combination
 * Settings are saved in local storage
 */

// PROP LIST

SettingsDialog.propTypes = {
    openSettingsDialogCallback: PropTypes.func
}

// COMPONENT

function SettingsDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [placeFlagsOption, setPlaceFlagsOption] = useState(userSettings.defaultPlaceFlagsOption);

    const [chordingControlOption, setChordingControlOption] = useState(userSettings.defaultChordingControlOption);

    const [startHintOption, setStartHintOption] = useState(userSettings.defaultStartHintOption);

    const [gameTimeFormatOption, setGameTimeFormatOption] = useState(userSettings.defaultGameTimeFormatOption);

    const [scoreTimeFormatOption, setScoreTimeFormatOption] = useState(userSettings.defaultScoreTimeFormatOption);

    const [vibrateOption, setVibrateOption] = useState(userSettings.defaultVibrateOption);

    const [isDeleteConfirm, setDeleteConfirm] = useState(false);


    // EFFECTS

    // Effect to open the settings dialog
    useEffect(() => {
        props.openSettingsDialogCallback([open, setOpen]);
    }, [props.openSettingsDialogCallback, open]);

    // Effect to call on component load to set the user saved settings, if any
    useEffect(() => {
        loadUserSettings();
    }, []);


    // LOCAL FUNCTIONS

    /**
     * Function to set the user saved settings, if any
     */
    function loadUserSettings() {

        if (localStorage.getItem(userSettings.placeFlagsOptionLS)) {
            setPlaceFlagsOption(localStorage.getItem(userSettings.placeFlagsOptionLS));
        }

        if (localStorage.getItem(userSettings.chordingControlOptionLS)) {
            setChordingControlOption(localStorage.getItem(userSettings.chordingControlOptionLS));
        }

        if (localStorage.getItem(userSettings.startHintOptionLS)) {
            setStartHintOption(localStorage.getItem(userSettings.startHintOptionLS));
        }

        if (localStorage.getItem(userSettings.gameTimeFormatOptionLS)) {
            setGameTimeFormatOption(localStorage.getItem(userSettings.gameTimeFormatOptionLS));
        }

        if (localStorage.getItem(userSettings.scoreTimeFormatOptionLS)) {
            setScoreTimeFormatOption(localStorage.getItem(userSettings.scoreTimeFormatOptionLS));
        }

        if (localStorage.getItem(userSettings.vibratetOptionLS)) {
            setVibrateOption(localStorage.getItem(userSettings.vibratetOptionLS));
        }
    }

    /**
     * Function to validate and parse user input data
     * @param {Form submit event} event
     */
    function onSubmit(event) {
        event.preventDefault();

        // Retrieve the user game parameters for height, width, and number of mimes
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        // Save all user options to local storage

        localStorage.setItem(userSettings.placeFlagsOptionLS, formJson.flags);

        localStorage.setItem(userSettings.chordingControlOptionLS, formJson.chording);

        localStorage.setItem(userSettings.startHintOptionLS, formJson.startHint);

        localStorage.setItem(userSettings.gameTimeFormatOptionLS, formJson.gameTimeFormat);

        localStorage.setItem(userSettings.scoreTimeFormatOptionLS, formJson.scoreTimeFormat);

        // Close the dialog
        handleClose();
    }

    /**
     * Function to reset all settings to their defaults
     */
    function resetSettings() {
        setPlaceFlagsOption(userSettings.defaultPlaceFlagsOption);
        setChordingControlOption(userSettings.defaultChordingControlOption);
        setStartHintOption(userSettings.defaultStartHintOption);
        setGameTimeFormatOption(userSettings.defaultGameTimeFormatOption);
        setScoreTimeFormatOption(userSettings.defaultScoreTimeFormatOption);
        setVibrateOption(userSettings.defaultVibrateOption);
    }

    /**
     * Function to delete ALL local data stored on the device's browser
     * Must be called twice to perform delete, this is to prevent accidental delete
     * This includes settings, personal bests times, saved username, and save custom board parameters
     */
    const deleteAllLocalData = () => {

        // If the user has already confirmed they wish to delete then proceed
        if (isDeleteConfirm) {
            // Delete all local data
            userSettings.deleteAll();

            // Reset settings page to show any changes
            resetSettings();

            // Close the alert dialog
            handleClose();
        }
        // If this is the first time this function is called, ask for confirmation before delete
        else {
            setDeleteConfirm(true);
        }
    }


    /**
     * Function called on cancel, reset dialog to user settings, if any
     */
    function cancel() {

        // Reload the user settings before we leave, so available on next dialog open
        loadUserSettings();

        // Close the dialog
        handleClose();
    }

    /**
    * Function to close the settings dialog
    */
    const handleClose = () => {
        setOpen(false);
        setDeleteConfirm(false);
    };

    /**
     * Function called when the a new value is selected in the place flag dropdown
     * @param {Drop down selection event object} event
     */
    function handlePlaceFlagOptionChange(event) {
        setPlaceFlagsOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the chording control dropdown
     * @param {Drop down selection event object} event
     */
    function handleChordingControlOptionChange(event) {
        setChordingControlOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the start hint dropdown
     * @param {Drop down selection event object} event
     */
    function handleStartHintOptionChange(event) {
        setStartHintOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the game time format dropdown
     * @param {Drop down selection event object} event
     */
    function handleGameTimeFormatOptionChange(event) {
        setGameTimeFormatOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the score time format dropdown
     * @param {Drop down selection event object} event
     */
    function handleScoreTimeFormatOptionChange(event) {
        setScoreTimeFormatOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the vibrate dropdown
     * @param {Drop down selection event object} event
     */
    function handleVibrateOptionChange(event) {
        setVibrateOption(event.target.value);
    };

    /**
     * Function to get a styled label for our settings
     * @param {string} labelText
     */
    function getStyledLabel(labelText) {
        return <Box sx={dialogSx.styledLabel}>
            {labelText}
        </Box>;
    }

    /**
     * Function to get the vibrate options for display, if vibrate is supported on device
     * @returns Vibrate option UI component, else null if vibrate not supported
     */
    function getVibrateOptions() {
        if (gameSettings.isVibrateSupported) {
            return <Fragment>
                <Box sx={dialogSx.spacingHeight} />
                <TextField
                    id="vibrateOptions"
                    name="vibrateOptions"
                    select
                    label={getStyledLabel(gameText.sdVibrateOptionTitle)}
                    value={vibrateOption}
                    onChange={handleVibrateOptionChange}
                    helperText={gameText.sdVibrateOptionInfo}
                    margin={dialogSx.tfMarginType}
                    variant={dialogSx.tfVariantType}
                    sx={dialogSx.width}
                >
                    {userSettings.vibrateOptions.map((option) => (
                        <MenuItem key={option[0]} value={option[0]}>
                            {option[1]}
                        </MenuItem>
                    ))}
                </TextField>
            </Fragment>
        }
        else {
            return null;
        }
    }


    // RENDER

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                disableRestoreFocus
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit
                }}
            >
                <DialogTitle >
                    <Box>
                        {commonSx.settingsIcon}
                        <span>&nbsp;{gameText.settingsDialogTitle}</span>
                    </Box>
                </DialogTitle>
                <DialogContent sx={sx.dialogWidth}>
                    <TextField
                        id="flags"
                        name="flags"
                        select
                        label={getStyledLabel(gameText.sdFlagsOptionTitle)}
                        value={placeFlagsOption}
                        onChange={handlePlaceFlagOptionChange}
                        helperText={gameText.sdFlagsOptionInfo +
                            (gameSettings.deviceType === Device.DESKTOP ? gameText.controlsRClickLC : gameText.controlsLongPressLC)}
                        margin={dialogSx.tfMarginType}
                        variant={dialogSx.tfVariantType}
                        sx={dialogSx.width}
                    >
                        {userSettings.placeFlagsOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={dialogSx.spacingHeight} />
                    <TextField
                        id="chording"
                        name="chording"
                        select
                        label={getStyledLabel(gameText.sdChordingControlOptionTitle)}
                        value={chordingControlOption}
                        onChange={handleChordingControlOptionChange}
                        helperText={gameText.sdChordingControlOptionInfo +
                            (gameSettings.deviceType === Device.DESKTOP ? gameText.controlsLClickLC : gameText.controlsTapLC)}
                        margin={dialogSx.tfMarginType}
                        variant={dialogSx.tfVariantType}
                        sx={dialogSx.width}
                    >
                        {userSettings.chordingControlOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={dialogSx.spacingHeight} />
                    <TextField
                        id="startHint"
                        name="startHint"
                        select
                        label={getStyledLabel(gameText.sdStartHintOptionTitle)}
                        value={startHintOption}
                        onChange={handleStartHintOptionChange}
                        helperText={gameText.sdStartHintOptionInfo}
                        margin={dialogSx.tfMarginType}
                        variant={dialogSx.tfVariantType}
                        sx={dialogSx.width}
                    >
                        {userSettings.startHintOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={dialogSx.spacingHeight} />
                    <TextField
                        id="gameTimeFormat"
                        name="gameTimeFormat"
                        select
                        label={getStyledLabel(gameText.sdGameTimeFormatOptionTitle)}
                        value={gameTimeFormatOption}
                        onChange={handleGameTimeFormatOptionChange}
                        helperText={gameText.sdGameTimeFormatOptionInfo}
                        margin={dialogSx.tfMarginType}
                        variant={dialogSx.tfVariantType}
                        sx={dialogSx.width}
                    >
                        {userSettings.gameTimeFormatOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={dialogSx.spacingHeight} />
                    <TextField
                        id="scoreTimeFormat"
                        name="scoreTimeFormat"
                        select
                        label={getStyledLabel(gameText.sdScoreTimeFormatOptionTitle)}
                        value={scoreTimeFormatOption}
                        onChange={handleScoreTimeFormatOptionChange}
                        helperText={gameText.sdScoreTimeFormatOptionInfo}
                        margin={dialogSx.tfMarginType}
                        variant={dialogSx.tfVariantType}
                        sx={dialogSx.width}
                    >
                        {userSettings.scoreTimeFormatOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    {getVibrateOptions()}
                    <Box sx={sx.deleteBtnSpacingHeight} />
                    <Divider />
                    <Box sx={sx.deleteBtnSpacingHeight} />
                    <Box sx={sx.deleteBtnPosition}>
                        <Button
                            id="delete"
                            name="delete"
                            color={isDeleteConfirm ? sx.deleteConfirmColor : sx.deleteInitialColor}
                            margin={dialogSx.tfMarginType}
                            variant={sx.deleteBtnVariant}
                            sx={sx.deleteBtn}
                            startIcon={sx.deleteIcon}
                            onClick={deleteAllLocalData}
                        >
                            {isDeleteConfirm ? gameText.deleteAllLocalDataConfirm : gameText.deleteAllLocalData}
                        </Button>
                        <Box sx={dialogSx.spacingHeight} />
                        <Box sx={sx.deleteInfo}>
                            {gameText.deleteInfo}
                        </Box>
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={resetSettings}
                    >
                        {gameText.defaultButtonText}
                    </Button>
                    <Button
                        onClick={cancel}
                    >
                        {gameText.cancelButtonText}
                    </Button>
                    <Button
                        type="submit"
                        autoFocus
                    >
                        {gameText.saveButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

// EXPORT

export default SettingsDialog;