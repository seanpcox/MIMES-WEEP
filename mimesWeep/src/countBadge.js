import './mimesWeep.css';
import { useState } from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import mimeIcon from './mimeGreyIcon.png';
import PropTypes from 'prop-types';
import { ToggleButton } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -5,
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

    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
        value="check"
        selected={selected}
        onChange={() => {
          setSelected(!selected);
        }}
        style={{ maxHeight: 42, minHeight: 42, minWidth: 84, color: '#282c34', borderColor: 'lightGrey' }}
      >
        <StyledBadge badgeContent={mimeBadgeCount} color="warning">
            <img src={mimeIcon} width="38px" height="38px" alt="Grey Mime" />
        </StyledBadge>
        </ToggleButton>
    );
}

export default CountBadge;
