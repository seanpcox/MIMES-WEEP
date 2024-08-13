import * as commonSx from '../style/common.js';

export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 7 };

export const btnSmallWidth = {
    width: 38,
    maxWidth: 38
};

export const btnSmall = {
    ...commonSx.btn,
    ...btnSmallWidth
};

export const toolbar = {
    justifyContent: "center",
    padding: 0,
    margin: 0
};

export const difficultySelect = {
    width: 110,
    maxWidth: 110,
    ...commonSx.btn
};

export const customBtn = {
    justifyContent: "left",
    width: '100%',
    minHeight: 0,
    padding: 0,
    ...commonSx.font,
    ...commonSx.btnColor
};