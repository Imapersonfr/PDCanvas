// script.js
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const clearBtn = document.getElementById('clearBtn');
const customColor = document.getElementById('customColor');

// Set initial drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let currentSize = 2;
let canvasOffset = { x: 0, y: 0 };

// Set canvas background to white
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set initial drawing styles
ctx.strokeStyle = currentColor;
ctx.lineWidth = currentSize;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// Update canvas offset when page loads
window.addEventListener('load', updateCanvasOffset);

// Update canvas offset on window resize
window.addEventListener('resize', updateCanvasOffset);

function updateCanvasOffset() {
    const rect = canvas.getBoundingClientRect();
    canvasOffset = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

// Color selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        colorOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        option.classList.add('active');
        // Set current color
        currentColor = option.dataset.color;
        ctx.strokeStyle = currentColor;
    });
});

// Custom color selection
customColor.addEventListener('input', () => {
    currentColor = customColor.value;
    ctx.strokeStyle = currentColor;
    // Remove active class from all color options
    colorOptions.forEach(opt => opt.classList.remove('active'));
});

// Brush size selection
sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        option.classList.add('active');
        // Set current size
        currentSize = parseInt(option.dataset.size);
        ctx.lineWidth = currentSize;
    });
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Drawing functions
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    [lastX, lastY] = [pos.x, pos.y];
}

function draw(e) {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    [lastX, lastY] = [pos.x, pos.y];
}

function stopDrawing() {
    isDrawing = false;
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});
