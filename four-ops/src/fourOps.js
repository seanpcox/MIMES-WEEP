import './fourOps.css';
import Button from '@mui/material/Button';

function FourOps() {
  return (
    <div className="fourOps">
      <div>
        <header className="fourOps-header">
          <p>
            F O U R - O P S
          </p>
        </header>
      </div>
      <div className='fourOps-ops-buttons'>
        <Button variant="contained" className='fourOps-ops-buttons'>+</Button>
        <Button variant="contained" className='fourOps-ops-buttons'>-</Button>
        <Button variant="contained" className='fourOps-ops-buttons'>*</Button>
        <Button variant="contained" className='fourOps-ops-buttons'>/</Button>
      </div>
    </div>
  );
}

export default FourOps;
