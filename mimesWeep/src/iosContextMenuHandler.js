const longPressDuration = 250;

export default class ContextMenuHandler {
    constructor(clickCallback, contextMenuCallback) {
        this.clickCallback = clickCallback;
        this.contextMenuCallback = contextMenuCallback;
        this.longPressCountdown = null;
        this.contextMenuPossible = false;
        this.longPressOccured = false;
    }

    onClick = e => {
        if (this.longPressOccured) {
            this.longPressOccured = false;
            return;
        }

        console.log("onClick");
        this.clickCallback(e);
        e.preventDefault();
    }

    onTouchStart = e => {
        console.log("onTouchStart");
        this.contextMenuPossible = true;

        const touch = e.touches[0];

        this.longPressCountdown = setTimeout(() => {
            this.longPressOccured = true;
            this.contextMenuPossible = false;
            this.contextMenuCallback(touch);
        }, longPressDuration);
    };

    onTouchMove = e => {
        console.log("onTouchMove");
        clearTimeout(this.longPressCountdown);
    };

    onTouchCancel = e => {
        console.log("onTouchCancel");
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
    };

    onTouchEnd = e => {
        console.log("onTouchEnd");
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
    };

    onContextMenu = e => {
        console.log("onContextMenu");

        this.contextMenuPossible = false;

        clearTimeout(this.longPressCountdown);

        this.contextMenuCallback(e);
        e.preventDefault();
    };
}
