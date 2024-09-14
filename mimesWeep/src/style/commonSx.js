import TourTwoTone from '@mui/icons-material/TourTwoTone';

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
    width: 60,
    maxWidth: 60,
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

export const btnVariant = "outlined";

export const flagIcon = TourTwoTone;

export const tooltipPlacement = "top";

export const tooltipArrow = true;