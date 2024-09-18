import * as commonSx from './commonSx.js';
import ComputerTwoToneIcon from '@mui/icons-material/ComputerTwoTone';
import PhoneIphoneTwoToneIcon from '@mui/icons-material/PhoneIphoneTwoTone';
import TabletMacTwoToneIcon from '@mui/icons-material/TabletMacTwoTone';

export const spacingTopHeight = { height: 10 };

export const spacingBottomHeight = { height: 20 };

const formHeight = { maxHeight: 45 };

export const formWidth = {
    width: "100%"
};

export const inputHeight = {
    maxHeight: formHeight,
    minHeight: formHeight
};

export const input = {
    ...commonSx.font,
    ...commonSx.btnColor,
    ...inputHeight
};

export const desktopIcon = <ComputerTwoToneIcon />;

export const mobileIcon = <PhoneIphoneTwoToneIcon />;

export const tabletIcon = <TabletMacTwoToneIcon />;