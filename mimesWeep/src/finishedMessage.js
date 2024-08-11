import './mimesWeep.css';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import * as gameText from './resources/text/gameText';

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

    return (
        <div>
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
                    sx={{ width: '100%' }}
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
                    sx={{ width: '100%' }}
                >
                    {gameText.winMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FinishedMessage;