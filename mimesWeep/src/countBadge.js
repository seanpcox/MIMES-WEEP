import './mimesWeep.css';
import { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import PropTypes from 'prop-types';
import { ToggleButton } from '@mui/material';
import { grey } from '@mui/material/colors';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -10,
        top: 9,
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
            style={{
                maxHeight: 42, minHeight: 42, width: 64, maxWidth: 64, color: '#282c34', borderColor: '#c4c4c4',
                justifyContent: (props.numOfMimes - guessCount == 0) ? "center" : "left"
            }}
        >
            <StyledBadge badgeContent={props.numOfMimes - guessCount}
                color="warning" sx={{ color: (selected) ? grey[900] : grey[500] }} >
                <TourTwoTone />
            </StyledBadge>
        </ToggleButton>
    );
}

export default CountBadge;
