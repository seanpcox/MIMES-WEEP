import './mimesWeep.css';
import { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import mimeIcon from './mimeGreyIcon.png';
import PropTypes from 'prop-types';
import { ToggleButton } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -5,
        top: 10,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

CountBadge.propTypes = {
    numOfMimes: PropTypes.number,
    incrementGuessCountCallback: PropTypes.func
}

function CountBadge(props) {
    const [guessCount, setGuessCount] = useState(0);

    useEffect(() => {
        props.incrementGuessCountCallback([guessCount, setGuessCount]);
    }, [props.incrementGuessCountCallback, guessCount]);

    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
            value="check"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
            }}
            style={{ maxHeight: 42, minHeight: 42, minWidth: 84, color: '#282c34', borderColor: 'lightGrey' }}
        >
            <StyledBadge badgeContent={props.numOfMimes - guessCount} color="warning">
                <img src={mimeIcon} width="38px" height="38px" alt="Grey Mime" />
            </StyledBadge>
        </ToggleButton>
    );
}

export default CountBadge;
