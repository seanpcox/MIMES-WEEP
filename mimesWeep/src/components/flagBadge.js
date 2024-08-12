import * as gameText from '../resources/text/gameText';
import Badge from '@mui/material/Badge';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import { grey } from '@mui/material/colors';
import { isMobile } from 'react-device-detect';
import { styled } from '@mui/material/styles';
import { ToggleButton } from '@mui/material';
import { useState, useEffect } from 'react';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -10,
        top: 9,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

FlagBadge.propTypes = {
    numOfMimes: PropTypes.number,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func,
    setButtonToggleCallback: PropTypes.func
}

function FlagBadge(props) {
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
        <Tooltip title={gameText.tooltipFlagToogle + ((isMobile) ? gameText.controlsTapLC : gameText.controlsLClickLC)}
            placement="top" arrow
        >
            <ToggleButton
                value="check"
                selected={selected}
                onChange={onToggleAction}
                style={{
                    maxHeight: 42, minHeight: 42, width: 64, maxWidth: 64,
                    color: '#282c34', borderColor: '#c4c4c4',
                    justifyContent: (props.numOfMimes - guessCount === 0) ? "center" : "left"
                }}
            >
                <StyledBadge
                    badgeContent={props.numOfMimes - guessCount}
                    color="warning"
                    sx={{ color: (selected) ? grey[900] : grey[500] }}
                >
                    <TourTwoTone />
                </StyledBadge>
            </ToggleButton>
        </Tooltip>
    );
}

export default FlagBadge;
