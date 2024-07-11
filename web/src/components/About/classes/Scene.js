import { LazyBrush } from "lazy-brush";
import { Catenary } from "catenary-curve";
import ResizeObserver from "resize-observer-polyfill";

const LAZY_RADIUS = 7;
const BRUSH_RADIUS = 6;
const ERASER_RADIUS = 18;
const STROKE_COLOR = "#F9F8F3";
const BG_COLOR = "#100D0B";

// At the top of your JavaScript file
// let mobileConsole;

// function createMobileConsole() {
//   mobileConsole = document.createElement('div');
//   mobileConsole.id = 'mobileConsole';
//   document.body.appendChild(mobileConsole);
// }

// function mobileLog(...args) {
//   if (!mobileConsole) {
//     createMobileConsole();
//   }
//   const logLine = document.createElement('div');
//   logLine.textContent = args.join(' ');
//   mobileConsole.appendChild(logLine);
//   mobileConsole.scrollTop = mobileConsole.scrollHeight;
//   console.log(...args); // Keep logging to the actual console as well
// }

// Call this function at the start of your app
// createMobileConsole();

function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}
export default class Scene {
  constructor({
    canvasContainer,
    sidebar,
    canvas,
    button,
    cursor,
    cursorText,
  }) {
    this.cursor = document.getElementById(cursor);
    this.cursorText = document.getElementById(cursorText);
    this.cursorTimeoutId = null;
    this.isCursorVisible = false;
    if (this.cursor) {
      this.cursor.style.display = "none";
      this.cursor.style.position = "absolute";
      this.cursor.style.zIndex = "20";
      this.cursor.style.pointerEvents = "none";
      this.cursor.style.transition = "opacity 0.3s ease"; // Add smooth transition for opacity
    }
    this.cursorPressed = false;
    this.isErasing = false;
    this.displayWidth = window.innerWidth;
    this.displayHeight = window.innerHeight;
    this.canvasContainer = document.getElementById(canvasContainer);
    this.sidebar = document.getElementById(sidebar);
    this.canvas = {};
    this.context = {};

    Object.keys(canvas).forEach((c) => {
      const el = document.getElementById(canvas[c]);
      this.canvas[c] = el;
      this.context[c] = el.getContext("2d");
    });

    this.button = {};
    Object.keys(button).forEach((b) => {
      this.button[b] = document.getElementById(button[b]);
    });

    this.catenary = new Catenary();
    this.lazy = new LazyBrush({
      radius: LAZY_RADIUS,
      enabled: true,
      initialPoint: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    });

    this.points = [];
    this.drawingHistory = [];
    this.mouseHasMoved = true;
    this.valuesChanged = true;
    this.isDrawing = false;
    this.isPressing = false;
    this.brushRadius = BRUSH_RADIUS;
    this.chainLength = LAZY_RADIUS;
    this.eraserRadius = ERASER_RADIUS;
    this.dpi = 1;
  }

  init() {
    // Listeners for mouse events
    this.canvas.interface.addEventListener(
      "mousedown",
      this.handlePointerDown.bind(this)
    );
    this.canvas.interface.addEventListener(
      "mouseup",
      this.handlePointerUp.bind(this)
    );
    this.button.clear.addEventListener("click", (e) =>
      this.handleButtonClear(e)
    );
    this.canvas.interface.addEventListener("mousemove", (e) => {
      const rect = this.canvas.interface.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handlePointerMove(x, y);
    });
    this.canvas.interface.addEventListener("contextmenu", (e) =>
      this.handleContextMenu(e)
    );

    // Listeners for touch events
    this.canvas.interface.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
    this.canvas.interface.addEventListener(
      "touchend",
      this.handleTouchEnd.bind(this)
    );
    this.canvas.interface.addEventListener("touchmove", (e) => {
      const rect = this.canvas.interface.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      // mobileLog('printing this,', x, y)
      this.handleTouchMove(x, y);
    });

    // Set eraser event
    // this.button.erase.addEventListener("click", (e) =>
    //   this.handleButtonErase(e)
    // );

    // Initialize ResizeObserver for canvas and sidebar
    const observeCanvas = new ResizeObserver((entries, observer) =>
      this.handleCanvasResize(entries, observer)
    );
    observeCanvas.observe(this.canvasContainer);

    const observeSidebar = new ResizeObserver((entries, observer) =>
      this.handleSidebarResize(entries, observer)
    );
    observeSidebar.observe(this.sidebar);

    // Initial setup timeout
    window.setTimeout(() => {
      const initX = window.innerWidth / 2;
      const initY = window.innerHeight / 2;
      this.lazy.update(
        { x: initX - this.chainLength / 4, y: initY },
        { both: true }
      );
      this.lazy.update(
        { x: initX + this.chainLength / 4, y: initY },
        { both: false }
      );
      this.mouseHasMoved = true;
      this.valuesChanged = true;
      this.clearCanvas();
    }, 100);

    // Update mouse enter and leave event listeners
    this.canvas.interface.addEventListener("mouseenter", () => {
      this.showCursor();
      this.resetCursorTimeout();
    });
    this.canvas.interface.addEventListener("mouseleave", () => {
      this.hideCursor();
      if (this.cursorTimeoutId) {
        clearTimeout(this.cursorTimeoutId);
      }
    });

    // Add mousemove event listener to the document
    document.addEventListener("mousemove", (e) => {
      const rect = this.canvas.interface.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        this.handlePointerMove(x, y);
      } else {
        this.hideCursor();
      }
    });

    // Start rendering loop
    this.loop();
  }

  handleTouchStart(e) {
    e.preventDefault();
    const rect = this.canvas.interface.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    const y = e.changedTouches[0].clientY - rect.top;
    this.lazy.update({ x: x, y: y }, { both: true });
    this.handlePointerDown(e);
    this.mouseHasMoved = true;
  }

  handleTouchMove(x, y) {
    this.handlePointerMove(x, y);
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.handlePointerUp(e);
    const brush = this.lazy.getBrushCoordinates();
    this.lazy.update({ x: brush.x, y: brush.y }, { both: true });
    this.mouseHasMoved = true;
  }

  handleContextMenu(e) {
    e.preventDefault();
    if (e.button === 2) {
      this.clearCanvas();
    }
  }

  updateCursorPosition(x, y) {
    if (this.cursor) {
      const cursorRect = this.cursor.getBoundingClientRect();
      const cursorHeight = cursorRect.height;

      const offsetX = -7;
      const offsetY = 4;

      let adjustedX = x + offsetX;
      let adjustedY = y - cursorHeight + offsetY;

      this.cursor.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;

      this.showCursor();
      this.resetCursorTimeout();
    }
  }

  showCursor() {
    if (this.cursor) {
      this.cursor.style.display = "flex";
      setTimeout(() => {
        this.cursor.style.opacity = "1";
      }, 0);
      this.isCursorVisible = true;
    }
  }

  fadeCursorOpacity() {
    if (this.cursor) {
      this.cursor.style.opacity = "0.3"; // You can adjust this value
    }
  }
  restoreCursorOpacity() {
    if (this.cursor) {
      this.cursor.style.opacity = "1";
    }
  }
  hideCursor() {
    if (this.cursor) {
      this.cursor.style.display = "none";
      this.cursor.style.opacity = "0";
      this.isCursorVisible = false;
    }
  }

  fadeCursor() {
    if (this.cursor && this.isCursorVisible) {
      this.cursor.style.opacity = "0";
    }
  }
  fadeCursorText() {
    if (this.cursorText) {
      this.cursorText.style.transition = "opacity 0.3s ease";
      this.cursorText.style.opacity = "0";
    }
  }

  resetCursorTimeout() {
    if (this.cursorTimeoutId) {
      clearTimeout(this.cursorTimeoutId);
    }
    this.cursorTimeoutId = setTimeout(() => this.fadeCursor(), 1500);
  }

  handleButtonClear(e) {
    e.preventDefault();
    this.clearCanvas();
    this.hideCursor();
  }

  handlePointerDown(e) {
    e.preventDefault();
    const rect = this.canvas.interface.getBoundingClientRect();
    const x = e.clientX || e.touches[0].clientX - rect.left;
    const y = e.clientY || e.touches[0].clientY - rect.top;
    this.lazy.update({ x: x, y: y }, { both: true });
    this.isPressing = true;
    this.cursorPressed = true;
    this.updateCursorPosition(x, y);
    this.fadeCursorText(); // Fade out the cursor text when drawing starts
    this.removeBgStarActiveClass(); // Remove 'active' class from background star
  }

  handlePointerUp(e) {
    e.preventDefault();
    this.isDrawing = false;
    this.isPressing = false;
    this.points.length = 0;

    const width = this.canvas.temp.width;
    const height = this.canvas.temp.height;

    // Draw the temporary canvas content onto the main drawing canvas
    this.context.drawing.drawImage(this.canvas.temp, 0, 0, width, height);

    // Clear the temporary canvas
    this.context.temp.clearRect(0, 0, width, height);
    // Save the current canvas state
    this.saveDrawingState();
  }

  saveDrawingState() {
    const imageData = this.context.drawing.getImageData(
      0,
      0,
      this.canvas.drawing.width,
      this.canvas.drawing.height
    );
    this.drawingHistory.push(imageData);
  }

  undo() {
    if (this.drawingHistory.length > 1) {
      this.drawingHistory.pop(); // Remove the last state
      const previousState = this.drawingHistory[this.drawingHistory.length - 1];
      this.context.drawing.putImageData(previousState, 0, 0);
      this.context.temp.clearRect(
        0,
        0,
        this.canvas.temp.width,
        this.canvas.temp.height
      );
    } else if (this.drawingHistory.length === 1) {
      // If only one state left, clear the canvas
      this.clearCanvas();
      this.drawingHistory = [];
    }
  }

  handlePointerMove(x, y) {
    this.updateCursorPosition(x, y);

    // Scale the coordinates
    const scaleX = this.canvas.temp.width / this.displayWidth;
    const scaleY = this.canvas.temp.height / this.displayHeight;

    x = x * scaleX;
    y = y * scaleY;

    const hasChanged = this.lazy.update({ x: x, y: y });
    const isDisabled = !this.lazy.isEnabled();

    this.context.temp.lineJoin = "round";
    this.context.temp.lineCap = "round";
    this.context.temp.strokeStyle = this.isErasing ? BG_COLOR : STROKE_COLOR;
    this.context.temp.lineWidth = this.isErasing
      ? this.eraserRadius * 2 * scaleX
      : this.brushRadius * 2 * scaleX; // Scale the brush size

    const isOverButton =
      document.querySelectorAll("#sidebar button:hover").length > 0;

    if (!isOverButton) {
      this.updateCursorPosition(x, y);
      this.showCursor();
    } else {
      this.hideCursor();
    }

    if (
      (this.isPressing && hasChanged && !this.isDrawing) ||
      (isDisabled && this.isPressing)
    ) {
      this.isDrawing = true;
      this.points.push(this.lazy.brush.toObject());
    }

    if (this.isDrawing && (this.lazy.brushHasMoved() || isDisabled)) {
      this.context.temp.clearRect(
        0,
        0,
        this.canvas.temp.width,
        this.canvas.temp.height
      );
      this.points.push(this.lazy.brush.toObject());

      var p1 = this.points[0];
      var p2 = this.points[1];

      this.context.temp.moveTo(p2.x, p2.y);
      this.context.temp.beginPath();
      for (var i = 1, len = this.points.length; i < len; i++) {
        var midPoint = midPointBtw(p1, p2);
        this.context.temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = this.points[i];
        p2 = this.points[i + 1];
      }
      this.context.temp.lineTo(p1.x, p1.y);
      this.context.temp.stroke();
    }

    this.mouseHasMoved = true;
  }

  handleCanvasResize(entries, observer) {
    for (const entry of entries) {
      const rect = this.canvasContainer.getBoundingClientRect();
      this.displayWidth = rect.width;
      this.displayHeight = rect.height;
      this.dpi = this.setCanvasSize(
        this.canvas.interface,
        this.displayWidth,
        this.displayHeight,
        1.25
      );
      this.setCanvasSize(
        this.canvas.drawing,
        this.displayWidth,
        this.displayHeight,
        1
      );
      this.setCanvasSize(
        this.canvas.temp,
        this.displayWidth,
        this.displayHeight,
        1
      );
      this.loop({ once: true });
      this.restoreCursorOpacity(); // Add this line
    }
  }

  handleSidebarResize(entries, observer) {
    for (const entry of entries) {
      this.loop({ once: true });
    }
  }
  removeBgStarActiveClass() {
    const bgStar = document.querySelector(".bg-star");
    if (bgStar) {
      bgStar.classList.remove("active");
    }
  }

  setCanvasSize(canvas, width, height, maxDpi = 4) {
    this.dpi = window.devicePixelRatio;
    if (window.innerWidth > 1024) {
      this.dpi = Math.min(this.dpi, maxDpi);
    }
    canvas.width = width * this.dpi;
    canvas.height = height * this.dpi;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return this.dpi;
  }

  loop({ once } = {}) {
    if (!this.mouseHasMoved) {
      return;
    }
    this.mouseHasMoved = false;
    if (!this.valuesChanged) {
      return;
    }
    this.valuesChanged = false;
    this.clearCanvas();
  }

  clearCanvas() {
    const width = this.canvas.temp.width;
    const height = this.canvas.temp.height;
    this.context.drawing.clearRect(0, 0, width, height);
    this.context.temp.clearRect(0, 0, width, height);
  }
}
