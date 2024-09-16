import * as commonSx from '../../style/commonSx.js';
import * as gameText from '../../resources/text/gameText';
import * as gameSettings from '../../logic/gameSettings.js';
import * as sx from '../../style/dialogSx.js';
import * as userSettings from '../../logic/userSettings.js';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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

    const [longPressTimeOption, setLongPressTimeOption] = useState(userSettings.defaultLongPressTimeOption);

    const [chordingControlOption, setChordingControlOption] = useState(userSettings.defaultChordingControlOption);

    const [startHintOption, setStartHintOption] = useState(userSettings.defaultStartHintOption);

    const [gameTimeFormatOption, setGameTimeFormatOption] = useState(userSettings.defaultGameTimeFormatOption);

    const [scoreTimeFormatOption, setScoreTimeFormatOption] = useState(userSettings.defaultScoreTimeFormatOption);


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

        if (localStorage.getItem(userSettings.longPressTimeOptionLS)) {
            setLongPressTimeOption(localStorage.getItem(userSettings.longPressTimeOptionLS));
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

        localStorage.setItem(userSettings.longPressTimeOptionLS, formJson.longPressDuration);

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
        setLongPressTimeOption(userSettings.defaultLongPressTimeOption);
        setChordingControlOption(userSettings.defaultChordingControlOption);
        setStartHintOption(userSettings.defaultStartHintOption);
        setGameTimeFormatOption(userSettings.defaultGameTimeFormatOption);
        setScoreTimeFormatOption(userSettings.defaultScoreTimeFormatOption);
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
    };

    /**
     * Function called when the a new value is selected in the place flag dropdown
     * @param {Drop down selection event object} event
     */
    function handlePlaceFlagOptionChange(event) {
        setPlaceFlagsOption(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the long press dropdown
     * @param {Drop down selection event object} event
     */
    function handleLongPressTimeOptionChange(event) {
        setLongPressTimeOption(event.target.value);
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
     * Function to get a styled label for our settings
     * @param {string} labelText
     */
    function getStyledLabel(labelText) {
        return <Box sx={sx.styledLabel}>
            {labelText}
        </Box>;
    }

    // RENDER

    // We only display the long press duration section on mobile and tablet
    var longPressSection = null;

    // TODO: Issues going lower than 500 on Android, so disable this for now, check it out
    if (false && gameSettings.deviceType !== Device.DESKTOP) {
        longPressSection =
            <Fragment>
                <TextField
                    id="longPressDuration"
                    name="longPressDuration"
                    select
                    label={gameText.sdLongPressTimeOptionTitle}
                    value={longPressTimeOption}
                    onChange={handleLongPressTimeOptionChange}
                    helperText={gameText.sdLongPressTimeOptionInfo}
                    margin={sx.tfMarginType}
                    variant={sx.tfVariantType}
                    sx={sx.width}
                >
                    {userSettings.longPressTimeOptions.map((option) => (
                        <MenuItem key={option[0]} value={option[0]}>
                            {option[1]}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={sx.spacingHeight} />
            </Fragment>
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit
                }}
            >
                <DialogTitle>
                    <div style={sx.titleDivStyle}>
                        {commonSx.settingsIcon}
                        <span>&nbsp;{gameText.settingsDialogTitle}</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="flags"
                        name="flags"
                        select
                        label={getStyledLabel(gameText.sdFlagsOptionTitle)}
                        value={placeFlagsOption}
                        onChange={handlePlaceFlagOptionChange}
                        helperText={gameText.sdFlagsOptionInfo +
                            (gameSettings.deviceType === Device.DESKTOP ? gameText.controlsRClickLC : gameText.controlsLongPressLC)}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {userSettings.placeFlagsOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    {longPressSection}
                    <TextField
                        id="chording"
                        name="chording"
                        select
                        label={getStyledLabel(gameText.sdChordingControlOptionTitle)}
                        value={chordingControlOption}
                        onChange={handleChordingControlOptionChange}
                        helperText={gameText.sdChordingControlOptionInfo +
                            (gameSettings.deviceType === Device.DESKTOP ? gameText.controlsLClickLC : gameText.controlsTapLC)}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {userSettings.chordingControlOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="startHint"
                        name="startHint"
                        select
                        label={getStyledLabel(gameText.sdStartHintOptionTitle)}
                        value={startHintOption}
                        onChange={handleStartHintOptionChange}
                        helperText={gameText.sdStartHintOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {userSettings.startHintOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="gameTimeFormat"
                        name="gameTimeFormat"
                        select
                        label={getStyledLabel(gameText.sdGameTimeFormatOptionTitle)}
                        value={gameTimeFormatOption}
                        onChange={handleGameTimeFormatOptionChange}
                        helperText={gameText.sdGameTimeFormatOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {userSettings.gameTimeFormatOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="scoreTimeFormat"
                        name="scoreTimeFormat"
                        select
                        label={getStyledLabel(gameText.sdScoreTimeFormatOptionTitle)}
                        value={scoreTimeFormatOption}
                        onChange={handleScoreTimeFormatOptionChange}
                        helperText={gameText.sdScoreTimeFormatOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {userSettings.scoreTimeFormatOptions.map((option) => (
                            <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                            </MenuItem>
                        ))}
                        gameTimeFormatOptions
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={resetSettings}
                    >
                        {gameText.resetButtonText}
                    </Button>
                    <Button
                        onClick={cancel}
                    >
                        {gameText.cancelButtonText}
                    </Button>
                    <Button
                        type="submit"
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