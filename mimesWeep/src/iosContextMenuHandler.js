const longPressDuration = 610;

export default class ContextMenuHandler {
    constructor(callback, printLine) {
        this.callback = callback;
        this.longPressCountdown = null;
        this.contextMenuPossible = false;
        this.printLine = printLine;
    }

    onTouchStart = e => {
        this.contextMenuPossible = true;

        const touch = e.touches[0];

        this.longPressCountdown = setTimeout(() => {
            this.contextMenuPossible = false;
            this.callback(touch);
        }, longPressDuration);

        e.preventDefault();
    };

    onTouchMove = e => {
        clearTimeout(this.longPressCountdown);
        e.preventDefault();
    };

    onTouchCancel = e => {
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
        e.preventDefault();
    };

    onTouchEnd = e => {
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
        e.preventDefault();
    };

    onContextMenu = e => {
        this.contextMenuPossible = false;

        clearTimeout(this.longPressCountdown);

        this.callback(e);
        e.preventDefault();
    };
}
