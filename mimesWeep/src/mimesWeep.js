import './mimesWeep.css';
import { useState } from 'react';
import { Box } from '@mui/material';
import GameBoard from './gameBoard.js'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FinishedMessage from './finishedMessage.js';

function MimesWeep() {
  const [difficulty, setDifficulty] = useState(1);

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
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
      <Box height={20} />
      <FormControl>
        <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={difficulty}
          label="Difficulty"
          onChange={handleDifficultyChange}
        >
          <MenuItem value={1}>Easy</MenuItem>
          <MenuItem value={2}>Medium</MenuItem>
          <MenuItem value={3}>Hard</MenuItem>
        </Select>
      </FormControl>
      <Box height={20} />
      <GameBoard difficulty={difficulty} displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
      <FinishedMessage displayLoseMessageCallback={displayLoseMessageCallback} displayWinMessageCallback={displayWinMessageCallback} />
    </div>
  );
}

export default MimesWeep;
