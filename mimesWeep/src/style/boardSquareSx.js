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

const squareSize = 36;

const squareSizePx = squareSize + 'px';

export const squareSx = {
    maxWidth: squareSizePx,
    maxHeight: squareSizePx,
    minWidth: squareSizePx,
    minHeight: squareSizePx
};

export const mimeIconSize = 24;

const mimeIconSizePx = mimeIconSize + 'px';

export const mimeDetonatedImage = mimeRedIcon;

export const mimeDetonatedAltText = gameText.altRedMime;

export const mimeIcon = <img
    src={mimeBlackIcon}
    width={mimeIconSizePx}
    height={mimeIconSizePx}
    alt={gameText.altBlackMime} />;

export const mimeFlaggedIcon = <img
    src={mimeWhiteIcon}
    width={mimeIconSizePx}
    height={mimeIconSizePx}
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

export const mimeDetonatedIconInitialSize = mimeIconSize;

export const mimeDetonatedIconMaxSize = squareSize;

export const mimeDetonatedAnimationSpeed = 20;

export const mimeDetonatedAnimationPlayCount = 2;