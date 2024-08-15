import * as gameText from '../../resources/text/gameText';
import * as sx from '../../style/finishedMessageSx.js';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import { useState, useEffect, Fragment } from 'react';

/**
 * Snackbar type message to show on game win or lose
 */

// PROP LIST

FinishedMessage.propTypes = {
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func
}

// COMPONENT

function FinishedMessage(props) {

    // STATES

    const [openLoseSnackbar, setOpenLoseSnackbar] = useState(false);
    const [openWinSnackbar, setOpenWinSnackbar] = useState(false);


    // EFFECTS

    // Effect to open the lose message snackbar
    useEffect(() => {
        props.displayLoseMessageCallback([openLoseSnackbar, setOpenLoseSnackbar]);
    }, [props.displayLoseMessageCallback, openLoseSnackbar]);

    // Effect to open the win message snackbar
    useEffect(() => {
        props.displayWinMessageCallback([openWinSnackbar, setOpenWinSnackbar]);
    }, [props.displayWinMessageCallback, openWinSnackbar]);


    // INTERNAL FUNCTIONS

    /**
     * Function to close the lose message snackbar
     */
    const handleLoseSnackbarClose = () => {
        setOpenLoseSnackbar(false)
    };

    /**
    * Function to close the win message snackbar
    */
    const handleWinSnackbarClose = () => {
        setOpenWinSnackbar(false)
    };


    // RENDER

    return (
        <Fragment>
            <Snackbar
                open={openLoseSnackbar}
                autoHideDuration={sx.autoHideDuration}
                onClose={handleLoseSnackbarClose}
                anchorOrigin={sx.anchorOrigin}
            >
                <Alert
                    severity="error"
                    variant={sx.alertVariant}
                    onClose={handleLoseSnackbarClose}
                    sx={sx.width}
                >
                    {gameText.loseMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openWinSnackbar}
                autoHideDuration={sx.autoHideDuration}
                onClose={handleWinSnackbarClose}
                anchorOrigin={sx.anchorOrigin}
            >
                <Alert
                    severity="success"
                    variant={sx.alertVariant}
                    onClose={handleWinSnackbarClose}
                    sx={sx.width}
                >
                    {gameText.winMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

// EXPORT

export default FinishedMessage;