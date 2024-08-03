import { Button } from '@mui/material';
import PropTypes from 'prop-types';

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnClickedCallback: PropTypes.func
}

function BoardSquare(props) {
    const setButtonState = () => {
        props.btnClickedCallback(props.indexI, props.indexJ);
    };

    console.log(props.indexI, props.indexJ);
    console.log(Math.floor(props.numOfMimeNeighbors), props.numOfMimeNeighbors);

    if (Math.floor(props.numOfMimeNeighbors) != props.numOfMimeNeighbors) {
        return <Button onClick={setButtonState}>?</Button>;
    } else {
        return <Button onClick={setButtonState} disabled={true}>{props.numOfMimeNeighbors}</Button>;
    }
}

export default BoardSquare;
