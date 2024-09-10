import * as gameText from '../../resources/text/gameText';
import * as highScoreDB from '../../logic/highScoreDB';
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

/**
 * Dialog to display the high scores of the current board level displayed
 */

// PROP LIST

HighScoreDialog.propTypes = {
    openHighScoreDialogCallback: PropTypes.func,
    setHighlightRowCallback: PropTypes.func,
    subTitle: PropTypes.string,
    highlightRowNumber: PropTypes.object
}

// COMPONENT

function HighScoreDialog(props) {

    // STATES

    const [open, setOpen] = useState(false);

    const [isError, setError] = useState(false);


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
        // Close the dialog
        setOpen(false);
        // Reset the error state for the next launch
        setError(false);
    };

    /**
     * Function to execute if save high score is cancelled
     */
    function handleCancel() {
        // Get the data store id of the new high score row
        var id = tableRef.current.getSelectedRowID();

        // If we have a valid data store id then delete the new high score
        if (id !== -1) {
            highScoreDB.deleteScore(tableRef.current.getSelectedRowID());
        }

        // Close the dialog
        handleClose();
    }

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

        // Check the username is valid
        if (username && username.length > 0 && username.length <= 10) {
            // If the username is valid set error to false
            setError(false);

            // Get the data store id of the new high score row
            var id = tableRef.current.getSelectedRowID();

            // If we have a valid data store id then update the new high score with the new username
            if (id !== -1) {
                highScoreDB.updateUsername(tableRef.current.getSelectedRowID(), username);

                // Save the provided username in local storage so we can display it by default next time
                localStorage.setItem("mimesweepUser", username);
            }
        }
        // If invalid warn user and return
        else {
            // If the username is valid set error to true
            setError(true);
            // Return for further input
            return;
        }

        // Close the dialog
        handleClose();
    }

    /**
     * Create and return the title for the high score dialog
     * @returns Title for high score dialog
     */
    function getTitle() {
        return gameText.highScoreDialogTitle + " - " + props.subTitle;
    }

    // RENDER

    var dialogContent;

    var dialogActions;

    // High score table is the same whether just viewing the table or saving a high score
    var highScoreTable =
        <HighScoreTable
            ref={tableRef}
            level={props.subTitle}
            highlightRowNumber={props.highlightRowNumber.current}
        />;

    // If we are saving a high score
    if (props.highlightRowNumber.current >= 0) {
        var inputLabel;

        // Label input is updated if an invalid username is entered
        if (isError) {
            inputLabel = "Enter 1-10 Characters"
        } else {
            inputLabel = "Enter Username to Save";
        }

        dialogContent =
            <DialogContent>
                <Box sx={{ height: 8 }} />
                <FormControl error={isError} sx={{ width: '100%' }}>
                    <InputLabel htmlFor="username">{inputLabel}</InputLabel>
                    <OutlinedInput
                        autoFocus
                        id="username"
                        name="username"
                        defaultValue={localStorage.getItem("mimesweepUser")}
                        label={inputLabel}
                        sx={{ maxHeight: 55 }}
                    />
                </FormControl>
                <Box sx={{ height: 20 }} />
                {highScoreTable}
            </DialogContent>

        dialogActions =
            <DialogActions>
                <Button
                    onClick={handleCancel}
                >
                    {gameText.cancelButtonText}
                </Button>
                <Button
                    type="submit"
                >
                    {gameText.saveButtonText}
                </Button>
            </DialogActions>;
    }
    // Else if we are just viewing high scores
    else {
        dialogContent =
            <DialogContent>
                <Box sx={{ height: 10 }} />
                {highScoreTable}
            </DialogContent>

        dialogActions =
            <DialogActions>
                <Button
                    onClick={handleCancel}
                >
                    {gameText.okButtonText}
                </Button>
            </DialogActions>;
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={props.highlightRowNumber.current >= 0 ? handleCancel : handleClose}
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