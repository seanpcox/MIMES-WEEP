import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText';
import * as sx from '../style/flagBadgeSx.js';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
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
            placement={commonSx.tooltipPlacement}
            arrow={commonSx.tooltipArrow}
        >
            <ToggleButton
                value="check"
                selected={selected}
                onChange={onToggleAction}
                sx={
                    (props.numOfMimes - guessCount === 0) ?
                        sx.flagBtnNoBadge :
                        sx.flagBtnBadge
                }
            >
                <sx.StyledBadge
                    badgeContent={props.numOfMimes - guessCount}
                    color={sx.badgeColor}
                    sx={{
                        color: (selected) ? sx.selectedColor : sx.unselectedColor
                    }}
                >
                    <commonSx.flagIcon />
                </sx.StyledBadge>
            </ToggleButton>
        </Tooltip>
    );
}

// EXPORT

export default FlagBadge;
