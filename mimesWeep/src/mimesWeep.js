import './mimesWeep.css';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import GameBoard from './gameBoard.js'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FinishedMessage from './finishedMessage.js';
import Toolbar from '@mui/material/Toolbar';
import CountBadge from './countBadge.js'
import { isMobile } from 'react-device-detect';

function MimesWeep() {
  const [difficulty, setDifficulty] = useState(1);

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
    resetGameChildComponentStates();
  };

  var gameSettings = getGameSettings(difficulty);

  var height = gameSettings[0], width = gameSettings[1], numOfMimes = gameSettings[2];

  var guessCount = 0;
  var setGuessCountChildFunction;

  const incrementGuessCountCallback = (callbackParams) => {
    if (Array.isArray(callbackParams)) {
      setGuessCountChildFunction = callbackParams[1];
    } else {
      guessCount += callbackParams;
      setGuessCountChildFunction(guessCount);
    }
  };

  var setGuessButtonToggledChildFunction;

  const guessButtonToggledCallback = (callbackParams) => {
    if (Array.isArray(callbackParams)) {
      setGuessButtonToggledChildFunction = callbackParams[1];
    } else {
      setGuessButtonToggledChildFunction(!callbackParams);
    }
  };

  var setButtonToggleChildFunction;

  const setButtonToggleCallback = (callbackParams) => {
    if (Array.isArray(callbackParams)) {
      setButtonToggleChildFunction = callbackParams[1];
    } else {
      setButtonToggleChildFunction(callbackParams);
    }
  };

  const [numOfGamesPlayed, setNumOfGamesPlayed] = useState(1);

  function handleRestart() {
    setNumOfGamesPlayed(numOfGamesPlayed + 1);
    resetGameChildComponentStates();
  };

  var showLoseMessage;

  const displayLoseMessageCallback = (setStateCallback) => {
    if (setStateCallback) {
      showLoseMessage = setStateCallback[1];
    } else {
      showLoseMessage(true);
    }
  };

  var showWinMessage;

  const displayWinMessageCallback = (setStateCallback) => {
    if (setStateCallback) {
      showWinMessage = setStateCallback[1];
    } else {
      showWinMessage(true);
    }
  };

  function resetGameChildComponentStates() {
    setGuessCountChildFunction(0);
    setGuessButtonToggledChildFunction(false);
    setButtonToggleChildFunction(false);
  }

  return (
    <div className="mimesWeep" onContextMenu={(e) => {
      e.preventDefault(); // prevent the default behaviour when right clicked
    }}>
      <div>
        <header className="mimesWeep-header">
          <p>
            M I M E S W E E P
          </p>
        </header>
      </div>
      <Box height={10} />
      <Toolbar sx={{ justifyContent: "center" }}>
        <Button variant="outlined" onClick={handleRestart}
          style={{
            maxHeight: 42, minHeight: 42, minWidth: 120, color: '#282c34', borderColor: 'lightGrey', textTransform: 'none', fontSize: 16
          }}>
          New Game</Button>
        <Box width={18} />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
            style={{ maxHeight: 42, minHeight: 42, minWidth: 120, color: '#282c34', borderColor: 'lightGrey' }}
          >
            <MenuItem value={1}>Easy</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Hard</MenuItem>
            <MenuItem value={4}>Hardest</MenuItem>
          </Select>
        </FormControl>
        <Box width={18} />
        <CountBadge numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          guessButtonToggledCallback={guessButtonToggledCallback} 
          setButtonToggleCallback={setButtonToggleCallback}/>
      </Toolbar>
      <Box height={10} />
      <GameBoard height={height} width={width} numOfMimes={numOfMimes}
        displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback}
        incrementGuessCountCallback={incrementGuessCountCallback} guessButtonToggledCallback={guessButtonToggledCallback} />
      <FinishedMessage displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
    </div>
  );
}

function getGameSettings(difficulty) {
  var height, width, numOfMimes;

  switch (difficulty) {
    case 2:
      if (isMobile) {
        height = 13;
        width = 9;
        numOfMimes = 18;
      } else {
        height = 16;
        width = 16;
        numOfMimes = 40;
      }
      break;
    case 3:
      if (isMobile) {
        height = 17;
        width = 9;
        numOfMimes = 30;
      } else {
        height = 16;
        width = 30;
        numOfMimes = 99;
      }
      break;
    case 4:
      if (isMobile) {
        height = 17;
        width = 9;
        numOfMimes = 40;
      } else {
        height = 18;
        width = 42;
        numOfMimes = 190;
      }
      break;
    default:
      height = 9;
      width = 9;
      numOfMimes = 10;
      break;
  }

  return [height, width, numOfMimes];
}

export default MimesWeep;
