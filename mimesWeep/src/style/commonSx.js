import TourTwoTone from '@mui/icons-material/TourTwoTone';

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
    maxHeight: 38,
    minHeight: 38
};

export const btn = {
    ...font,
    ...btnColor,
    ...btnHeight
};

export const btnMedium = {
    width: 60,
    maxWidth: 60,
    ...btn
};

export const btnVariant = "outlined";

export const flagIcon = TourTwoTone;

export const tooltipPlacement = "top";

export const tooltipArrow = true;