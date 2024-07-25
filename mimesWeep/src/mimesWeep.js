import './mimesWeep.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
      <div className='mimesWeep-ops-buttons'>
      {Array.from(Array(9)).map((_, indexJ) => (
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }}>
          {Array.from(Array(9)).map((_, indexX) => (
            <Grid item xs={1} sm={1} md={1} key={indexJ}>
              <Button>{indexJ} + "," + {indexX}</Button>
            </Grid>
          ))}
        </Grid>
      ))}
      </div>
    </div>
  );
}



export default MimesWeep;
