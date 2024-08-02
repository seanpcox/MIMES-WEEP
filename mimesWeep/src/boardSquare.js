import { Button } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

BoardSquare.propTypes = {
    mimeNeighborCount: PropTypes.number
}

function BoardSquare(props) {
    const [btnIsClicked, setBtnIsClicked] = useState(false);

    const setButtonState = () => {
        setBtnIsClicked(!btnIsClicked);

        console.log(props.mimeNeighborCount);

        if (props.mimeNeighborCount == -1) {
            console.log("here");
            alert("Sorry, you have lost");
        }
    };

    return <Button onClick={setButtonState} disabled={btnIsClicked}>?</Button>;
}

export default BoardSquare;
