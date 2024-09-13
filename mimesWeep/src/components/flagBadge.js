import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText';
import * as sx from '../style/flagBadgeSx.js';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';

/**
 * Component that is both a toggle button, allowing users to turn on/off the use of flags,
 * and a badge count, initially showing the total number of board mimes and then tracks the number of flags placed
 */

// PROP LIST

FlagBadge.propTypes = {
    numOfMimes: PropTypes.number,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func
}

// COMPONENT

function FlagBadge(props) {

    // STATES

    const [guessCount, setGuessCount] = useState(0);

    const [selected, setSelected] = useState(true);


    // EFFECTS

    // Effect to incremement (or decrement if a negative value) the number of flags placed on the board
    useEffect(() => {
        props.incrementGuessCountCallback([guessCount, setGuessCount]);
    }, [props.incrementGuessCountCallback, guessCount]);


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
            title={(selected) ? gameText.tooltipFlagToogleDs : gameText.tooltipFlagToogleEn}
            placement={commonSx.tooltipPlacement}
            arrow={commonSx.tooltipArrow}
        >
            <sx.StyledToggleButton
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
            </sx.StyledToggleButton>
        </Tooltip>
    );
}

// EXPORT

export default FlagBadge;
