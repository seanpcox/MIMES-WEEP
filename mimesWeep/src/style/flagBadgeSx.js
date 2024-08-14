
import * as commonSx from './commonSx.js';
import Badge from '@mui/material/Badge';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const selected = grey[900]

export const unselected = grey[500]

export const flagBtn = {
    width: 64,
    maxWidth: 64,
    ...commonSx.btn
};

export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -10,
        top: 9,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export const badgeColor = "warning";