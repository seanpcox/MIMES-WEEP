const longPressDuration = 180;

export default class ContextMenuHandler {
    constructor(callback) {
        this.callback = callback;
        this.longPressCountdown = null;
        this.contextMenuPossible = false;
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

    onTouchMove = () => {
        clearTimeout(this.longPressCountdown);
    };

    onTouchCancel = () => {
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
    };

    onTouchEnd = () => {
        this.contextMenuPossible = false;
        clearTimeout(this.longPressCountdown);
    };

    onContextMenu = e => {
        this.contextMenuPossible = false;

        clearTimeout(this.longPressCountdown);

        this.callback(e);
        e.preventDefault();
    };
}
