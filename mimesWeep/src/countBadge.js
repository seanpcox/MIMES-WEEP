import './mimesWeep.css';
import { useState } from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import mimeIcon from './mimeGreyIcon.png';
import PropTypes from 'prop-types';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -4,
        top: 10,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

CountBadge.propTypes = {
    mimeBadgeCount: PropTypes.number
}

function CountBadge(props) {
    const [mimeBadgeCount, setMimeBadgeCount] = useState(props.mimeBadgeCount);

    if (mimeBadgeCount !== props.mimeBadgeCount) {
        setMimeBadgeCount(props.mimeBadgeCount);
    }

    return (
        <StyledBadge badgeContent={mimeBadgeCount} color="warning">
            <img src={mimeIcon} width="40px" height="40px" alt="Grey Mime" />
        </StyledBadge>
    );
}

export default CountBadge;
