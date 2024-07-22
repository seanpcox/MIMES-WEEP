import logo from './logo.svg';
import './Wordy.css';

function Wordy() {
  return (
    <div className="Wordy">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/Wordy.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          W O R D Y
        </a>
      </header>
    </div>
  );
}

export default Wordy;
