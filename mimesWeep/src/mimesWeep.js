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

function MimesWeep() {
  const [difficulty, setDifficulty] = useState(1);

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  };

  var height, width, numOfMimes;

  switch (difficulty) {
    case 2:
      height = 13;
      width = 9;
      numOfMimes = 18;
      break;
    case 3:
      height = 17;
      width = 9;
      numOfMimes = 30;
      break;
    case 4:
      height = 17;
      width = 9;
      numOfMimes = 40;
      break;
    default:
      height = 9;
      width = 9;
      numOfMimes = 10;
      break;
  }

  const [numOfGamesPlayed, setNumOfGamesPlayed] = useState(1);

  function handleRestart() {
    setNumOfGamesPlayed(numOfGamesPlayed + 1);
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
            maxHeight: 40, minHeight: 40, minWidth: 120, color: '#282c34', borderColor: 'lightGrey', textTransform: 'none', fontSize: 16
          }}>
          New Game</Button>
        <Box width={20} />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
            style={{ maxHeight: 40, minHeight: 40, minWidth: 120, color: '#282c34', borderColor: 'lightGrey' }}
          >
            <MenuItem value={1}>Easy</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Hard</MenuItem>
            <MenuItem value={4}>Hardest</MenuItem>
          </Select>
        </FormControl>
        <Box width={15} />
        <CountBadge mimeBadgeCount={numOfMimes} />
      </Toolbar>
      <Box height={10} />
      <GameBoard height={height} width={width} numOfMimes={numOfMimes}
        displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
      <FinishedMessage displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
    </div>
  );
}

export default MimesWeep;
