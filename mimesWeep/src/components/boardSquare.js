import * as commonSx from '../style/commonSx.js';
import * as sx from '../style/boardSquareSx.js';
import IOSContextMenuHandler from '../logic/iosContextMenuHandler.js';
import PropTypes from 'prop-types';
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
                color={getButtonColor(numOfMimeNeighbors)}
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
                color={getButtonColor(numOfMimeNeighbors)}
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
            return sx.mimeDetonated;
        case -1:
            return sx.mime;
        case 0:
            return null;
        case 1:
            return sx.oneIcon;
        case 2:
            return sx.twoIcon;
        case 3:
            return sx.threeIcon;
        case 4:
            return sx.fourIcon;
        case 5:
            return sx.fiveIcon;
        case 6:
            return sx.sixIcon;
        case 7:
            return sx.sevenIcon;
        case 8:
            return sx.eightIcon;
        case 9:
            return sx.mimeFlagged;
        default:
            return <commonSx.flagIcon />;
    }
}

function getButtonColor(numOfMimeNeighbors) {
    if (numOfMimeNeighbors % 1 === 0) {
        return (numOfMimeNeighbors >= 10) ? sx.flaggedIncorrectColor : sx.flaggedCorrectColor;
    }

    return sx.flaggedUnknownColor;
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
