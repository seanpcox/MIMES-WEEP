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
    const setLeftClickState = () => {
        props.btnLeftClickCallback(props.indexI, props.indexJ);
    };

    const setRightClickState = () => {
        props.btnRightClickCallback(props.indexI, props.indexJ);
    };

    if (Math.floor(props.numOfMimeNeighbors) != props.numOfMimeNeighbors) {
        return <Button onClick={setLeftClickState} onContextMenu={setRightClickState}>{props.numOfMimeNeighbors}</Button>;
    } else {
        return <Button onClick={setLeftClickState} onContextMenu={setRightClickState} disabled={true}>{props.numOfMimeNeighbors}</Button>;
    }
}

export default BoardSquare;
