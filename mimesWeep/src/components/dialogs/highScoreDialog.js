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
 * Dialog to display the high scores and personal best times associated with the current level
 * Dialog is displayed when a new high score or personal best time occurs, and allows user to
 * modify the username associated with the new score if they wish.
 * Dialog can also be displayed to just view the exiting high score and personal best times.
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
     * Function to close the high score dialog and reset its parameters
     */
    const handleClose = () => {
        // Clear any highlighted high score row
        props.setHighlightRowCallback(-1);
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
                // Get the data store id of the new high score row
                var id = row.id;

                // Update the username on the newly saved high score row
                highScoreDB.updateUsername(id, username);

                // Retrieve the bottom high score row
                var bottomHighScoreRow = tableRef.current.getBottomHighScoreRow();

                // If we get a valid row returned then delete all high scores with times greater than it from the database.
                // We also delete entries with times equal to it but with a later date. 
                // In the event of time ties we use date to determine order, where the earlier date wins.
                // If we get -1 this usually indicates that we have yet to fill all the high score positions.
                if (bottomHighScoreRow !== -1) {
                    highScoreDB.deleteDeprecatedScores(bottomHighScoreRow.timeMs, bottomHighScoreRow.dateES, props.level, Period.ALL);
                }

                // Save the provided username in local storage so we can use it by default next time
                scoreLogic.setLSUsername(username);

                // If this was also a personal best then update the name associated with it
                scoreLogic.updatePersonalBestName(props.level, row.timeMs, row.dateES, username);
            }
            // An ID of -2 means we only scored a personal best, not a high score, and want to update its associated username
            else if (row === -2) {
                scoreLogic.savePersonalBestName(props.level, username);
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
        return props.highlightRowNumberRef.current >= 0 || props.personalBestRowHightlightedRef.current;
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

    // High score table is the same whether viewing a new score or just viewing existing ones
    var highScoreTable =
        <HighScoreTable
            ref={tableRef}
            level={props.level}
            highlightRowNumber={props.highlightRowNumberRef.current}
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
        // Else input label is set to the default instructions
        else {
            inputLabel = gameText.hsDialogInputLabel;
        }

        // Retrieve the username last used on this device, if any, from local storage
        var defaultUsername = scoreLogic.getLSUsername();

        // If the last username used is the excluded word "Unknown" then clear it
        // We are trying to encourage users to enter a unique username
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
    // Else if we are just viewing existing scores
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