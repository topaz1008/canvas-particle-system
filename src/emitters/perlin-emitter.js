import { Utils } from '../common/utils.js';
import { module as noisejs } from '../../vendors/perlin.js';
import { ParticleEmitter } from './particle-emitter.js';
import { Particle } from '../particle.js';
import { Vec2 } from '../math/vec2.js';

export class PerlinEmitter extends ParticleEmitter {
    perlin = null;

    constructor(position, particleCount, context) {
        noisejs.seed(Math.random());
        super(position, particleCount, context);

        const width = 1280;
        const height = 720;
        this.perlin = this.context.createImageData(width, height);
    }

    init() {
        const viewWidth = 1280;
        const viewHeight = 720;

        for (let x = 0; x < viewWidth; x++) {
            for (let y = 0; y < viewHeight; y++) {
                let value = Math.abs(noisejs.perlin2(x / 100, y / 100));
                value *= 256;

                const cell = Math.floor((x + y * viewWidth) * 4);

                this.perlin.data[cell] = this.perlin.data[cell + 1] = this.perlin[cell + 2] = value;

                this.perlin.data[cell] += Math.max(0, (25 + value) * 16);
                this.perlin.data[cell + 3] = 255; // alpha
            }
        }

        for (let i = 0; i < this.particleCount; i++) {
            const position = Vec2.getRandom(-150, 150);

            const p = new Particle(this.position.add(position), 2, {
                r: 255, g: 255, b: 255, a: 1
            });

            p.timeToLive = Utils.getRandom(10, 20);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.timeAlive += deltaTime;
            if (p.timeAlive >= p.timeToLive) {
                p.dead = true;
            }

            if (p.dead === false) {
                p.rotation += deltaTime;

                const x = p.position.x;
                const y = p.position.y;

                const viewWidth = this.context.width;
                const viewHeight = this.context.height;

                const cell = Math.floor((x + y * viewWidth) * 4);
                const r = this.perlin.data[cell] >> 16;
                const g = this.perlin.data[cell + 1] >> 8 & 255;
                const b = this.perlin.data[cell + 2] & 255;

                p.velocity.x += (r - b) / 4;
                p.velocity.y += (g - b) / 4;

                p.position.x += p.velocity.x * 1000;
                p.position.y += p.velocity.y * 1000;

                p.draw(this.context);
            }

            if (p.dead === true) {
                // Remove dead particles.
                this.particles.splice(i, 1);

                // If no particles are left kill emitter
                if (this.particles.length === 0) {
                    this.dead = true;
                }
            }
        }
    }
}
