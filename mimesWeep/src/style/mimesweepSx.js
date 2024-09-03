import * as commonSx from './commonSx.js';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';

export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 5 };

export const toolbar = {
    justifyContent: "center",
    padding: 0,
    margin: 0
};

export const difficultySelect = {
    width: 110,
    maxWidth: 110,
    ...commonSx.btn
};

export const customBtn = {
    justifyContent: "left",
    width: '100%',
    minHeight: 0,
    padding: 0,
    ...commonSx.font,
    ...commonSx.btnColor
};

export const btnHelp = {
    ...commonSx.btn,
    minWidth: 40,
    width: 40,
    maxWidth: 40
};

export const btnNew = {
    ...commonSx.btn,
    minWidth: 52,
    width: 52,
    maxWidth: 52
};

export const helpIcon = HelpTwoTone;