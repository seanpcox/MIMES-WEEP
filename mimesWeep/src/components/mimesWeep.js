import '../style/mimesWeep.css';
import * as commonSx from '../style/common.js';
import * as gameText from '../resources/text/gameText.js';
import * as logic from '../logic/gameLogic.js';
import * as settings from '../logic/gameSettings.js';
import * as sx from '../style/mimesweepSx.js';
import CustomDialog from './dialogs/customDialog.js';
import Divider from '@mui/material/Divider';
import FinishedMessage from './dialogs/finishedMessage.js';
import FlagBadge from './flagBadge.js'
import FormControl from '@mui/material/FormControl';
import GameBoard from './gameBoard.js'
import HelpDialog from './dialogs/helpDialog.js';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

function MimesWeep() {

  // STATES

  const [numOfGamesPlayed, setNumOfGamesPlayed] = useState(1);

  const [difficulty, setDifficulty] = useState(1);

  const [customHeight, setCustomHeight] = useState(9);
  const [customWidth, setCustomWidth] = useState(9);
  const [customNumOfMimes, setCustomNumOfMimes] = useState(9);
  const [isCustomGame, setCustomGame] = useState(false);

  // LOCAL VARIABLES

  var guessCount = 0;

  // CALLBACK METHODS

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

  // LOCAL METHODS

  function handleRestart() {
    setNumOfGamesPlayed(numOfGamesPlayed + 1);
    resetGameChildComponentStates();
  };

  function handleDifficultyChange(event) {
    if (event.target.value === 4) {
      return;
    }

    setCustomGame(false);
    resetGameSettings(event.target.value);
  };

  function startCustomGameCallback(height, width, mimeCount) {
    // Add check that numOfMimes is less than the number of board squares
    mimeCount = logic.sanitizeMimeCount(height, width, mimeCount);

    setCustomGame(true);
    setCustomHeight(height);
    setCustomWidth(width);
    setCustomNumOfMimes(mimeCount);
    resetGameSettings(4);
  }

  function resetGameSettings(value) {
    setDifficulty(value);
    resetGameChildComponentStates();
  }

  function resetGameChildComponentStates() {
    setGuessCountChildFunction(0);
    setGuessButtonToggledChildFunction(false);
    setButtonToggleChildFunction(false);
  }

  // LOGIC

  var gameSettings;

  if (isCustomGame) {
    gameSettings = [customHeight, customWidth, customNumOfMimes];
  } else {
    gameSettings = settings.getGameSettings(difficulty);
  }

  var height = gameSettings[0];
  var width = gameSettings[1];
  var numOfMimes = gameSettings[2];

  // COMPONENT

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
      <Box sx={sx.spacingHeight} />
      <Toolbar sx={sx.toolbar}>
        <Tooltip
          title={gameText.tooltipNew}
          placement="top"
          arrow
        >
          <Button
            variant="outlined"
            onClick={handleRestart}
            sx={sx.btnSmall}
          >
            {gameText.newButtonText}
          </Button>
        </Tooltip>
        <Box width={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipDifficulty}
          placement="top"
          arrow
        >
          <FormControl>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              sx={sx.difficultySelect}
            >
              <MenuItem
                value={1}
                sx={commonSx.font}
              >
                {gameText.difficultyEasy}
              </MenuItem>
              <MenuItem
                value={2}
                sx={commonSx.font}
              >
                {gameText.difficultyMedium}
              </MenuItem>
              <MenuItem
                value={3}
                sx={commonSx.font}
              >
                {gameText.difficultyHard}
              </MenuItem>
              <Divider />
              <MenuItem
                value={4}>
                <Button
                  sx={sx.customBtn}
                  onClick={openCustomDialogCallback}
                >
                  {gameText.difficultyCustom}
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
        <Box sx={sx.btnSpacingWidth} />
        <FlagBadge
          numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          guessButtonToggledCallback={guessButtonToggledCallback}
          setButtonToggleCallback={setButtonToggleCallback} />
        <Box sx={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipHelp}
          placement="top"
          arrow
        >
          <Button
            variant="outlined"
            onClick={openHelpDialogCallback}
            sx={sx.btnSmall}>
            <HelpTwoTone />
          </Button>
        </Tooltip>
      </Toolbar>
      <Box sx={sx.spacingHeight} />
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

export default MimesWeep;
