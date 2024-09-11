import * as gameText from '../../resources/text/gameText';
import * as highScoreDB from '../../logic/highScoreDB';
import * as scoreLogic from '../../logic/scoreLogic.js';
import * as sx from '../../style/highScoreDialogSx.js'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import HighScoreTable from '../highScoreTable';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Period } from "../../models/index.js";

/**
 * Dialog to display the high scores of the current board level displayed
 */

// PROP LIST

HighScoreDialog.propTypes = {
    openHighScoreDialogCallback: PropTypes.func,
    setHighlightRowCallback: PropTypes.func,
    setPersonalBestRowHighlighed: PropTypes.func,
    level: PropTypes.string,
    highlightRowNumberRef: PropTypes.object,
    personalBestRowHightlightedRef: PropTypes.object
}

// COMPONENT

function HighScoreDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [isError, setError] = useState(0);


    // REFS

    const tableRef = useRef(null);


    // EFFECTS

    // Effect to open the high score dialog
    useEffect(() => {
        props.openHighScoreDialogCallback([open, setOpen]);
    }, [props.openHighScoreDialogCallback, open]);


    // LOCAL FUNCTIONS

    /**
     * Function to close the high score dialog
     */
    const handleClose = () => {
        // Reset the highlighted row to none for next launch
        props.setHighlightRowCallback(-1);
        // Reset the personal best highlighted flag
        props.setPersonalBestRowHighlighed(false);
        // Close the dialog
        setOpen(false);
        // Reset the error state for the next launch
        setError(0);
    };

    /**
     * Function to validate and parse user input data on form submit
     * @param {Form submit event} event
     */
    function onSubmit(event) {
        // This prevents the entire page from reloading on submit
        event.preventDefault();

        // Retrieve the user game parameters for height, width, and number of mimes
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        // Get the entered username
        const username = formJson.username;

        // Check the username is valid format and not an excluded word
        if (isUsernameFormatValid(username) && isUsernameNonExcludedWord(username)) {
            // If the username is valid set error to false
            setError(0);

            // Get the new high score row
            var row = tableRef.current.getSelectedRow();

            // If we have a valid data store id then update the new high score with the new username
            // And delete scores that we no longer need in the database
            // An ID of -2 means we scored a personal best and want to update the associated name
            // An ID of -1 means an error condition and we do nothing in that case
            if (row !== -1 && row !== -2) {
                // Get the data store id of the new high score row
                var id = row.id;

                // Update the username on the newly saved high score row
                highScoreDB.updateUsername(id, username);

                // Retrieve the time that the new high score puts outside of our high score list
                var replacedHighScoreTime = tableRef.current.getReplacedHighScoreTimeMs();

                // If we get a valid time returned then delete all times greater than it from the database
                // Note: We delete all times greater, and not greater or equal to, as we may have a tie
                // for last high score place (which is decided by date) and don't wish to accidently delete
                // a tied high score place.
                if (replacedHighScoreTime !== -1) {
                    highScoreDB.deleteDeprecatedScores(replacedHighScoreTime, props.level, Period.ALL);
                }

                // Save the provided username in local storage so we can display it by default next time
                scoreLogic.setLSUsername(username);

                scoreLogic.updatePersonalBestName(props.level, row.timeMs, row.dateES, username);
            }
            // An ID of -2 means we scored a personal best and want to update the associated name
            else if (row === -2) {
                scoreLogic.savePersonalBestName(props.level, username);
            }
        }
        // If invalid warn user and return
        else {
            // If the username is a excluded word then set that error code
            if (!isUsernameNonExcludedWord(username)) {
                setError(2);
            }
            // Else the username format must be invalid so set that error code
            else {
                setError(1);
            }

            // Return for further input
            return;
        }

        // Close the dialog
        handleClose();
    }

    /**
     * Function to determine if the HS Dialog is for saving or viewing High Scores
     * @returns True if HS Save Dialog, False if High Score View Dialog
     */
    function isHighScoreSaveDialog() {
        // If we have a highlighted row it means we are asking the user to save a high score
        return props.highlightRowNumberRef.current >= 0;
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
        return username && username.length > 0 &&
            username.toLowerCase() !== scoreLogic.unknownUser.toLowerCase();
    }

    /**
     * Create and return the title for the high score dialog
     * @returns Title for high score dialog
     */
    function getTitle() {
        return gameText.highScoreDialogTitle + " - " + props.level;
    }


    // RENDER

    var dialogContent;

    var dialogActions;

    // High score table is the same whether just viewing the table or saving a high score
    var highScoreTable =
        <HighScoreTable
            ref={tableRef}
            level={props.level}
            highlightRowNumber={props.highlightRowNumberRef.current}
            highlightPersonalBest={props.personalBestRowHightlightedRef.current}
        />;

    // If we are saving a high score
    if (isHighScoreSaveDialog()) {
        var inputLabel;

        // Label input is updated if an invalid format username is entered
        if (isError === 1) {
            inputLabel = gameText.hsDialogFormatErrorLabel;
        }
        // Label input is updated if an excluded word username is entered
        else if (isError === 2) {
            inputLabel = gameText.hsDialogExcludedWordErrorLabel;
        }
        // Else input label is set to the default instructions
        else {
            inputLabel = gameText.hsDialogInputLabel;
        }

        // Retrieve the username last used on this device, if any, from local storage
        var defaultUsername = scoreLogic.getLSUsername();

        // If the last username used the excluded word "Unknown" then clear it
        if (defaultUsername == scoreLogic.unknownUser) {
            defaultUsername = "";
        }

        dialogContent =
            <DialogContent>
                <Box sx={sx.spacingTopHeight} />
                <FormControl error={isError !== 0} sx={sx.inputAreaWidth}>
                    <InputLabel htmlFor="username">{inputLabel}</InputLabel>
                    <OutlinedInput
                        autoFocus
                        id="username"
                        name="username"
                        defaultValue={defaultUsername}
                        label={inputLabel}
                        sx={sx.inputAreaHeight}
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
    // Else if we are just viewing high scores
    else {
        dialogContent =
            <DialogContent>
                <Box sx={sx.spacingTopHeight} />
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
                    {getTitle()}
                </DialogTitle>
                {dialogContent}
                {dialogActions}
            </Dialog>
        </Fragment>
    );

}

// EXPORT

export default HighScoreDialog;