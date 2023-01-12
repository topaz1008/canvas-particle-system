import { ParticleEmitter } from './particle-emitter.js';
import { ParticleSystem } from './particle-system.js';

// Globals
const canvas = document.getElementById('main'),
    context = canvas.getContext('2d');

let lastTime = Date.now(),
    viewWidth,
    viewHeight;

const system = new ParticleSystem();

setViewportSize();
setRenderStates();

window.addEventListener('resize', (e) => {
    setViewportSize();
    setRenderStates();

}, false);

canvas.addEventListener('mousedown', (e) => {

    addEmitter(1, e.offsetX, e.offsetY);

}, false);

update();

// Update loop
function update(time) {
    // Real time passed since the last call to this function
    const deltaTime = (Date.now() - lastTime) / 1000;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    system.update(deltaTime);

    lastTime = Date.now();

    requestAnimationFrame(update);
}


// Set canvas and view size
function setViewportSize() {
    canvas.width = viewWidth = window.innerWidth - 20;
    canvas.height = viewHeight = window.innerHeight - 20;
}

function setRenderStates() {
    // Blending mode
    context.globalCompositeOperation = 'screen';
    context.imageSmoothingEnabled = false;
}

function addEmitter(num, x, y) {
    const COUNT = 150;
    for (let i = 0; i < num; i++) {
        const emitter = new ParticleEmitter(x, y, COUNT, context);
        system.addEmitter(emitter);
    }
}
