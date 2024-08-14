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
    maxHeight: 42,
    minHeight: 42
};

export const btn = {
    ...font,
    ...btnColor,
    ...btnHeight
};

export const flagIcon = TourTwoTone;