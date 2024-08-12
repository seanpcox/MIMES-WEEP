const longPressDuration = 350;

export default class IOSContextMenuHandler {
    constructor(leftClickCallback, rightClickback) {
        this.leftClickCallback = leftClickCallback;
        this.rightClickCallback = rightClickback;
        this.longPressCountdown = null;
        this.longPressOccurred = false;
    }

    onTouchStart = e => {
        e.preventDefault();
        this.longPressOccurred = false;

        this.longPressCountdown = setTimeout(() => {
            this.longPressOccurred = true;
            this.rightClickCallback();
        }, longPressDuration);
    };

    onTouchMove = e => {
        e.preventDefault();
        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };

    onTouchCancel = e => {
        e.preventDefault();
        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };

    onTouchEnd = e => {
        e.preventDefault();

        if (!this.longPressOccurred) {
            this.leftClickCallback();
        }

        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };
}
