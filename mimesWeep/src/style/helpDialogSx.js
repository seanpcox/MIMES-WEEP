import * as gameText from '../resources/text/gameText.js';
import AutoFixNormalTwoToneIcon from '@mui/icons-material/AutoFixNormalTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import EmojiPeopleTwoToneIcon from '@mui/icons-material/EmojiPeopleTwoTone';
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import mouseLeftClick from '../resources/images/leftClickDisabled.png';
import mouseRightClick from '../resources/images/rightClickDisabled.png';
import PanToolAltTwoToneIcon from '@mui/icons-material/PanToolAltTwoTone';
import TouchAppTwoToneIcon from '@mui/icons-material/TouchAppTwoTone';
import { Icon } from '@mui/material';

export const spacingTitleHeight = { height: 7 };

export const spacingHeight = { height: 10 };

export const smallSpacingHeight = { height: 5 };

export const listItem = {
    alignItems: "center"
};

export const listItemIcon = {
    minWidth: '40px'
};

const mouseIconSize = 24;

export const leftClickIcon = <Icon><img
    src={mouseLeftClick}
    width={mouseIconSize}
    height={mouseIconSize}
    alt={gameText.leftClick} />
</Icon>;

export const rightClickIcon = <Icon><img
    src={mouseRightClick}
    width={mouseIconSize}
    height={mouseIconSize}
    alt={gameText.leftClick} />
</Icon>;

export const tapIcon = <PanToolAltTwoToneIcon />;

export const longPressIcon = <TouchAppTwoToneIcon />;

export const winIcon = <EmojiEventsTwoToneIcon />;

export const numberIcon = <Filter2TwoToneIcon />;

export const flagHintIcon = <AutoFixNormalTwoToneIcon />;

export const creatorIcon = <DesignServicesTwoToneIcon />;

export const welcomeIcon = <EmojiPeopleTwoToneIcon />;

export const chordIcon = <LibraryMusicTwoToneIcon />;