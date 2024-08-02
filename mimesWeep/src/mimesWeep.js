import './mimesWeep.css';
import Board from './board.js'

function MimesWeep() {
  var height = 9;
  var width = 9;
  var numOfMimes = 10;

  return (
    <div className="mimesWeep">
      <div>
        <header className="mimesWeep-header">
          <p>
            M I M E S W E E P
          </p>
        </header>
      </div>
      <Board height={height} width={width} numOfMimes={numOfMimes} />
    </div>
  );
}

export default MimesWeep;
