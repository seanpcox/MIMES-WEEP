import * as commonSx from '../../style/commonSx.js';
import * as dialogSx from '../../style/dialogSx.js';
import * as gameText from '../../resources/text/gameText';
import * as highScoreDB from '../../logic/highScoreDB';
import * as scoreLogic from '../../logic/scoreLogic.js';
import * as settings from '../../logic/gameSettings.js';
import * as sx from '../../style/highScoreDialogSx.js'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import HighScoreTable from '../highScoreTable';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import { Box, Button } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';

/**
 * Dialog to display the high scores and personal best times associated with the current level
 * Dialog is displayed when a new high score or personal best time occurs, and allows user to
 * modify the username associated with the new score if they wish.
 * Dialog can also be displayed to just view the exiting high score and personal best times.
 */

// PROP LIST

HighScoreDialog.propTypes = {
    openHighScoreDialogCallback: PropTypes.func,
    setHighlightIDCallback: PropTypes.func,
    setPersonalBestRowHighlighed: PropTypes.func,
    highScoreHighlightIDRef: PropTypes.object,
    personalBestRowHightlightedRef: PropTypes.object,
    difficulty: PropTypes.number
}

// COMPONENT

function HighScoreDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [isError, setError] = useState(0);

    const [difficulty, setDifficulty] = useState(props.difficulty);


    // REFS

    const tableRef = useRef(null);


    // EFFECTS

    // Effect to open the high score dialog
    useEffect(() => {
        // Open the dialog
        props.openHighScoreDialogCallback([open, setOpen]);

        // Set the difficulty to match that of the main application
        var displayDifficultyLevel = props.difficulty;

        // If we get an invalid difficulty level (Custom not supported) then default to first level
        if (displayDifficultyLevel <= 0 || displayDifficultyLevel >= 4) {
            displayDifficultyLevel = 1;
        }

        // Open the dialog with this difficulty level selected
        setDifficulty(displayDifficultyLevel);
    }, [props.openHighScoreDialogCallback, open]);


    // LOCAL FUNCTIONS

    /**
     * Function to close the high score dialog and reset its parameters
     */
    const handleClose = () => {
        // Clear any highlighted high score row
        props.setHighlightIDCallback(null);
        // Clear the personal best highlighted flag
        props.setPersonalBestRowHighlighed(false);
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

        // Check the username is valid format and not an excluded word
        if (isUsernameFormatValid(username) && isUsernameNonExcludedWord(username)) {
            // If the username is valid set error to false
            setError(0);

            // Get the highlighted high score row, if any
            var row = tableRef.current.getHighlightedHighScoreRow();

            // If we have a valid high score row then update the entry with the new username provided,
            // and delete scores that we no longer need in the database.
            // An ID of -1 means we had no highlighted high score or personal best row
            // An ID of -2 means that only the personal best row is highlighted
            if (row !== -1 && row !== -2) {
                // If the username has been updated from the currently saved one then update the database
                if (username !== row.user) {
                    // Get the data store id of the new high score row
                    var id = row.id;

                    // Update the username on the newly saved high score row
                    highScoreDB.updateUsername(id, username);
                }

                // Save the provided username in local storage so we can use it by default next time
                scoreLogic.setLSUsername(username);

                // If this was also a personal best then update the name associated with it
                scoreLogic.updatePersonalBestName(getLevel(), row.timeMs, row.dateES, username);
            }
            // An ID of -2 means we only scored a personal best, not a high score, and want to update its associated username
            else if (row === -2) {
                scoreLogic.savePersonalBestName(getLevel(), username);
            }
        }
        // If the username is invalid then warn the user and prompt for an updated entry
        else {
            // If the username is an excluded word then set the associated error code of 2
            if (!isUsernameNonExcludedWord(username)) {
                setError(2);
            }
            // Else the username format must be invalid so set the associated error code 1
            else {
                setError(1);
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
        return props.highScoreHighlightIDRef.current || props.personalBestRowHightlightedRef.current;
    }

    /**
     * Function to determine if the supplied username is in a valid format
     * @param {String} username
     */
    function isUsernameFormatValid(username) {
        return username && username.length > 0 && username.length <= 10;
    }

    /**
    * Function to determine if the supplied username is an excluded word
    * @param {String} username
    */
    function isUsernameNonExcludedWord(username) {
        // We exclude the default "Unknown" to encourage users to enter a unique username
        return username && username.length > 0 &&
            username.toLowerCase() !== gameText.unknownUsername.toLowerCase();
    }

    /**
     * Create and return the title for the high score dialog
     * @returns Title for high score dialog
     */
    function getTitle() {
        return gameText.highScoreDialogTitle + " - " + getLevel();
    }

    /**
     * Function to get the correct input label for the score/s we can update username on
     */
    function getInputLabel() {
        // New Highscore and Personal Best achieved
        if (props.highScoreHighlightIDRef.current && props.personalBestRowHightlightedRef.current) {
            return gameText.hsDialogInputScoresLabel;
        }
        // New Highscore achieved
        else if (props.highScoreHighlightIDRef.current) {
            return gameText.hsDialogInputHSLabel;
        }
        // Else must be Personal Best achieved
        else {
            return gameText.hsDialogInputPBLabel;
        }
    }

    /**
     * Function to return the level string we use in our database
     * @returns string
     */
    function getLevel() {
        return settings.getLevelString(difficulty);
    }

    /**
     * Function called when the a new value is selected in the difficulty dropdown
     * @param {Drop down selection event object} event
     */
    function handleDifficultyChange(event) {
        setDifficulty(event.target.value);
    };


    // RENDER

    var dialogContent;

    var dialogActions;

    // High score table is the same whether viewing a new score or just viewing existing ones
    var highScoreTable =
        <HighScoreTable
            ref={tableRef}
            level={getLevel()}
            highlightRowID={props.highScoreHighlightIDRef.current}
            highlightPersonalBest={props.personalBestRowHightlightedRef.current}
        />;

    // If we are viewing a new score
    if (isNewScoreDialog()) {
        var inputLabel;

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
            inputLabel = getInputLabel();
        }

        // Retrieve the username last used on this device, if any, from local storage
        var defaultUsername = scoreLogic.getLSUsername();

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
                        autoFocus
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
                <FormControl sx={sx.formWidth}>
                    <InputLabel htmlFor="difficulty">
                        {gameText.hsDropDownLabel}
                    </InputLabel>
                    <Select
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        sx={sx.input}
                        label={gameText.hsDropDownLabel}
                        id="difficulty"
                        name="difficulty"
                    >
                        <MenuItem
                            value={1}
                            sx={commonSx.font}
                        >
                            {settings.getDifficultyString(1)}
                        </MenuItem>
                        <MenuItem
                            value={2}
                            sx={commonSx.font}
                        >
                            {settings.getDifficultyString(2)}
                        </MenuItem>
                        <MenuItem
                            value={3}
                            sx={commonSx.font}
                        >
                            {settings.getDifficultyString(3)}
                        </MenuItem>
                    </Select>
                </FormControl>
                <Box sx={sx.spacingBottomHeight} />
                {highScoreTable}
            </DialogContent>

        dialogActions =
            <DialogActions>
                <Button
                    onClick={handleClose}
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
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit
                }}
            >
                <DialogTitle>
                    <Box style={dialogSx.titleDivStyle}>
                        {commonSx.highScoreIcon}
                        <span>&nbsp;{getTitle()}</span>
                    </Box>
                </DialogTitle>
                {dialogContent}
                {dialogActions}
            </Dialog>
        </Fragment>
    );

}

// EXPORT

export default HighScoreDialog;