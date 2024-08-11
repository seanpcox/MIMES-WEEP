import './mimesWeep.css';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import GameBoard from './gameBoard.js'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FinishedMessage from './finishedMessage.js';
import Toolbar from '@mui/material/Toolbar';
import FlagBadge from './flagBadge.js'
import { isMobile, isTablet, isIPad13 } from 'react-device-detect';
import CustomDialog from './customDialog.js';
import * as logic from './gameLogic.js';
import Divider from '@mui/material/Divider';
import HelpDialog from './helpDialog.js';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import * as gameText from './resources/text/gameText';
import Tooltip from '@mui/material/Tooltip';

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
            {gameText.title}
          </p>
        </header>
      </div>
      <Box height={10} />
      <Toolbar sx={{ justifyContent: "center", padding: 0, margin: 0 }}>
        <Tooltip title={gameText.tooltipNew}>
          <Button
            variant="outlined"
            onClick={handleRestart}
            style={{
              maxHeight: 42, minHeight: 42, width: 38, maxWidth: 38, color: '#282c34',
              borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16, fontFamily: 'Arial'
            }}>
            {gameText.newButtonText}
          </Button>
        </Tooltip>
        <Box width={7} />
        <Tooltip title={gameText.tooltipDifficulty}>
          <FormControl>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              style={{
                maxHeight: 42, minHeight: 42, width: 110, maxWidth: 110, color: '#282c34', borderColor: '#c4c4c4',
                fontSize: 16, fontFamily: 'Arial'
              }}
            >
              <MenuItem
                value={1}
                style={{ fontSize: 16, fontFamily: 'Arial' }}
              >
                {gameText.difficultyEasy}
              </MenuItem>
              <MenuItem
                value={2}
                style={{ fontSize: 16, fontFamily: 'Arial' }}
              >
                {gameText.difficultyMedium}
              </MenuItem>
              <MenuItem
                value={3}
                style={{ fontSize: 16, fontFamily: 'Arial' }}
              >
                {gameText.difficultyHard}
              </MenuItem>
              <Divider />
              <MenuItem
                value={4}>
                <Button
                  style={{
                    color: '#282c34', borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16, fontFamily: 'Arial'
                  }}
                  sx={{ justifyContent: "left", width: '100%', minHeight: 0, padding: 0 }}
                  onClick={openCustomDialogCallback}
                >
                  {gameText.difficultyCustom}
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
        <Box width={7} />
        <FlagBadge
          numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          guessButtonToggledCallback={guessButtonToggledCallback}
          setButtonToggleCallback={setButtonToggleCallback} />
        <Box width={7} />
        <Tooltip title={gameText.tooltipHelp}>
          <Button
            variant="outlined"
            onClick={openHelpDialogCallback}
            style={{
              maxHeight: 42, minHeight: 42, width: 38, maxWidth: 38, color: '#282c34',
              borderColor: '#c4c4c4', textTransform: 'none', fontSize: 16
            }}>
            <HelpTwoTone />
          </Button>
        </Tooltip>
      </Toolbar>
      <Box height={10} />
      <GameBoard
        height={height}
        width={width}
        numOfMimes={numOfMimes}
        displayLoseMessageCallback={displayLoseMessageCallback}
        displayWinMessageCallback={displayWinMessageCallback}
        incrementGuessCountCallback={incrementGuessCountCallback}
        guessButtonToggledCallback={guessButtonToggledCallback}
      />
      <FinishedMessage
        displayLoseMessageCallback={displayLoseMessageCallback}
        displayWinMessageCallback={displayWinMessageCallback} />
      <CustomDialog
        openCustomDialogCallback={openCustomDialogCallback}
        startCustomGameCallback={startCustomGameCallback}
      />
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
