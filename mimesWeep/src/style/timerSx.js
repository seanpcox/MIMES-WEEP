import * as commonSx from './commonSx.js';
import { Button } from '@mui/material';
import EmojiEventsTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import { styled } from '@mui/material/styles';

export const highScoresIcon = EmojiEventsTwoToneIcon;

export const timerBtn = {
    width: 60,
    maxWidth: 60,
    minWidth: 60,
    ...commonSx.btn
};

export const StyledButton = styled(Button)(() => ({
    // Set the disable color of text to black
    "&:disabled": {
        color: 'black',
        borderColor: '#c4c4c4'
    },
    // Set the hover color to the same as other buttons in toolbar
    ':hover': {
        borderColor: 'black'
    }
}));