import * as commonSx from './commonSx.js';
import { Button } from '@mui/material';
import EmojiEventsTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import { styled } from '@mui/material/styles';

export const highScoresIcon = EmojiEventsTwoToneIcon;

export const StyledButton = styled(Button)(() => ({
    // Set the disabled text and border color to be the same as an enabled button
    "&:disabled": commonSx.btnColor,
    // Set the hover and focus behaviour to the same as other buttons in toolbar
    ':hover': commonSx.btnHoverStyle,
    '&:focus': commonSx.btnFocusStyle
}));