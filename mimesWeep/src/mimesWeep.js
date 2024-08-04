import './mimesWeep.css';
import { useState } from 'react';
import { Box } from '@mui/material';
import Game from './game.js'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function MimesWeep() {
  const [difficulty, setDifficulty] = useState(1);

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
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
      <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
          >
            <MenuItem value={1}>Easy: 10 Mimes</MenuItem>
            <MenuItem value={2}>Medium: 40 Mimes</MenuItem>
            <MenuItem value={3}>Hard: 99 Mimes</MenuItem>
          </Select>
        </FormControl>
        <Box height={20} />
      <Game difficulty={difficulty} />
    </div>
  );
}

export default MimesWeep;
