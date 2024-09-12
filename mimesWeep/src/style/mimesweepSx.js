import * as commonSx from './commonSx.js';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 4 };

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
    minWidth: 42,
    width: 42,
    maxWidth: 42
};

export const btnNew = {
    ...commonSx.btn,
    minWidth: 52,
    width: 52,
    maxWidth: 52
};

export const StyledButton = styled(Button)(() => ({
    // Set the hover color to the same as other buttons in toolbar
    ':hover': {
        borderColor: 'black'
    }
}));

export const helpIcon = HelpTwoTone;