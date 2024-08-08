import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { blue, green, pink, red, deepPurple, purple, blueGrey, teal } from '@mui/material/colors';
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone';
import Filter4TwoToneIcon from '@mui/icons-material/Filter4TwoTone';
import Filter5TwoToneIcon from '@mui/icons-material/Filter5TwoTone';
import Filter6TwoToneIcon from '@mui/icons-material/Filter6TwoTone';
import Filter7TwoToneIcon from '@mui/icons-material/Filter7TwoTone';
import Filter8TwoToneIcon from '@mui/icons-material/Filter8TwoTone';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import mimeWhiteIcon from './mimeWhiteIcon.png';
import mimeRedIcon from './mimeRedIcon.png';
import mimeBlackIcon from './mimeBlackIcon.png';
import IOSContextMenuHandler from './iosContextMenuHandler.js';
import { isIOS } from 'react-device-detect';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

const BoardSquare = forwardRef(function BoardSquare(props, inputRef) {
    var btnSize = '38px';

    const [numOfMimeNeighbors, setNumOfMimeNeighbors] = useState(props.numOfMimeNeighbors);

    const ref = useRef(null);

    useImperativeHandle(inputRef, () => {
        return {
            refresh(newNumOfMimeNeighbors) {
                setNumOfMimeNeighbors(newNumOfMimeNeighbors);
            }
        };
    }, []);

    const isDeviceIOS = useState(isIOS);

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

    if (isDeviceIOS[0]) {
        if (numOfMimeNeighbors >= 9) {
            return <Button variant="contained"
                ref={ref}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}
                color={getButtonColor(numOfMimeNeighbors)}>
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        } else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button variant="contained"
                ref={ref}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}>
            </Button>;
        } else {
            return <Button variant="outlined" disabled={true}
                ref={ref}
                onTouchStart={contextMenuHandler.onTouchStart}
                onTouchCancel={contextMenuHandler.onTouchCancel}
                onTouchEnd={contextMenuHandler.onTouchEnd}
                onTouchMove={contextMenuHandler.onTouchMove}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}>
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    } else {
        if (numOfMimeNeighbors >= 9) {
            return <Button variant="contained"
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}
                color={getButtonColor(numOfMimeNeighbors)}>
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        } else if (Math.floor(numOfMimeNeighbors) !== numOfMimeNeighbors) {
            return <Button variant="contained"
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}>
            </Button>;
        } else {
            return <Button variant="outlined" disabled={true}
                ref={ref}
                onClick={setLeftClickState}
                onContextMenu={setRightClickState}
                style={{ maxWidth: btnSize, maxHeight: btnSize, minWidth: btnSize, minHeight: btnSize }}>
                {getIcon(numOfMimeNeighbors)}
            </Button>;
        }
    }
});

function getIcon(numOfMimeNeighbors) {
    switch (numOfMimeNeighbors) {
        case -2:
            return <img src={mimeRedIcon} width="24px" height="24px" alt="Red Mime" />;
        case -1:
            return <img src={mimeBlackIcon} width="24px" height="24px" alt="Black Mime" />;
        case 0:
            return null;
        case 1:
            return <Filter1TwoToneIcon sx={{ color: blue[500] }} />;
        case 2:
            return <Filter2TwoToneIcon sx={{ color: green[500] }} />;
        case 3:
            return <Filter3TwoToneIcon sx={{ color: pink[300] }} />;
        case 4:
            return <Filter4TwoToneIcon sx={{ color: purple[300] }} />;
        case 5:
            return <Filter5TwoToneIcon sx={{ color: teal[500] }} />;
        case 6:
            return <Filter6TwoToneIcon sx={{ color: deepPurple[500] }} />;
        case 7:
            return <Filter7TwoToneIcon sx={{ color: blueGrey[500] }} />;
        case 8:
            return <Filter8TwoToneIcon sx={{ color: red[500] }} />;
        case 9:
            return <img src={mimeWhiteIcon} width="24px" height="24px" alt="White Mime" />;
        default:
            return <TourTwoTone />;
    }
}

function getButtonColor(numOfMimeNeighbors) {
    if (numOfMimeNeighbors % 1 === 0) {
        return (numOfMimeNeighbors >= 10) ? "error" : "success"
    }

    return "warning";
}

BoardSquare.propTypes = {
    numOfMimeNeighbors: PropTypes.number,
    indexI: PropTypes.number,
    indexJ: PropTypes.number,
    btnLeftClickCallback: PropTypes.func,
    btnRightClickCallback: PropTypes.func
}

export default BoardSquare;
