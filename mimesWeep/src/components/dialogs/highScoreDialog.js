import * as commonSx from '../../style/commonSx.js';
import * as dialogSx from '../../style/dialogSx.js';
import * as gameText from '../../resources/text/gameText';
import * as highScoreDB from '../../logic/highScoreDB';
import * as scoreLogic from '../../logic/scoreLogic.js';
import * as gameSettings from '../../logic/gameSettings.js';
import * as sx from '../../style/highScoreDialogSx.js'
import * as userSettings from '../../logic/userSettings.js';
import * as excludedWords from '../../resources/text/excluded/excludedWordList.js';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import HighScoreTable from '../highScoreTable';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import { Box, Button } from '@mui/material';
import { Period } from "../../models/index.js";
import { Fragment, useEffect, useState } from 'react';

/**
 * Dialog to display the high scores and personal best times associated with the current level
 * Dialog is displayed when a new high score or personal best time occurs, and allows user to
 * modify the username associated with the new score if they wish.
 * Dialog can also be displayed to just view the exiting high score and personal best times.
 */

// PROP LIST

HighScoreDialog.propTypes = {
    difficulty: PropTypes.number,
    highScoreDataRef: PropTypes.object,
    personalBestPeriodsRef: PropTypes.object,
    resetScoreRefsCallback: PropTypes.func,
    openHighScoreDialogCallback: PropTypes.func
}

// COMPONENT

function HighScoreDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [isError, setError] = useState(0);

    const [difficulty, setDifficulty] = useState(1);

    const [period, setPeriod] = useState(Period.ALL);


    // EFFECTS

    // Effect to open or close the high score dialog
    useEffect(() => {

        // Set the difficulty to match that of the main application
        let displayDifficultyLevel = props.difficulty;

        // If we get an invalid difficulty level (Custom not supported) then default to first level
        if (displayDifficultyLevel <= 0 || displayDifficultyLevel >= 4) {
            displayDifficultyLevel = 1;
        }

        // Set the dialog to use the selected diifculty level
        setDifficulty(displayDifficultyLevel);

        // Set the default display period to all time
        let displayPeriod = Period.ALL;

        // If we have been called with high score periods then default to the first one, which will be the highest period
        if (props.highScoreDataRef.current.length >= 1) {
            displayPeriod = props.highScoreDataRef.current[0].period;
        }
        // Else if we have been called only with personal best periods then default to the first one, which will be the highest period
        else if (props.personalBestPeriodsRef.current.length >= 1) {
            displayPeriod = props.personalBestPeriodsRef.current[0];
        }

        // Set the dialog to use the selected period
        setPeriod(displayPeriod);

        // Open or close the dialog
        props.openHighScoreDialogCallback([open, setOpen]);

    }, [props.openHighScoreDialogCallback, open, props.highScoreDataRef.current, props.personalBestPeriodsRef.current]);


    // LOCAL FUNCTIONS

    /**
     * Function to close the high score dialog and reset its parameters
     */
    const handleClose = () => {
        // Clear any score data from the parent
        props.resetScoreRefsCallback();
        // Reset the error state to none
        setError(0);
        // Close the dialog
        setOpen(false);
    };

    /**
     * Function to validate and parse user input data on form submit
     * @param {Form submit event} event
     */
    function onSubmit(event) {
        // This prevents the entire page from reloading on submit
        event.preventDefault();

        // Retrieve the form parameters
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        // Get the entered username
        const username = formJson.username;

        // Check the username is valid format, is not the default unknown, and does not contain an excluded word
        if (isUsernameFormatValid(username) && !isUsernameUnknown(username) && !isUsernameContainsExcludedWord(username)) {
            // If the username is valid set error to false
            setError(0);

            // If the username has been updated from the currently saved one then update
            // all new high score database objects we have been passed. They are all
            // associate with the same high score, just saved across different high score periods.
            if (username !== getHighlightHighScoreUsername()) {

                // Update the username on the newly saved high score database entries
                for (let i = 0; i < props.highScoreDataRef.current.length; i++) {
                    highScoreDB.updateUsername(props.highScoreDataRef.current[i].id, username);
                }

                // Update the username on any personal best periods also
                if (isPersonalBest()) {
                    for (let i = 0; i < props.personalBestPeriodsRef.current.length; i++) {
                        // If this was also a personal best then update the name associated with it
                        scoreLogic.savePersonalBestName(getLevel(), props.personalBestPeriodsRef.current[i], username);
                    }
                }

                // Save the provided username in local storage so we can use it by default next time
                userSettings.setLSUsername(username);
            }
        }
        // If the username is invalid then warn the user and prompt for an updated entry
        else {
            // If the username format is invalid set the associated error code 1
            if (!isUsernameFormatValid(username)) {
                setError(1);
            }
            // Else the username must have failed the excluded or UNKNOWN word test so set the associated error code of 2
            else {
                setError(2);
            }

            // Return to allow for an updated entry
            return;
        }

        // Close the dialog
        handleClose();
    }

    /**
     * Function to determine if the HS Dialog is displaying a new high score or personal best
     * @returns True if for new score, else False
     */
    function isNewScoreDialog() {
        // If we have a highlighted high score row it means we are displaying a new high score,
        // or if the personal best flag is true we are displayed a new personal best.
        return isHighScore() || isPersonalBest();
    }

    /**
     * Function to determine if we have a high score for display
     * @returns True if we have a high score, else False
     */
    function isHighScore() {
        return props.highScoreDataRef.current.length > 0;
    }

    /**
     * Function to determine if we have a personal best for display
     * @returns True if we have a personal best, else False
     */
    function isPersonalBest() {
        return props.personalBestPeriodsRef.current !== null && props.personalBestPeriodsRef.current.length > 0;
    }

    /**
     * Function to return the row DB id for the high score we want to highlight
     * @returns ID for the high score row to highlight, else null if none
     */
    function getHighlightHighScoreID() {
        return isHighScore() ? props.highScoreDataRef.current[0].id : null;
    }

    /**
     * Function to return the user name of the high score we are highlighting
     * @returns Username of the high score we are highlighting, else null if none
     */
    function getHighlightHighScoreUsername() {
        return isHighScore() ? props.highScoreDataRef.current[0].name : null;
    }

    /**
     * Function to determine if we will be highlighting the personal best row
     * @returns True if we will be highlighting the personal best row, else false
     */
    function isHighlightPersonalBest() {

        // If we have a personal best determine if we are highlighting it
        if (isPersonalBest()) {

            // Loop through the personal best periods we have
            for (let i = 0; i < props.personalBestPeriodsRef.current.length; i++) {

                // If we have a personal best for the period we are displaying then we highlight it
                if (props.personalBestPeriodsRef.current[i] === period) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Function to determine if the supplied username is in a valid format
     * @param {String} username
     */
    function isUsernameFormatValid(username) {
        return username && username.length > 0 && username.length <= 10;
    }

    /**
     * Function to determine if the supplied username is the backup UNKNOWN, we want a real username
     * @param {String} username
     * @returns True if username is UNKNOWN, else False
     */
    function isUsernameUnknown(username) {
        // We exclude the default "Unknown" to encourage users to enter a unique username
        return username && username.length > 0 &&
            username.toLowerCase() === gameText.unknownUsername.toLowerCase();
    }

    /**
    * Function to determine if the supplied username contains an excluded word
    * @param {String} username
    * @returns True if username contains an excluded word, else False
    */
    function isUsernameContainsExcludedWord(username) {
        // We exclude any words that may be used to cause offense to others
        // This is a best first attempt and may need further work
        // Not all words included in here are offensive by themselves but could perhaps be used in
        // connection with other words to cause offense. Not trying to exclude anyone, but as I say
        // it may need more work. First time doing this.
        return excludedWords.match(username);
    }

    /**
     * Create and return the title text for the high score dialog
     * @returns Title text for high score dialog
     */
    function getTitleText() {
        // We display the period on new score, since we don't have the drop downs to see
        // The level can be assumed by the game level they were playing
        // We can't display both level and period as it causes a new line on mobile devices, too much text to fit

        // Just viewing existing high scores
        if (!isNewScoreDialog()) {
            return gameText.highScoreDialogTitle;
        }

        // Scored a new high score, and potentially a personal best also (no room to fit both in title)
        if (isHighScore()) {
            return gameText.highScoreNewHSDialogTitle + " - " + gameSettings.getPeriodString(period);
        }

        // Else we must have scored a personal best
        return gameText.highScoreNewPBDialogTitle + " - " + gameSettings.getPeriodString(period);
    }

    /**
     * Create and return the title icon for the high score dialog based on whether new score achieved or viewing existing
     * @returns Title icon for high score dialog
     */
    function getTitleIcon() {
        if (isNewScoreDialog()) {
            return gameSettings.getDifficultyIcon(difficulty);
        } else {
            return commonSx.timerIcon;
        }
    }

    /**
     * Function to return the level string we use in our database
     * @returns string
     */
    function getLevel() {
        return gameSettings.getLevelString(difficulty);
    }

    /**
     * Function called when the a new value is selected in the difficulty dropdown
     * @param {Drop down selection event object} event
     */
    function handleDifficultyChange(event) {
        setDifficulty(event.target.value);
    };

    /**
     * Function called when the a new value is selected in the period dropdown
     * @param {Drop down selection event object} event
     */
    function handlePeriodChange(event) {
        setPeriod(event.target.value);
    }

    /**
    * Function to determine whether to autofocus the input field on open
    * @returns True if we wish to autofocus the input field, else False
     */
    function isLabelAutoFocus(defaultUsername) {

        // If we have a new score and do not have a valid username saved from before then focus on the input text field
        if (isNewScoreDialog() && (!isUsernameFormatValid(defaultUsername) || isUsernameUnknown(defaultUsername))) {
            return true;
        }

        // Else we focus on the OK/Update button
        return false;
    }

    // RENDER

    let dialogContent;

    let dialogActions;

    // High score table is the same whether viewing a new score or just viewing existing ones
    let highScoreTable =
        <HighScoreTable
            level={getLevel()}
            period={period}
            highlightRowID={getHighlightHighScoreID()}
            highlightPersonalBest={isHighlightPersonalBest()}
        />;

    // If we are viewing a new score
    if (isNewScoreDialog()) {
        let inputLabel;

        // Label input is updated if an invalid format username is entered
        if (isError === 1) {
            inputLabel = gameText.hsDialogFormatErrorLabel;
        }
        // Label input is updated if an excluded word username is entered
        else if (isError === 2) {
            inputLabel = gameText.hsDialogExcludedWordErrorLabel;
        }
        // Else input label is set to instruct
        else {
            inputLabel = gameText.hsDialogInputScoresLabel;
        }

        // Retrieve the username last used on this device, if any, from local storage
        let defaultUsername = userSettings.getLSUsername();

        // If the last username used is the excluded word "Unknown" then clear it
        // We are trying to encourage users to enter a unique username
        if (defaultUsername === gameText.unknownUsername) {
            defaultUsername = "";
        }

        dialogContent =
            <DialogContent>
                <Box sx={sx.spacingTopHeight} />
                <FormControl error={isError !== 0} sx={sx.formWidth}>
                    <InputLabel htmlFor="username">{inputLabel}</InputLabel>
                    <OutlinedInput
                        autoFocus={isLabelAutoFocus(defaultUsername)}
                        id="username"
                        name="username"
                        defaultValue={defaultUsername}
                        label={inputLabel}
                        sx={sx.input}
                    />
                </FormControl>
                <Box sx={sx.spacingBottomHeight} />
                {highScoreTable}
            </DialogContent>

        dialogActions =
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    {gameText.cancelButtonText}
                </Button>
                <Button
                    type="submit"
                    autoFocus={!isLabelAutoFocus(defaultUsername)}
                >
                    {gameText.updateButtonText}
                </Button>
            </DialogActions>;
    }
    // Else if we are just viewing existing scores
    else {
        dialogContent =
            <DialogContent>
                <Box sx={sx.spacingTopHeight} />
                <FormControl sx={sx.lFormWidth}>
                    <InputLabel sx={sx.lLabelPadding} htmlFor="difficulty">
                        {gameText.hsDifficultyDropDownLabel}
                    </InputLabel>
                    <Select
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        sx={sx.input}
                        label={gameText.hsDifficultyDropDownLabel}
                        id="difficulty"
                        name="difficulty"
                    >
                        <MenuItem
                            value={1}
                            sx={commonSx.font}
                        >
                            {gameSettings.getDifficultyString(1)}
                        </MenuItem>
                        <MenuItem
                            value={2}
                            sx={commonSx.font}
                        >
                            {gameSettings.getDifficultyString(2)}
                        </MenuItem>
                        <MenuItem
                            value={3}
                            sx={commonSx.font}
                        >
                            {gameSettings.getDifficultyString(3)}
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={sx.rFormWidth}>
                    <InputLabel sx={sx.rLabelPadding} htmlFor="period">
                        {gameText.hsPeriodDropDownLabel}
                    </InputLabel>
                    <Select
                        value={period}
                        onChange={handlePeriodChange}
                        sx={sx.input}
                        label={gameText.hsPeriodDropDownLabel}
                        id="period"
                        name="period"
                    >
                        {gameSettings.periodsInUse.map((period) => (
                            <MenuItem
                                key={period}
                                value={period}
                                sx={commonSx.font}
                            >
                                {gameSettings.getPeriodString(period)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={sx.spacingBottomHeight} />
                {highScoreTable}
            </DialogContent>

        dialogActions =
            <DialogActions>
                <Button
                    onClick={handleClose}
                    autoFocus
                >
                    {gameText.okButtonText}
                </Button>
            </DialogActions>;
    }

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
                <DialogTitle>
                    <Box sx={dialogSx.titleDivStyle}>
                        {getTitleIcon()}
                        <span>&nbsp;{getTitleText()}</span>
                    </Box>
                </DialogTitle>
                {dialogContent}
                <Divider />
                {dialogActions}
            </Dialog>
        </Fragment>
    );

}

// EXPORT

export default HighScoreDialog;