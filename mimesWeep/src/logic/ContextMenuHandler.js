const longPressDuration = 610;

export default class ContextMenuHandler {
  constructor(callback, printLine) {
    this.callback = callback;
    this.longPressCountdown = null;
    this.contextMenuPossible = false;
    this.printLine = printLine;
  }

  onTouchStart = e => {
    this.printLine("onTouchStart");
    this.contextMenuPossible = true;

    const touch = e.touches[0];

    this.longPressCountdown = setTimeout(() => {
      this.contextMenuPossible = false;
      this.callback(touch);
    }, longPressDuration);
  };

  onTouchMove = e => {
    this.printLine("onTouchMove");
    clearTimeout(this.longPressCountdown);
  };

  onTouchCancel = e => {
    this.printLine("onTouchCancel");
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onTouchEnd = e => {
    this.printLine("onTouchEnd");
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onContextMenu = e => {
    this.printLine("onContextMenu");

    this.contextMenuPossible = false;

    clearTimeout(this.longPressCountdown);

    this.callback(e);
    e.preventDefault();
  };
}
