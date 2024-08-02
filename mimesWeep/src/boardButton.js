import { Button } from '@mui/material';
import { useState } from 'react';

function BoardButton () {
    const [btnIsBlue, setBtnIsBlue] = useState(false)

    const setButtonState = () => {
        setBtnIsBlue(!btnIsBlue);
    };

    return <Button variant="contained" style={{ color: (btnIsBlue) ? "blue" :"red" }} onClick={setButtonState}>?</Button>;
}

export default BoardButton;
