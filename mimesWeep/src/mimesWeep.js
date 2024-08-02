import './mimesWeep.css';
import Board from './board.js'
import BoardSquare from './boardSquare.js'
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
      {getSquares(9, 9, 10)}
    </div>
  );
}

function getSquares(height, width, numOfMimes) {
  var board = Board(height, width, numOfMimes);

  return <div className='mimesWeep-ops-buttons'>
    {Array.from(Array(height)).map((_, indexI) => (
      <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} key={indexI}>
        {Array.from(Array(width)).map((_, indexJ) => (
          <Grid item xs={1} sm={1} md={1} key={indexJ}>
            <BoardSquare height={height} width={width} mimeNeighborCount={board[indexI][indexJ]} />
          </Grid>
        ))}
      </Grid>
    ))}
  </div>;
}

export default MimesWeep;
