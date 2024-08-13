import * as gameText from '../../resources/text/gameText';
import * as sx from '../../style/finishedMessageSx.js';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import { useState, useEffect, Fragment } from 'react';

FinishedMessage.propTypes = {
    displayLoseMessageCallback: PropTypes.func,
    displayWinMessageCallback: PropTypes.func
}

function FinishedMessage(props) {
    const [openLoseSnackbar, setOpenLoseSnackbar] = useState(false);
    const [openWinSnackbar, setOpenWinSnackbar] = useState(false);

    useEffect(() => {
        props.displayLoseMessageCallback([openLoseSnackbar, setOpenLoseSnackbar]);
    }, [props.displayLoseMessageCallback, openLoseSnackbar]);

    const handleLoseSnackbarClose = () => {
        setOpenLoseSnackbar(false)
    };

    useEffect(() => {
        props.displayWinMessageCallback([openWinSnackbar, setOpenWinSnackbar]);
    }, [props.displayWinMessageCallback, openWinSnackbar]);

    const handleWinSnackbarClose = () => {
        setOpenWinSnackbar(false)
    };

    const style = { width: '100%' };

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
                    sx={style}
                >
                    {gameText.winMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default FinishedMessage;