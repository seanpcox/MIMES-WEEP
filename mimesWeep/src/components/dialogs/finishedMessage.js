import * as gameText from '../../resources/text/gameText';
import * as sx from '../../style/finishedMessageSx.js';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import { useState, useEffect, Fragment } from 'react';

/**
 * Snackbar type message to show on game win or lose
 */

// PROP LIST

FinishedMessage.propTypes = {
    displayFinishMessageCallback: PropTypes.func
}

// COMPONENT

function FinishedMessage(props) {

    // STATES

    const [openFinishedSnackbar, setOpenFinishedSnackbar] = useState(-1);


    // EFFECTS

    // Effect to open the finished message snackbar
    useEffect(() => {
        props.displayFinishMessageCallback([openFinishedSnackbar, setOpenFinishedSnackbar]);
    }, [props.displayFinishMessageCallback, openFinishedSnackbar]);


    // INTERNAL FUNCTIONS

    /**
     * Function to close the finish message snackbar
     */
    const handleSnackbarClose = () => {
        setOpenFinishedSnackbar(-1)
    };


    // RENDER

    return (
        <Fragment>
            <Snackbar
                open={openFinishedSnackbar === 0}
                autoHideDuration={sx.autoHideDuration}
                onClose={handleSnackbarClose}
                anchorOrigin={sx.anchorOrigin}
                TransitionComponent={Slide}
            >
                <Alert
                    severity="error"
                    variant={sx.alertVariant}
                    onClose={handleSnackbarClose}
                    sx={sx.width}
                    icon={sx.loseIcon}
                >
                    {gameText.loseMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openFinishedSnackbar === 1}
                autoHideDuration={sx.autoHideDuration}
                onClose={handleSnackbarClose}
                anchorOrigin={sx.anchorOrigin}
                TransitionComponent={Slide}
            >
                <Alert
                    severity="success"
                    variant={sx.alertVariant}
                    onClose={handleSnackbarClose}
                    sx={sx.width}
                    icon={sx.winIcon}
                >
                    {gameText.winMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openFinishedSnackbar === 2}
                autoHideDuration={sx.autoHideDuration}
                onClose={handleSnackbarClose}
                anchorOrigin={sx.anchorOrigin}
                TransitionComponent={Slide}
            >
                <Alert
                    severity="secondary"
                    variant={sx.alertVariant}
                    onClose={handleSnackbarClose}
                    sx={sx.width}
                    icon={sx.winWithHintsIcon}
                >
                    {gameText.winWithHintsMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

// EXPORT

export default FinishedMessage;