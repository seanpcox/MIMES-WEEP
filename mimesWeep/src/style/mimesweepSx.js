export const spacingHeight = { height: 10 };

export const btnSpacingWidth = { width: 7 };

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

export const btnSmallWidth = {
    width: 38,
    maxWidth: 38
};

export const btn = {
    ...font,
    ...btnColor,
    ...btnHeight
};

export const btnSmall = {
    ...btn,
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
    ...btn
};

export const customBtn = {
    justifyContent: "left",
    width: '100%',
    minHeight: 0,
    padding: 0,
    ...font,
    ...btnColor
};