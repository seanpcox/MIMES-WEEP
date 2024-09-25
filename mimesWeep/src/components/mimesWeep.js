import '../style/mimesWeep.css';
import * as commonSx from '../style/commonSx.js';
import * as highScoreDB from '../logic/highScoreDB.js';
import * as gameText from '../resources/text/gameText.js';
import * as logic from '../logic/gameLogic.js';
import * as gameSettings from '../logic/gameSettings.js';
import * as sx from '../style/mimesweepSx.js';
import * as userSettings from '../logic/userSettings.js';
import CustomDialog from './dialogs/customDialog.js';
import Divider from '@mui/material/Divider';
import FinishedMessage from './dialogs/finishedMessage.js';
import FlagBadge from './flagBadge.js';
import FormControl from '@mui/material/FormControl';
import GameBoard from './gameBoard.js'
import HelpDialog from './dialogs/helpDialog.js';
import HighScoreDialog from './dialogs/highScoreDialog.js';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SettingsDialog from './dialogs/settingsDialog.js';
import Timer from './timer.js';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

/**
 * Component at the root of the game. Contains the header, toolbar, and game board.
 */

function MimesWeep() {

  // STATES

  const [numOfGamesPlayed, setNumOfGamesPlayed] = useState(1);

  const [difficulty, setDifficulty] = useState(1);

  const [customHeight, setCustomHeight] = useState(9);

  const [customWidth, setCustomWidth] = useState(9);

  const [customNumOfMimes, setCustomNumOfMimes] = useState(9);

  const [isCustomGame, setCustomGame] = useState(false);


  // REFS

  const timerRef = useRef(null);

  const highScoreDataRef = useRef([]);

  const personalBestPeriodsRef = useRef([]);

  const boardRef = useRef(null);

  const guessCountRef = useRef(0);

  const hintCountRef = useRef(0);


  // EFFECTS

  // Effect to call on component load to display the welcome/help screen on first visit
  useEffect(() => {

    // Retrieve the local property telling us if the user has ever visited this app on this browser
    let isFirstVisit = userSettings.isFirstVisit();

    // If they have never visited we display the welcome/help screen to instruct them on the game
    if (isFirstVisit) {
      // Open the help dialog
      openHelpDialog(true);
    }
  }, []);


  // CALLBACK METHODS

  /**
   * Function called when the user reveals the first square in a game
   */
  function firstSquareRevealvedCallback() {
    timerRef.current.startTimer();
  }

  /**
   * Add a new highscore data object (DB ID, period, and username), which we use in our new highscore dialog
   * @param {object} highScoreData
   */
  function setNewHighScoreDataCallback(highScoreData) {

    // Add the data to our high score ids array
    if (highScoreData !== null) {
      highScoreDataRef.current.push(highScoreData);
    }
    // If id is not defined, it means we want to clear our array
    else {
      highScoreDataRef.current = [];
    }
  }

  /**
  * Set whether the we have personal best periods for display in our new highscore dialog
  * @param {Period} period
  */
  function setPersonalBestPeriodsCallback(period) {

    // Set the supplied period if valid
    if (period !== null) {
      personalBestPeriodsRef.current.push(period);
    }
    // If period is not defined, it means we want to clear our array
    else {
      personalBestPeriodsRef.current = [];
    }
  }

  /**
   * Function to clear all high score and personal best ref arrays
   */
  function resetScoreRefsCallback() {
    highScoreDataRef.current = [];
    personalBestPeriodsRef.current = [];
  }

  /**
  * Set whether the hint button was selected so we can tell the game board to give a hint
  * @param {boolean} isHighlighted
  */
  function setHintButtonSelectedCallback() {

    // Call the board to execute a hint, this places a hint flag for the user on a mime
    if (boardRef.current.giveHint()) {
      // If a hint was given increase our hint count
      hintCountRef.current += 1;
    }
  }

  /**
   * Callback function when a custom game is started 
   * @param {Rows in the custom game} height 
   * @param {Columns in the custom game} width 
   * @param {Mimes in the custom game} mimeCount 
   */
  function startCustomGameCallback(height, width, mimeCount) {

    // Add check that numOfMimes not greater than number of board squares, 
    // if not it is set to number of board squares
    mimeCount = logic.sanitizeMimeCount(height, width, mimeCount);

    // Set all the states to represent the custom game, if New game selected these will be reused
    setCustomGame(true);
    setCustomHeight(height);
    setCustomWidth(width);
    setCustomNumOfMimes(mimeCount);
    resetGameSettings(4);
  }

  let showFinishMessage;

  /**
   * Function to display the won game message to the user
   * @param {Either the child function or a command to display the won game message} setStateCallback 
   */
  const displayFinishMessageCallback = (setStateCallback) => {

    // If not a number we are getting the child callback function we need, store it
    if (isNaN(setStateCallback)) {
      showFinishMessage = setStateCallback[1];
    }

    // Else display the won game message to the user
    else {
      // Stop the game timer
      timerRef.current.stopTimer();

      // If we performed any hints we are not eligble for a high score or personal
      // best record. And we display a different win message to the user.
      if (setStateCallback === 1 && hintCountRef.current > 0) {
        setStateCallback = 2;
      }

      // Show the finish message
      showFinishMessage(setStateCallback);

      // If we won the game without hints then persist the user's score if high score or personal best
      if (setStateCallback === 1) {
        persistScore();
      }
    }
  };

  let openCustomDialog;

  /**
   * Function to display the custom game dialog to the user
   * @param {Either the child function or a command to display the custom game dialog} callbackParams 
   */
  const openCustomDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openCustomDialog = callbackParams[1];
    }

    // Else display the custom game dialog to the user
    else {
      openCustomDialog(true);
    }
  };

  let openHelpDialog;

  /**
   * Function to display the help dialog to the user
   * @param {Either the child function or a command to display the help dialog} callbackParams 
   */
  const openHelpDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openHelpDialog = callbackParams[1];
    }

    // Else display the help dialog to the user
    else {
      openHelpDialog(true);
    }
  };

  let openHighScoreDialog;

  /**
   * Function to display the high score dialog to the user
   * @param {Either the child function or a command to display the help dialog} callbackParams 
   */
  const openHighScoreDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openHighScoreDialog = callbackParams[1];
    }

    // Else display the help dialog to the user
    else {
      openHighScoreDialog(true);
    }
  };

  let openSettingsDialog;

  /**
   * Function to display the settings dialog to the user
   * @param {Either the child function or a command to display the settings dialog} callbackParams 
   */
  const openSettingsDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openSettingsDialog = callbackParams[1];
    }

    // Else display the settings dialog to the user
    else {
      openSettingsDialog(true);
    }
  };


  // LOCAL METHODS

  /**
   * Function to restart the game using the same game parameters (though mime positions will be again randomized)
   */
  function handleRestart() {

    // Update the state, which will refresh the component
    setNumOfGamesPlayed(numOfGamesPlayed + 1);

    // Reset all child game components
    resetGameChildComponentStates();
  };


  /**
   * Function called when the a new value is selected in the difficulty dropdown
   * @param {Drop down selection event object} event 
   */
  function handleDifficultyChange(event) {

    // If custom game is selected (value is 4) do nothing, this is handled elsewhere
    if (event.target.value === 4) {
      return;
    }

    // Set the state, will refresh the component
    setCustomGame(false);

    // Restart and refresh the game to the new difficulty
    resetGameSettings(event.target.value);
  };

  /**
   * Function to change the difficulty and start a new game
   * @param {Difficulty value} value 
   */
  function resetGameSettings(value) {

    // Set the difficult state
    setDifficulty(value);

    // Reset new high score and personal best data, used with high score dialog
    resetScoreRefsCallback();

    // Reset all child game components
    resetGameChildComponentStates();
  }

  /**
   * Function to reset all states in the game
   */
  function resetGameChildComponentStates() {

    // Reset the timer component
    timerRef.current.resetTimer();

    // Reset the guess count component
    setGuessCountChildFunction(0);

    // Update our guess count ref
    guessCountRef.current = 0;

    // Update our hint count ref
    hintCountRef.current = 0;
  }

  /**
  * Function to persist the user's score in the data store
  */
  function persistScore() {

    // Persist the high score and personal best data if applicable, unless we are playing a custom board
    if (difficulty !== 4) {

      // Create the score data, use the last high score or personal best username if available
      const scoreData = {
        level: gameSettings.getLevelString(difficulty),
        deviceType: gameSettings.deviceType,
        time: timerRef.current.getTimeElapsedTimer(),
        user: userSettings.getBestGuessUsername(),
        date: Math.round(Date.now() / 1000)
      };

      // Save to the database if a high score
      highScoreDB.saveScores(scoreData, openHighScoreDialog, setNewHighScoreDataCallback, setPersonalBestPeriodsCallback);
    }
  }

  let setGuessCountChildFunction;

  /**
   * Callback function executed when a flag guess is placed or removed from the board
   * @param {Either the child function or the amount to change the current flag guess count} callbackParams 
   */
  const incrementGuessCountCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      setGuessCountChildFunction = callbackParams[1];
    }

    // Else we already have the child callback function and a flag guess was placed or removed
    else {
      // Increment or decrement (if a negative number) our number of flag guesses on the board
      guessCountRef.current += callbackParams;

      // Call the recived child function with the updated count
      setGuessCountChildFunction(guessCountRef.current);
    }
  };

  // LOGIC

  // Get the game parameters from the set difficulty level, or from user input custom parameters

  let gameParameters;

  if (isCustomGame) {
    gameParameters = [customHeight, customWidth, customNumOfMimes];
  } else {
    gameParameters = gameSettings.getGameSettings(difficulty);
  }

  let height = gameParameters[0];
  let width = gameParameters[1];
  let numOfMimes = gameParameters[2];


  // COMPONENT

  return (
    <Box className="mimesWeep" onContextMenu={(e) => {
      // Prevent any default behaviour when any component in this App is right clicked
      e.preventDefault();
    }}>
      <Box className="mimesWeep-header">
        {sx.logoImg}
      </Box>
      <Box sx={sx.spacingHeight} />
      <Toolbar sx={sx.toolbar}>
        <Tooltip
          title={gameText.tooltipNew}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <commonSx.StyledButton
            variant={commonSx.btnVariant}
            onClick={handleRestart}
            sx={sx.btnSquare}
          >
            {commonSx.newGameIcon}
          </commonSx.StyledButton>
        </Tooltip>
        <Box width={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipDifficulty}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
          slotProps={sx.diificultyTooltipOffset}
        >
          <FormControl>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              sx={sx.difficultySelect}
              input={<sx.BootstrapInput />}
            >
              <MenuItem
                value={1}
                sx={commonSx.font}
              >
                <Button sx={sx.customBtn}>
                  {gameSettings.getDifficultyIcon(1)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{gameSettings.getDifficultyString(1)}
                </Button>
              </MenuItem>
              <MenuItem
                value={2}
                sx={commonSx.font}
              >
                <Button sx={sx.customBtn}>
                  {gameSettings.getDifficultyIcon(2)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{gameSettings.getDifficultyString(2)}
                </Button>
              </MenuItem>
              <MenuItem
                value={3}
                sx={commonSx.font}
              >
                <Button sx={sx.customBtn}>
                  {gameSettings.getDifficultyIcon(3)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{gameSettings.getDifficultyString(3)}
                </Button>
              </MenuItem>
              <Divider />
              <MenuItem
                value={4}>
                <Button
                  sx={sx.customBtn}
                  onClick={openCustomDialogCallback}
                >
                  {gameSettings.getDifficultyIcon(4)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{gameSettings.getDifficultyString(4)}
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
        <Box sx={sx.btnSmallSpacingWidth} />
        <Timer
          openHighScoreDialogCallback={openHighScoreDialogCallback}
          resetScoreRefsCallback={resetScoreRefsCallback}
          difficulty={difficulty}
          ref={timerRef}
        />
        <Box sx={sx.btnSpacingWidth} />
        <FlagBadge
          numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          setHintButtonSelectedCallback={setHintButtonSelectedCallback}
        />
        <Box sx={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipSettings}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <commonSx.StyledButton
            variant={commonSx.btnVariant}
            onClick={openSettingsDialogCallback}
            sx={sx.btnSquare}>
            {commonSx.settingsIcon}
          </commonSx.StyledButton>
        </Tooltip>
        <Box sx={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipHelp}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <commonSx.StyledButton
            variant={commonSx.btnVariant}
            onClick={openHelpDialogCallback}
            sx={sx.btnSquare}>
            {commonSx.helpIcon}
          </commonSx.StyledButton>
        </Tooltip>
      </Toolbar>
      <Box sx={sx.spacingHeight} />
      <GameBoard
        height={height}
        width={width}
        numOfMimes={numOfMimes}
        displayFinishMessageCallback={displayFinishMessageCallback}
        incrementGuessCountCallback={incrementGuessCountCallback}
        firstSquareRevealvedCallback={firstSquareRevealvedCallback}
        ref={boardRef}
      />
      <FinishedMessage
        displayFinishMessageCallback={displayFinishMessageCallback}
        difficulty={difficulty}
      />
      <CustomDialog
        openCustomDialogCallback={openCustomDialogCallback}
        startCustomGameCallback={startCustomGameCallback}
      />
      <SettingsDialog openSettingsDialogCallback={openSettingsDialogCallback} />
      <HelpDialog openHelpDialogCallback={openHelpDialogCallback} />
      <HighScoreDialog
        difficulty={difficulty}
        highScoreDataRef={highScoreDataRef}
        personalBestPeriodsRef={personalBestPeriodsRef}
        resetScoreRefsCallback={resetScoreRefsCallback}
        openHighScoreDialogCallback={openHighScoreDialogCallback}
      />
    </Box>
  );
}

// EXPORT

export default MimesWeep;
