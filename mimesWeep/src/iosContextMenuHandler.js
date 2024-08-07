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
        console.log("onTouchStart");
        this.longPressOccurred = false;

        this.longPressCountdown = setTimeout(() => {
            this.longPressOccurred = true;
            this.rightClickCallback();
            this.window.navigator.vibrate([200])
        }, longPressDuration);
    };

    onTouchMove = e => {
        e.preventDefault();
        console.log("onTouchMove");
        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };

    onTouchCancel = e => {
        e.preventDefault();
        console.log("onTouchCancel");
        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };

    onTouchEnd = e => {
        e.preventDefault();
        console.log("onTouchEnd");

        if(!this.longPressOccurred) {
            this.leftClickCallback();
        }

        clearTimeout(this.longPressCountdown);
        this.longPressOccurred = false;
    };
}
