import { Button } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

BoardSquare.propTypes = {
    mimeNeighborCount: PropTypes.number
}

function BoardSquare(props) {
    const [btnIsClicked, setBtnIsClicked] = useState(false);
    const [buttonText, setButtonText] = useState("?");

    const setButtonState = () => {
        setBtnIsClicked(!btnIsClicked);
        setButtonText(props.mimeNeighborCount)

        if (props.mimeNeighborCount == -1) {
            alert("Sorry, you have lost");
        }
    };

    return <Button onClick={setButtonState} disabled={btnIsClicked}>{buttonText}</Button>;
}

export default BoardSquare;
