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
import { isMobile, isTablet, isIPad13 } from 'react-device-detect';
import CustomDialog from './customDialog.js';
import * as logic from './gameLogic.js';
import Divider from '@mui/material/Divider';
import HelpDialog from './helpDialog.js';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';

function MimesWeep() {
  const [difficulty, setDifficulty] = useState(1);

  const [customHeight, setCustomHeight] = useState(9);
  const [customWidth, setCustomWidth] = useState(9);
  const [customNumOfMimes, setCustomNumOfMimes] = useState(9);
  const [isCustomGame, setCustomGame] = useState(false);

  function handleDifficultyChange(event) {
    if (event.target.value === 4) {
      return;
    }

    setCustomGame(false);
    resetGameSettings(event.target.value);
  };

  function startCustomGameCallback(height, width, numOfMimes) {
    // Add check that numOfMimes is less than the number of board squares
    numOfMimes = logic.sanitizeMimeCount(height, width, numOfMimes);

    setCustomGame(true);
    setCustomHeight(height);
    setCustomWidth(width);
    setCustomNumOfMimes(numOfMimes);
    resetGameSettings(4);
  }

  function resetGameSettings(value) {
    setDifficulty(value);
    resetGameChildComponentStates();
  }

  var gameSettings;

  if (isCustomGame) {
    gameSettings = [customHeight, customWidth, customNumOfMimes];
  } else {
    gameSettings = getGameSettings(difficulty);
  }

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

  var openCustomDialog;

  const openCustomDialogCallback = (callbackParams) => {
    if (Array.isArray(callbackParams)) {
      openCustomDialog = callbackParams[1];
    } else {
      openCustomDialog(true);
    }
  };

  var openHelpDialog;

  const openHelpDialogCallback = (callbackParams) => {
    if (Array.isArray(callbackParams)) {
      openHelpDialog = callbackParams[1];
    } else {
      openHelpDialog(true);
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
            maxHeight: 42, minHeight: 42, width: 38, maxWidth: 38, color: '#282c34', borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16
          }}>
          New</Button>
        <Box width={7} />
        <FormControl>
          <InputLabel id="demo-simple-select-label" >Difficulty</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
            style={{ maxHeight: 42, minHeight: 42, width: 110, maxWidth: 110, color: '#282c34', borderColor: '#c4c4c4' }}
          >
            <MenuItem value={1}>Easy</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Hard</MenuItem>
            <Divider />
            <MenuItem value={4}>
              <Button
                style={{
                  color: '#282c34', borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16
                }}
                sx={{ justifyContent: "left", width: '100%', minHeight: 0, padding: 0 }}
                onClick={openCustomDialogCallback}>
                Custom
              </Button>
            </MenuItem>
          </Select>
        </FormControl>
        <Box width={7} />
        <CountBadge numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          guessButtonToggledCallback={guessButtonToggledCallback}
          setButtonToggleCallback={setButtonToggleCallback} />
        <Box width={7} />
        <Button variant="outlined" onClick={openHelpDialogCallback}
          style={{
            maxHeight: 42, minHeight: 42, width: 38, maxWidth: 38, color: '#282c34', borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16
          }}>
          <HelpTwoTone />
        </Button>
      </Toolbar>
      <Box height={10} />
      <GameBoard height={height} width={width} numOfMimes={numOfMimes}
        displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback}
        incrementGuessCountCallback={incrementGuessCountCallback} guessButtonToggledCallback={guessButtonToggledCallback} />
      <FinishedMessage displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
      <CustomDialog openCustomDialogCallback={openCustomDialogCallback} startCustomGameCallback={startCustomGameCallback} />
      <HelpDialog openHelpDialogCallback={openHelpDialogCallback} />
    </div>
  );
}

function getGameSettings(difficulty) {
  var height, width, numOfMimes;

  switch (difficulty) {
    case 2:
      // ~16% Mime Density
      if (isMobile && !(isTablet || isIPad13)) {
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
      // ~20% Mime Density
      if (isTablet || isIPad13) {
        height = 20;
        width = 20;
        numOfMimes = 80;
      } else if (isMobile) {
        height = 14;
        width = 9;
        numOfMimes = 25;
      } else {
        height = 16;
        width = 30;
        numOfMimes = 99;
      }
      break;
    default:
      // ~12% Mime Density
      height = 9;
      width = 9;
      numOfMimes = 10;
      break;
  }

  return [height, width, numOfMimes];
}

export default MimesWeep;
