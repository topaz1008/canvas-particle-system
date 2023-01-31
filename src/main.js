import { ParticleSystem } from './particle-system.js';
import { SimpleEmitter } from './emitters/simple-emitter.js';
import { AttractingEmitter } from './emitters/attracting-emitter.js';
import { PerlinEmitter } from './emitters/perlin-emitter.js';
import { SprayEmitter } from './emitters/spray-emitter.js';
import { FireworksEmitter } from './emitters/fireworks-emitter.js';

import { UIControlElement } from './gui/ui-control-element.js';
import { Vec2 } from './math/vec2.js';

// App constants
const VIEW_WIDTH = 1280,
    VIEW_HEIGHT = 720;

// Most emitter types will only create this many particles
// unless they create particles on-the-fly; then this is ignored
const PARTICLE_COUNT = 100;

// Dropdown value -> constructor map
const emittersMap = {
    simple: SimpleEmitter,
    attracting: AttractingEmitter,
    perlin: PerlinEmitter,
    spray: SprayEmitter,
    fireworks: FireworksEmitter
};

// Globals
const canvas = document.getElementById('main-canvas'),
    context = canvas.getContext('2d');

let lastTime = Date.now(),
    activeEmitterType = 'attracting',
    system = new ParticleSystem(),
    viewWidth,
    viewHeight;

// Set up the gui
const btnClear = new UIControlElement('#btn-clear[role=button]');
btnClear.on('click', (e) => {
    e.preventDefault();
    system = new ParticleSystem();
});

const dropdownEmitterType = new UIControlElement('#emitter-type[role=combobox]');
dropdownEmitterType.on('change', (e) => {
    e.preventDefault();
    const target = e.target;
    console.log(`Active emitter type: ${target.value}`);
    activeEmitterType = target.value;
});

setViewportSize();
setRenderStates();

window.addEventListener('resize', (e) => {
    setViewportSize();
    setRenderStates();

}, false);

window.addEventListener('DOMContentLoaded', (e) => {
    // Add emitter on load
    addEmitter(1, PARTICLE_COUNT, new Vec2(canvas.width / 2, canvas.height / 2));
});

canvas.addEventListener('mousedown', (e) => {

    addEmitter(1, PARTICLE_COUNT, new Vec2(e.offsetX, e.offsetY));

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
    canvas.width = viewWidth = VIEW_WIDTH;
    canvas.height = viewHeight = VIEW_HEIGHT;
}

function setRenderStates() {
    // Blending mode
    context.globalCompositeOperation = 'screen';
    context.imageSmoothingEnabled = false;
}

function addEmitter(numOfEmitters, numOfParticles, position) {

    // Get the constructor for the active emitter type
    const Constructor = emittersMap[activeEmitterType];

    for (let i = 0; i < numOfEmitters; i++) {
        const emitter = new Constructor(position, numOfParticles, context);
        emitter.init();

        system.addEmitter(emitter);
    }
}
