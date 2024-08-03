import { Button } from '@mui/material';
import PropTypes from 'prop-types';

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnLeftClickCallback: PropTypes.func,
    btnRightClickCallback: PropTypes.func
}

function BoardSquare(props) {
    var btnSize = '40px';

    const setLeftClickState = () => {
        props.btnLeftClickCallback(props.indexI, props.indexJ);
    };

    const setRightClickState = () => {
        props.btnRightClickCallback(props.indexI, props.indexJ);
    };

    if (props.numOfMimeNeighbors >= 9) {
        return <Button variant="contained" onClick={setLeftClickState} onContextMenu={setRightClickState}
            style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }} color="error"></Button>;
    } else if (Math.floor(props.numOfMimeNeighbors) != props.numOfMimeNeighbors) {
        return <Button variant="contained" onClick={setLeftClickState} onContextMenu={setRightClickState}
            style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}></Button>;
    } else {
        return <Button variant="outlined" onClick={setLeftClickState} onContextMenu={setRightClickState} disabled={true} color="success"
            style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}>{props.numOfMimeNeighbors}</Button>;
    }
}

export default BoardSquare;
