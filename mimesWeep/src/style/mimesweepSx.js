import * as commonSx from './commonSx.js';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import InputBase from '@mui/material/InputBase';
import InsertEmoticonTwoToneIcon from '@mui/icons-material/InsertEmoticonTwoTone';
import NotStartedTwoToneIcon from '@mui/icons-material/NotStartedTwoTone';
import SentimentSatisfiedAltTwoToneIcon from '@mui/icons-material/SentimentSatisfiedAltTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { styled } from '@mui/material/styles';

export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 7 };

export const btnSmallSpacingWidth = { width: 4 };

export const toolbar = {
    justifyContent: 'center',
    padding: 0,
    margin: 0
};

export const difficultySelect = {
    height: '14px',
    maxHeight: '14px',
    width: 60,
    minWidth: 60,
    maxWidth: 60
};

export const customBtn = {
    color: 'inherit',
    justifyContent: 'left',
    width: '100%',
    minHeight: 0,
    padding: 0,
    ...commonSx.font
};

export const btnSquare = {
    ...commonSx.btn,
    minWidth: 42,
    width: 42,
    maxWidth: 42
};

export const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        border: '1px solid',
        height: '14px',
        maxHeight: '14px',
        marginRight: 1,
        width: 15,
        minWidth: 15,
        maxWidth: 15,
        padding: '5px 10px 10px 8px',
        ...commonSx.font,
        ...commonSx.btnColor,
        // Set the hover and focus behaviour to the same as other buttons in toolbar
        ':hover': commonSx.btnHoverStyle,
        '&:focus': commonSx.btnFocusStyle
    }
}));

export const diificultyTooltipOffset = {
    popper: {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 13],
                }
            }
        ]
    }
};

export const newGameIcon = <NotStartedTwoToneIcon />;

export const easyLevelIcon = <SentimentVerySatisfiedTwoToneIcon />;

export const mediumLevelIcon = <InsertEmoticonTwoToneIcon />;

export const hardLevelIcon = <SentimentSatisfiedAltTwoToneIcon />;

export const customLevelIcon = <BuildCircleTwoToneIcon />;

export const helpIcon = <HelpTwoTone />;

export const settingsIcon = <SettingsTwoToneIcon />;