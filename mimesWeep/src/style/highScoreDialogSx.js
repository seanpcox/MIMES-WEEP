import * as commonSx from './commonSx.js';

export const spacingTopHeight = { height: 10 };

export const spacingBottomHeight = { height: 20 };

const formHeight = { maxHeight: 45 };

export const formWidth = {
    width: "100%"
};

export const lLabelPadding = {
    paddingRight: '3%'
}

export const lFormWidth = {
    width: "47%",
    ...lLabelPadding
};

export const rLabelPadding = {
    paddingLeft: '8%'
}

export const rFormWidth = {
    width: "47%",
    paddingLeft: '3%'
};

export const inputHeight = {
    maxHeight: formHeight,
    minHeight: formHeight
};

export const input = {
    ...commonSx.font,
    ...commonSx.btnColor,
    ...inputHeight
};