
import * as commonSx from './commonSx.js';
import Badge from '@mui/material/Badge';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { ToggleButton } from '@mui/material';

export const selectedColor = grey[900];

export const unselectedColor = grey[400];

export const iconMargin = -1;

export const flagBtnNoBadge = {
    justifyContent: "center",
    ...commonSx.btnMedium
};

export const flagBtnBadge = {
    justifyContent: "left",
    ...commonSx.btnMedium
};

export const StyledToggleButton = styled(ToggleButton)(() => ({
    "&.Mui-selected, &.Mui-selected:hover": {
        color: commonSx.btnTextColor,
        backgroundColor: commonSx.btnBackgroundColor
    },
    // Set the hover and focus behaviour to the same as other buttons in toolbar
    ':hover': commonSx.btnHoverStyle,
    '&:focus': commonSx.btnFocusStyle
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -12,
        top: 9,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px'
    },
}));

export const badgeColor = "warning";