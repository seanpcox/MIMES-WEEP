import TourTwoTone from '@mui/icons-material/TourTwoTone';

const buttonHeight = 40;

export const font = {
    fontSize: 16,
    fontFamily: 'Arial',
    textTransform: 'none'
};

export const btnColor = {
    color: '#282c34',
    borderColor: '#c4c4c4'
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

export const btnVariant = "outlined";

export const flagIcon = TourTwoTone;

export const tooltipPlacement = "top";

export const tooltipArrow = true;