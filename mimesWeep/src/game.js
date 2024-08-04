import './mimesWeep.css';
import * as logic from './gameLogic.js';
import { useState } from 'react';
import Board from './board.js'
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

Game.propTypes = {
    difficulty: PropTypes.number
}

function Game(props) {
    var height;
    var width;
    var numOfMimes;

    switch (props.difficulty) {
        case 2:
            height = 16;
            width = 16;
            numOfMimes = 40;
            break;
        case 3:
            height = 16;
            width = 30;
            numOfMimes = 99;
            break;
        default:
            height = 9;
            width = 9;
            numOfMimes = 10;
            break;
    }

    var squaresToWin = (height * width) - numOfMimes;
    var squaresWon = 0;

    const array = logic.createEmptyBoard(height, width);

    logic.addMimes(array, numOfMimes);

    logic.addMimeNeighborCount(array);

    const [startNewGame, startNewGameInternal] = useState(props);

    const [openLoseSnackbar, setOpenLoseSnackbar] = useState(false);
    const [openWinSnackbar, setOpenWinSnackbar] = useState(false);

    function lostGameCallback() {
        setOpenLoseSnackbar(true);
    }

    const handleLoseSnackbarClose = () => {
        setOpenLoseSnackbar(false)
      };

    function incrementSquaresWonCallback(count) {
        squaresWon += count;

        if (squaresWon == squaresToWin) {
            setOpenWinSnackbar(true)
        }
    }

    const handleWinSnackbarClose = () => {
        setOpenWinSnackbar(false)
      };

    return (
        <div>
            <Board array={array} incrementSquaresWonCallback={incrementSquaresWonCallback} lostGameCallback={lostGameCallback} />
            <Snackbar open={openLoseSnackbar} autoHideDuration={5000} onClose={handleLoseSnackbarClose} 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={handleLoseSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    Sorry, you have lost.
                </Alert>
            </Snackbar>
            <Snackbar open={openWinSnackbar} autoHideDuration={5000} onClose={handleWinSnackbarClose} 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={handleWinSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    Congratulations, you have won!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Game;