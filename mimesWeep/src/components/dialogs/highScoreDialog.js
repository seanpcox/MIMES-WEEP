import * as gameText from '../../resources/text/gameText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import HighScoreTable from '../highScoreTable';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useEffect, useState, Fragment } from 'react';

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
        setOpen(false);
        props.setHighlightRowCallback(-1);
    };

    /**
     * Create and return the title for the high score dialog
     * @returns Title for high score dialog
     */
    function getTitle() {
        return gameText.highScoreDialogTitle + " - " + props.subTitle;
    }

    // RENDER

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {getTitle()}
                </DialogTitle>
                <DialogContent>
                    <HighScoreTable level={props.subTitle} highlightRowNumber={props.highlightRowNumber.current} />
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

export default HighScoreDialog;