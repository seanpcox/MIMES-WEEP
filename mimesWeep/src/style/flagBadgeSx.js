import * as commonSx from './commonSx.js';
import Badge from '@mui/material/Badge';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

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

export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -14,
        top: 9,
        border: `1px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
        fontSize: 14
    },
}));

export const badgeColor = "warning";