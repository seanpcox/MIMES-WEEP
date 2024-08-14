import * as gameText from '../../resources/text/gameText';
import * as sx from '../../style/finishedMessageSx.js';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import { useState, useEffect, Fragment } from 'react';

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

    useEffect(() => {
        props.displayLoseMessageCallback([openLoseSnackbar, setOpenLoseSnackbar]);
    }, [props.displayLoseMessageCallback, openLoseSnackbar]);

    useEffect(() => {
        props.displayWinMessageCallback([openWinSnackbar, setOpenWinSnackbar]);
    }, [props.displayWinMessageCallback, openWinSnackbar]);

    // INTERNAL FUNCTIONS

    const handleLoseSnackbarClose = () => {
        setOpenLoseSnackbar(false)
    };

    const handleWinSnackbarClose = () => {
        setOpenWinSnackbar(false)
    };

    // RENDER

    return (
        <Fragment>
            <Snackbar
                open={openLoseSnackbar}
                autoHideDuration={3000}
                onClose={handleLoseSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={handleLoseSnackbarClose}
                    sx={sx.width}
                >
                    {gameText.loseMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openWinSnackbar}
                autoHideDuration={3000}
                onClose={handleWinSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
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