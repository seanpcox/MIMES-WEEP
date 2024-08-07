import './mimesWeep.css';
import { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import mimeGreyIcon from './mimeGreyIcon.png';
import mimeBlackIcon from './mimeBlackIcon.png';
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
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func,
    setButtonToggleCallback: PropTypes.func
}

function CountBadge(props) {
    const [guessCount, setGuessCount] = useState(0);

    useEffect(() => {
        props.incrementGuessCountCallback([guessCount, setGuessCount]);
    }, [props.incrementGuessCountCallback, guessCount]);

    const [selected, setSelected] = useState(false);

    useEffect(() => {
        props.setButtonToggleCallback([selected, setSelected]);
    }, [props.setButtonToggleCallback, selected]);

    function onToggleAction() {
        setSelected(!selected);
        props.guessButtonToggledCallback(selected);
    }

    return (
        <ToggleButton
            value="check"
            selected={selected}
            onChange={onToggleAction}
            style={{ maxHeight: 42, minHeight: 42, width: 84, maxWidth: 84, color: '#282c34', borderColor: 'lightGrey' }}
        >
            <StyledBadge badgeContent={props.numOfMimes - guessCount} color="warning">
                <img src={(selected) ? mimeBlackIcon : mimeGreyIcon} width="38px" height="38px" alt="Grey Mime" />
            </StyledBadge>
        </ToggleButton>
    );
}

export default CountBadge;
