import * as gameText from '../resources/text/gameText';
import * as sx from '../style/flagBadgeSx.js';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import { isMobile } from 'react-device-detect';
import { ToggleButton } from '@mui/material';
import { useState, useEffect } from 'react';

// PROP LIST

FlagBadge.propTypes = {
    numOfMimes: PropTypes.number,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func,
    setButtonToggleCallback: PropTypes.func
}

// COMPONENT

function FlagBadge(props) {

    // STATES

    const [guessCount, setGuessCount] = useState(0);

    const [selected, setSelected] = useState(false);

    // EFFECTS

    useEffect(() => {
        props.incrementGuessCountCallback([guessCount, setGuessCount]);
    }, [props.incrementGuessCountCallback, guessCount]);

    useEffect(() => {
        props.setButtonToggleCallback([selected, setSelected]);
    }, [props.setButtonToggleCallback, selected]);

    // INTERNAL FUNCTIONS

    function onToggleAction() {
        setSelected(!selected);
        props.guessButtonToggledCallback(selected);
    }

    // RENDER

    return (
        <Tooltip
            title={gameText.tooltipFlagToogle + ((isMobile) ? gameText.controlsTapLC : gameText.controlsLClickLC)}
            placement="top"
            arrow
        >
            <ToggleButton
                value="check"
                selected={selected}
                onChange={onToggleAction}
                sx={{
                    justifyContent: (props.numOfMimes - guessCount === 0) ? "center" : "left",
                    ...sx.flagBtn
                }}
            >
                <sx.StyledBadge
                    badgeContent={props.numOfMimes - guessCount}
                    color="warning"
                    sx={{
                        color: (selected) ? sx.selected : sx.unselected
                    }}
                >
                    <TourTwoTone />
                </sx.StyledBadge>
            </ToggleButton>
        </Tooltip>
    );
}

// EXPORT

export default FlagBadge;
