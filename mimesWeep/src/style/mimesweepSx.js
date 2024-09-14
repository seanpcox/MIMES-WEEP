import * as commonSx from './commonSx.js';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import HelpTwoTone from '@mui/icons-material/HelpTwoTone';
import InputBase from '@mui/material/InputBase';
import InsertEmoticonTwoToneIcon from '@mui/icons-material/InsertEmoticonTwoTone';
import NotStartedTwoToneIcon from '@mui/icons-material/NotStartedTwoTone';
import SentimentSatisfiedAltTwoToneIcon from '@mui/icons-material/SentimentSatisfiedAltTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 5 };

export const toolbar = {
    justifyContent: "center",
    padding: 0,
    margin: 0
};

export const difficultySelect = {
    width: 60,
    maxWidth: 60,
    height: '14px',
    maxHeight: '14px',
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

export const btnSquare = {
    ...commonSx.btn,
    minWidth: 42,
    width: 42,
    maxWidth: 42
};

export const StyledButton = styled(Button)(() => ({
    // Set the hover color to the same as other buttons in toolbar
    ':hover': {
        borderColor: 'black'
    }
}));

export const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        position: 'relative',
        border: '1px solid #ced4da',
        ...commonSx.font,
        ...commonSx.btnColor,
        height: '14px',
        maxHeight: '14px',
        padding: '5px 5px 10px 5px',
        ':hover': {
            borderColor: 'black'
        },
        '&:focus': {
            borderRadius: 2,
            borderColor: 'black',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    }
}));

export const newGameIcon = <NotStartedTwoToneIcon />;

export const easyLevelIcon = <SentimentVerySatisfiedTwoToneIcon />;

export const mediumLevelIcon = <InsertEmoticonTwoToneIcon />;

export const hardLevelIcon = <SentimentSatisfiedAltTwoToneIcon />;

export const customLevelIcon = <BuildCircleTwoToneIcon />;

export const helpIcon = <HelpTwoTone />;

export const settingsIcon = <SettingsTwoToneIcon />;