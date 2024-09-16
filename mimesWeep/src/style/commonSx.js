
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import MyLocationTwoToneIcon from '@mui/icons-material/MyLocationTwoTone';
import NotStartedTwoToneIcon from '@mui/icons-material/NotStartedTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import TourTwoTone from '@mui/icons-material/TourTwoTone';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const buttonHeight = 40;

export const btnTextColor = '#282c34';

export const btnBackgroundColor = 'white';

export const btnHLBorderColor = 'black';

export const font = {
    fontSize: 16,
    fontFamily: 'Arial',
    textTransform: 'none'
};

export const btnColor = {
    color: btnTextColor,
    borderColor: '#c4c4c4',
    backgroundColor: btnBackgroundColor
};

export const btnHeight = {
    maxHeight: buttonHeight,
    minHeight: buttonHeight
};

export const btn = {
    ...font,
    ...btnColor,
    ...btnHeight
};

export const btnMedium = {
    minWidth: 66,
    width: 66,
    maxWidth: 66,
    ...btn
}

export const btnFocusStyle = {
    borderRadius: 2,
    borderColor: btnHLBorderColor,
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
};

export const btnHoverStyle = {
    borderColor: btnHLBorderColor,
    boxShadow: '0 0 0 0.1rem rgba(0,123,255,.25)',
};

export const StyledButton = styled(Button)(() => ({
    // Set the hover and focus behaviour to the same as other buttons in toolbar
    ':hover': btnHoverStyle,
    '&:focus': btnFocusStyle
}));

export const btnVariant = "outlined";

export const tooltipPlacement = "top";

export const tooltipArrow = true;

export const flagIcon = TourTwoTone;

export const newGameIcon = <NotStartedTwoToneIcon />;

export const easyLevelIcon = <SentimentVerySatisfiedTwoToneIcon />;

export const highScoreIcon = <EmojiEventsTwoToneIcon />;

export const flagIconHtml = <TourTwoTone />;

export const settingsIcon = <SettingsTwoToneIcon />;

export const helpIcon = <HelpTwoTone />;

export const customLevelIcon = <BuildCircleTwoToneIcon />;

export const hintIcon = <MyLocationTwoToneIcon />;