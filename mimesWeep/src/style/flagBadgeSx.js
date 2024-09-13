
import * as commonSx from './commonSx.js';
import Badge from '@mui/material/Badge';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { ToggleButton } from '@mui/material';

export const selectedColor = grey[900];

export const unselectedColor = grey[400];

export const iconMargin = -1;

const flagBtn = {
    width: 60,
    maxWidth: 60,
    ...commonSx.btn
};

export const flagBtnNoBadge = {
    justifyContent: "center",
    ...flagBtn
};

export const flagBtnBadge = {
    justifyContent: "left",
    ...flagBtn
};

export const StyledToggleButton = styled(ToggleButton)(() => ({
    // Set the hover color to the same as other buttons in toolbar
    ':hover': {
        borderColor: 'black'
    }
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