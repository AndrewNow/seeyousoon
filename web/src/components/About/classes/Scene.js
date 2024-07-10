import { LazyBrush } from "lazy-brush";
import { Catenary } from 'catenary-curve';
import ResizeObserver from 'resize-observer-polyfill';

const LAZY_RADIUS = 10;
const BRUSH_RADIUS = 6;
const STROKE_COLOR = "#F9F8F3"

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
        y: p1.y + (p2.y - p1.y) / 2
    };
}
export default class Scene {
    constructor({ canvasContainer, sidebar, canvas, button, cursor }) {
        this.cursor = document.getElementById(cursor);
        this.cursorTimeoutId = null;
        this.isCursorVisible = false;
        if (this.cursor) {
            this.cursor.style.display = 'none';
            this.cursor.style.position = 'absolute';
            this.cursor.style.pointerEvents = 'none';
            this.cursor.style.transition = 'opacity 0.3s ease'; // Add smooth transition for opacity
        }
        this.cursorPressed = false;
        
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;
        this.canvasContainer = document.getElementById(canvasContainer);
        this.sidebar = document.getElementById(sidebar);
        this.canvas = {};
        this.context = {};

        Object.keys(canvas).forEach(c => {
            const el = document.getElementById(canvas[c]);
            this.canvas[c] = el;
            this.context[c] = el.getContext('2d');
        });

        // this.slider = {};
        // Object.keys(slider).forEach(s => {
        //     this.slider[s] = document.getElementById(slider[s]);
        // });

        this.button = {};
        Object.keys(button).forEach(b => {
            this.button[b] = document.getElementById(button[b]);
        });

        this.catenary = new Catenary();
        this.lazy = new LazyBrush({
            radius: LAZY_RADIUS,
            enabled: true,
            initialPoint: {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            }
        });

        this.points = [];
        this.mouseHasMoved = true;
        this.valuesChanged = true;
        this.isDrawing = false;
        this.isPressing = false;
        this.brushRadius = BRUSH_RADIUS;
        this.chainLength = LAZY_RADIUS;
        this.dpi = 1;
    }

    init() {
        // Listeners for mouse events
        this.canvas.interface.addEventListener('mousedown', this.handlePointerDown.bind(this));
        this.canvas.interface.addEventListener('mouseup', this.handlePointerUp.bind(this));
        this.canvas.interface.addEventListener('mousemove', (e) => {
            const rect = this.canvas.interface.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handlePointerMove(x, y);
        });
        this.canvas.interface.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Listeners for touch events
        this.canvas.interface.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.interface.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.interface.addEventListener('touchmove', (e) => {
            const rect = this.canvas.interface.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            // mobileLog('printing this,', x, y)
            this.handleTouchMove(x, y);
        });

        // Listeners for click events on buttons
        // this.button.lazy.addEventListener('click', (e) => this.handleButtonLazy(e));
        this.button.clear.addEventListener('click', (e) => this.handleButtonClear(e));

        // // Listeners for input events on range sliders
        // this.slider.brush.addEventListener('input', (e) => this.handleSliderBrush(e));
        // this.slider.lazy.addEventListener('input', (e) => this.handleSliderLazy(e));

        // Set initial value for range sliders
        // this.slider.brush.value = BRUSH_RADIUS;
        // this.slider.lazy.value = LAZY_RADIUS;

        // Initialize ResizeObserver for canvas and sidebar
        const observeCanvas = new ResizeObserver((entries, observer) => this.handleCanvasResize(entries, observer));
        observeCanvas.observe(this.canvasContainer);

        const observeSidebar = new ResizeObserver((entries, observer) => this.handleSidebarResize(entries, observer));
        observeSidebar.observe(this.sidebar);

        // Initial setup timeout
        window.setTimeout(() => {
            const initX = window.innerWidth / 2;
            const initY = window.innerHeight / 2;
            this.lazy.update({x: initX - (this.chainLength / 4), y: initY}, { both: true });
            this.lazy.update({x: initX + (this.chainLength / 4), y: initY}, { both: false });
            this.mouseHasMoved = true;
            this.valuesChanged = true;
            this.clearCanvas();
        }, 100);


        // Update mouse enter and leave event listeners
        this.canvas.interface.addEventListener('mouseenter', () => {
            this.showCursor();
            this.resetCursorTimeout();
        });
        this.canvas.interface.addEventListener('mouseleave', () => {
            this.hideCursor();
            if (this.cursorTimeoutId) {
                clearTimeout(this.cursorTimeoutId);
            }
        });

        // Add mousemove event listener to the document
        document.addEventListener('mousemove', (e) => {
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
        this.lazy.update({x: x, y: y}, { both: true });
        this.handlePointerDown(e);
        this.mouseHasMoved = true;
    }

    handleTouchMove(x, y) {
        // mobileLog('handleTouchMove called:', x, y);
        this.handlePointerMove(x, y);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.handlePointerUp(e);
        const brush = this.lazy.getBrushCoordinates();
        this.lazy.update({x: brush.x, y: brush.y}, { both: true });
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

            const offsetX = 5;
            const offsetY = 5;

            let adjustedX = x + offsetX;
            let adjustedY = y - cursorHeight + offsetY;

            if (this.cursorPressed) {
                adjustedX += 10;
                adjustedY += 10;
            }

            this.cursor.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
            
            this.showCursor();
            this.resetCursorTimeout();
        }
    }

    showCursor() {
        if (this.cursor) {
            this.cursor.style.display = 'flex';
            setTimeout(() => {
                this.cursor.style.opacity = '1';
            }, 0);
            this.isCursorVisible = true;
        }
    }

    hideCursor() {
        if (this.cursor) {
            this.cursor.style.opacity = '0';
            setTimeout(() => {
                if (this.cursor.style.opacity === '0') {
                    this.cursor.style.display = 'none';
                }
            }, 300); // Match this to your transition duration
            this.isCursorVisible = false;
        }
    }

    fadeCursor() {
        if (this.cursor && this.isCursorVisible) {
            this.cursor.style.opacity = '0';
        }
    }

    resetCursorTimeout() {
        if (this.cursorTimeoutId) {
            clearTimeout(this.cursorTimeoutId);
        }
        this.cursorTimeoutId = setTimeout(() => this.fadeCursor(), 1500);
    }

    // handleButtonLazy(e) {
    //     e.preventDefault();
    //     this.valuesChanged = true;
    //     this.button.lazy.classList.toggle('disabled');
    //     if (this.lazy.isEnabled()) {
    //         this.button.lazy.innerHTML = 'Smoothing off';
    //         this.lazy.disable();
    //     } else {
    //         this.button.lazy.innerHTML = 'Smoothing on';
    //         this.lazy.enable();
    //     }
    // }

    handleButtonClear(e) {
        e.preventDefault();
        this.clearCanvas();
    }

    // handleSliderBrush(e) {
    //     const val = parseInt(e.target.value);
    //     this.valuesChanged = true;
    //     this.brushRadius = val;
    // }

    // handleSliderLazy(e) {
    //     const val = parseInt(e.target.value);
    //     this.valuesChanged = true;
    //     this.chainLength = val;
    //     this.lazy.setRadius(val);
    // }

    handlePointerDown(e) {
        e.preventDefault();
        const rect = this.canvas.interface.getBoundingClientRect();
        const x = e.clientX || e.touches[0].clientX - rect.left;
        const y = e.clientY || e.touches[0].clientY - rect.top;
        this.lazy.update({x: x, y: y}, { both: true });
        this.isPressing = true;
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
    }

    handlePointerMove(x, y) {
        // mobileLog('handlePointerMove called:', x, y);
        this.updateCursorPosition(x, y);

        // Scale the coordinates
        const scaleX = this.canvas.temp.width / this.displayWidth;
        const scaleY = this.canvas.temp.height / this.displayHeight;
        
        x = x * scaleX;
        y = y * scaleY;
        
        // mobileLog('Scaled coordinates:', x, y);
        
        const hasChanged = this.lazy.update({ x: x, y: y });
        const isDisabled = !this.lazy.isEnabled();
        
        this.context.temp.lineJoin = 'round';
        this.context.temp.lineCap = 'round';
        this.context.temp.strokeStyle = STROKE_COLOR;
        
        if ((this.isPressing && hasChanged && !this.isDrawing) || (isDisabled && this.isPressing)) {
            this.isDrawing = true;
            this.points.push(this.lazy.brush.toObject());
        }

        if (this.isDrawing && (this.lazy.brushHasMoved() || isDisabled)) {
            // mobileLog('Drawing:', x, y);
            this.context.temp.clearRect(0, 0, this.canvas.temp.width, this.canvas.temp.height);
            this.context.temp.lineWidth = this.brushRadius * 2 * scaleX; // Scale the brush size
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
            this.dpi = this.setCanvasSize(this.canvas.interface, this.displayWidth, this.displayHeight, 1.25);
            this.setCanvasSize(this.canvas.drawing, this.displayWidth, this.displayHeight, 1);
            this.setCanvasSize(this.canvas.temp, this.displayWidth, this.displayHeight, 1);
            this.loop({ once: true });
        }
    }

    handleSidebarResize(entries, observer) {
        for (const entry of entries) {
            this.loop({ once: true });
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