import * as gameText from '../resources/text/gameText.js';
import { blue, green, pink, red, deepPurple, purple, blueGrey, teal } from '@mui/material/colors';
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import Filter3TwoToneIcon from '@mui/icons-material/Filter3TwoTone';
import Filter4TwoToneIcon from '@mui/icons-material/Filter4TwoTone';
import Filter5TwoToneIcon from '@mui/icons-material/Filter5TwoTone';
import Filter6TwoToneIcon from '@mui/icons-material/Filter6TwoTone';
import Filter7TwoToneIcon from '@mui/icons-material/Filter7TwoTone';
import Filter8TwoToneIcon from '@mui/icons-material/Filter8TwoTone';
import mimeBlackIcon from '../resources/images/mimeBlackIcon.png';
import mimeRedIcon from '../resources/images/mimeRedIcon.png';
import mimeWhiteIcon from '../resources/images/mimeWhiteIcon.png';

const squareSize = '36px';

export const squareSx = {
    maxWidth: squareSize,
    maxHeight: squareSize,
    minWidth: squareSize,
    minHeight: squareSize
};

export const iconSize = '24px';

export const mimeDetonated = <img
    src={mimeRedIcon}
    width={iconSize}
    height={iconSize}
    alt={gameText.altRedMime} />;

export const mime = <img
    src={mimeBlackIcon}
    width={iconSize}
    height={iconSize}
    alt={gameText.altBlackMime} />;

export const mimeFlagged = <img
    src={mimeWhiteIcon}
    width={iconSize}
    height={iconSize}
    alt={gameText.altWhiteMime} />;

const oneColor = { color: blue[400] };

const twoColor = { color: green[400] };

const threeColor = { color: pink[300] };

const fourColor = { color: purple[300] };

const fiveColor = { color: teal[600] };

const sixColor = { color: deepPurple[500] };

const sevenColor = { color: blueGrey[500] };

const eightColor = { color: red[500] };

export const oneIcon = <Filter1TwoToneIcon sx={oneColor} />;

export const twoIcon = <Filter2TwoToneIcon sx={twoColor} />;

export const threeIcon = <Filter3TwoToneIcon sx={threeColor} />;

export const fourIcon = <Filter4TwoToneIcon sx={fourColor} />;

export const fiveIcon = <Filter5TwoToneIcon sx={fiveColor} />;

export const sixIcon = <Filter6TwoToneIcon sx={sixColor} />;

export const sevenIcon = <Filter7TwoToneIcon sx={sevenColor} />;

export const eightIcon = <Filter8TwoToneIcon sx={eightColor} />;

export const flaggedUnknownColor = "warning";

export const flaggedIncorrectColor = "error";

export const flaggedCorrectColor = "success";

export const unrevealedVariant = "contained";

export const revealedVariant = "outlined";