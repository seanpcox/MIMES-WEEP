import './mimesWeep.css';
import BoardButton from './boardButton.js'
import { Grid } from '@mui/material';

function MimesWeep() {
  return (
    <div className="mimesWeep">
      <div>
        <header className="mimesWeep-header">
          <p>
            M I M E S W E E P
          </p>
        </header>
      </div>
      {getSquares(9,9)}
    </div>
  );
}

function getSquares(x, y) {
  return <div className='mimesWeep-ops-buttons'>
      {Array.from(Array(x)).map((_, indexX) => (
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }}  key={indexX}>
          {Array.from(Array(y)).map((_, indexY) => (
            <Grid item xs={1} sm={1} md={1} key={indexY}>
              <BoardButton />
            </Grid>
          ))}
        </Grid>
      ))}
      </div>;
}

export default MimesWeep;
