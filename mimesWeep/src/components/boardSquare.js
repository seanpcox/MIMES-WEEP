import * as gameText from '../resources/text/gameText.js';
import * as sx from '../style/boardSquareSx.js';
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone';
import Filter4TwoToneIcon from '@mui/icons-material/Filter4TwoTone';
import Filter5TwoToneIcon from '@mui/icons-material/Filter5TwoTone';
import Filter6TwoToneIcon from '@mui/icons-material/Filter6TwoTone';
import Filter7TwoToneIcon from '@mui/icons-material/Filter7TwoTone';
import Filter8TwoToneIcon from '@mui/icons-material/Filter8TwoTone';
import IOSContextMenuHandler from '../logic/iosContextMenuHandler.js';
import mimeBlackIcon from '../resources/images/mimeBlackIcon.png';
import mimeRedIcon from '../resources/images/mimeRedIcon.png';
import mimeWhiteIcon from '../resources/images/mimeWhiteIcon.png';
import PropTypes from 'prop-types';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import { Button } from '@mui/material';
import { isIOS } from 'react-device-detect';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

// COMPONENT

const BoardSquare = forwardRef(function BoardSquare(props, inputRef) {

    // STATES

    const [numOfMimeNeighbors, setNumOfMimeNeighbors] = useState(props.numOfMimeNeighbors);

    const isDeviceIOS = useState(isIOS);

    // REFS

    const ref = useRef(null);

    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            refresh(newNumOfMimeNeighbors) {
                setNumOfMimeNeighbors(newNumOfMimeNeighbors);
            }
        };
    }, []);

    // LOCAL FUNCTIONS

    const contextMenuHandler = new IOSContextMenuHandler(
        () => {
            setLeftClickState();
        },
        () => {
            setRightClickState();
        }
    );

    const setLeftClickState = () => {
        props.btnLeftClickCallback(props.indexI, props.indexJ);
    };

    const setRightClickState = () => {
        props.btnRightClickCallback(props.indexI, props.indexJ);
    };

    // RENDER

    if (isDeviceIOS[0]) {
        if (numOfMimeNeighbors >= 9) {
            return <Button
                ref={ref}
                variant="contained"
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx}
                color={getButtonStatus(numOfMimeNeighbors)}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        } else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button
                ref={ref}
                variant="contained"
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx} />
        } else {
            return <Button
                ref={ref}
                variant="outlined"
                disabled={true}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                sx={sx.squareSx}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    } else {
        if (numOfMimeNeighbors >= 9) {
            return <Button
                variant="contained"
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={sx.squareSx}
                color={getButtonStatus(numOfMimeNeighbors)}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        } else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button
                variant="contained"
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={sx.squareSx}
            />
        } else {
            return <Button
                variant="outlined"
                disabled={true}
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                sx={sx.squareSx}
            >
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    }
});

// EXTERNAL FUNCTIONS

function getIcon(numOfMimeNeighbors) {
    switch (numOfMimeNeighbors) {
        case -2:
            return <img
                src={mimeRedIcon}
                width={sx.iconSize}
                height={sx.iconSize}
                alt={gameText.altRedMime} />;
        case -1:
            return <img
                src={mimeBlackIcon}
                width={sx.iconSize}
                height={sx.iconSize}
                alt={gameText.altBlackMime} />;
        case 0:
            return null;
        case 1:
            return <Filter1TwoToneIcon sx={sx.one} />;
        case 2:
            return <Filter2TwoToneIcon sx={sx.two} />;
        case 3:
            return <Filter3TwoToneIcon sx={sx.three} />;
        case 4:
            return <Filter4TwoToneIcon sx={sx.four} />;
        case 5:
            return <Filter5TwoToneIcon sx={sx.five} />;
        case 6:
            return <Filter6TwoToneIcon sx={sx.six} />;
        case 7:
            return <Filter7TwoToneIcon sx={sx.seven} />;
        case 8:
            return <Filter8TwoToneIcon sx={sx.eight} />;
        case 9:
            return <img
                src={mimeWhiteIcon}
                width={sx.iconSize}
                height={sx.iconSize}
                alt={gameText.altWhiteMime} />;
        default:
            return <TourTwoTone />;
    }
}

function getButtonStatus(numOfMimeNeighbors) {
    if (numOfMimeNeighbors % 1 === 0) {
        return (numOfMimeNeighbors >= 10) ? "error" : "success"
    }

    return "warning";
}

// PROP LIST

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnLeftClickCallback: PropTypes.func,
    btnRightClickCallback: PropTypes.func
}

// EXPORT

export default BoardSquare;
