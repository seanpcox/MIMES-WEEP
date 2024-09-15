import * as gameText from '../../resources/text/gameText';
import * as options from '../../logic/settingsOptions.js';
import * as gameSettings from '../../logic/gameSettings.js';
import * as sx from '../../style/dialogSx.js';
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

    const [placeFlagsOption, setPlaceFlagsOption] = useState(options.defaultPlaceFlagsOption);

    const [longPressTimeOption, setLongPressTimeOption] = useState(options.defaultLongPressTimeOption);

    const [chordingControlOption, setChordingControlOption] = useState(options.defaultChordingControlOption);

    const [startHintOption, setStartHintOption] = useState(options.defaultStartHintOption);

    const [gameTimeFormatOption, setGameTimeFormatOption] = useState(options.defaultGameTimeFormatOption);

    const [scoreTimeFormatOption, setScoreTimeFormatOption] = useState(options.defaultScoreTimeFormatOption);


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

        if (localStorage.getItem(options.placeFlagsOptionLS)) {
            setPlaceFlagsOption(localStorage.getItem(options.placeFlagsOptionLS));
        }

        if (localStorage.getItem(options.longPressTimeOptionLS)) {
            setLongPressTimeOption(localStorage.getItem(options.longPressTimeOptionLS));
        }

        if (localStorage.getItem(options.chordingControlOptionLS)) {
            setChordingControlOption(localStorage.getItem(options.chordingControlOptionLS));
        }

        if (localStorage.getItem(options.startHintOptionLS)) {
            setStartHintOption(localStorage.getItem(options.startHintOptionLS));
        }

        if (localStorage.getItem(options.gameTimeFormatOptionLS)) {
            setGameTimeFormatOption(localStorage.getItem(options.gameTimeFormatOptionLS));
        }

        if (localStorage.getItem(options.scoreTimeFormatOptionLS)) {
            setScoreTimeFormatOption(localStorage.getItem(options.scoreTimeFormatOptionLS));
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

        localStorage.setItem(options.placeFlagsOptionLS, formJson.flags);

        localStorage.setItem(options.longPressTimeOptionLS, formJson.longPressDuration);

        localStorage.setItem(options.chordingControlOptionLS, formJson.chording);

        localStorage.setItem(options.startHintOptionLS, formJson.startHint);

        localStorage.setItem(options.gameTimeFormatOptionLS, formJson.gameTimeFormat);

        localStorage.setItem(options.scoreTimeFormatOptionLS, formJson.scoreTimeFormat);

        // Close the dialog
        handleClose();
    }

    /**
     * Function to reset all settings to their defaults
     */
    function resetSettings() {
        setPlaceFlagsOption(options.defaultPlaceFlagsOption);
        setLongPressTimeOption(options.defaultLongPressTimeOption);
        setChordingControlOption(options.defaultChordingControlOption);
        setStartHintOption(options.defaultStartHintOption);
        setGameTimeFormatOption(options.defaultGameTimeFormatOption);
        setScoreTimeFormatOption(options.defaultScoreTimeFormatOption);
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


    // RENDER

    // We only display the long press duration section on mobile and tablet
    var longPressSection = null;

    if (gameSettings.deviceType !== Device.DESKTOP) {
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
                    {options.longPressTimeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
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
                    {gameText.settingsDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="flags"
                        name="flags"
                        select
                        label={gameText.sdFlagsOptionTitle}
                        value={placeFlagsOption}
                        onChange={handlePlaceFlagOptionChange}
                        helperText={gameText.sdFlagsOptionInfo +
                            (gameSettings.deviceType === Device.DESKTOP ? gameText.controlsLClickLC : gameText.controlsTapLC)}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {options.placeFlagsOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    {longPressSection}
                    <TextField
                        id="chording"
                        name="chording"
                        select
                        label={gameText.sdChordingControlOptionTitle}
                        value={chordingControlOption}
                        onChange={handleChordingControlOptionChange}
                        helperText={gameText.sdChordingControlOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {options.chordingControlOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="startHint"
                        name="startHint"
                        select
                        label={gameText.sdStartHintOptionTitle}
                        value={startHintOption}
                        onChange={handleStartHintOptionChange}
                        helperText={gameText.sdStartHintOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {options.startHintOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="gameTimeFormat"
                        name="gameTimeFormat"
                        select
                        label={gameText.sdGameTimeFormatOptionTitle}
                        value={gameTimeFormatOption}
                        onChange={handleGameTimeFormatOptionChange}
                        helperText={gameText.sdGameTimeFormatOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {options.gameTimeFormatOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={sx.spacingHeight} />
                    <TextField
                        id="scoreTimeFormat"
                        name="scoreTimeFormat"
                        select
                        label={gameText.sdScoreTimeFormatOptionTitle}
                        value={scoreTimeFormatOption}
                        onChange={handleScoreTimeFormatOptionChange}
                        helperText={gameText.sdScoreTimeFormatOptionInfo}
                        margin={sx.tfMarginType}
                        variant={sx.tfVariantType}
                        sx={sx.width}
                    >
                        {options.scoreTimeFormatOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
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