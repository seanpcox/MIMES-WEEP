import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText';
import * as settings from '../logic/gameSettings.js';
import * as sx from '../style/flagBadgeSx.js';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { Device } from "../models/index.js";
import { ToggleButton } from '@mui/material';
import { useState, useEffect } from 'react';

/**
 * Component that is both a toggle button, allowing users to place flags using primary action (left-click or tap),
 * and a badge count, initially showing the total number of board mimes and then tracks the number of flags placed
 */

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

    // Effect to incremement (or decrement if a negative value) the number of flags placed on the board
    useEffect(() => {
        props.incrementGuessCountCallback([guessCount, setGuessCount]);
    }, [props.incrementGuessCountCallback, guessCount]);

    // Effect to mark the toggle button selected or unselected
    useEffect(() => {
        props.setButtonToggleCallback([selected, setSelected]);
    }, [props.setButtonToggleCallback, selected]);


    // INTERNAL FUNCTIONS

    /**
     * Function to toggle the Flag button on and off 
     */
    function onToggleAction() {

        // Set the selected state, which will refresh the component
        setSelected(!selected);

        // Callback to inform other componets flag button's toggled state
        props.guessButtonToggledCallback(selected);
    }


    // RENDER

    return (
        <Tooltip
            title={gameText.tooltipFlagToogle +
                ((settings.deviceType !== Device.DESKTOP) ? gameText.controlsTapLC : gameText.controlsLClickLC)}
            placement={commonSx.tooltipPlacement}
            arrow={commonSx.tooltipArrow}
        >
            <ToggleButton
                value="check"
                selected={selected}
                onChange={onToggleAction}
                sx={
                    // Set the look based on whether their will be a badge count or not
                    // Badge disappears if the count is zero
                    (props.numOfMimes - guessCount === 0) ?
                        sx.flagBtnNoBadge :
                        sx.flagBtnBadge
                }
            >
                <sx.StyledBadge
                    color={sx.badgeColor}
                    // Set the badge count
                    badgeContent={props.numOfMimes - guessCount}
                    // Set the maximum count we will show before adding a "+"
                    max={999}
                    // Set the color of the component based on selected state
                    sx={{
                        color: (selected) ? sx.selectedColor : sx.unselectedColor,
                        margin: sx.iconMargin
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
