import { module as noisejs } from '../../vendors/perlin.js';

import { Utils } from '../common/utils.js';
import { Particle } from '../particle.js';
import { BaseEmitter } from './base-emitter.js';
import { Vec2 } from '../math/vec2.js';
import { Color } from '../common/color.js';

export class PerlinEmitter extends BaseEmitter {
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

        const perlin = this.perlin.data;

        for (let x = 0; x < viewWidth; x++) {
            for (let y = 0; y < viewHeight; y++) {
                let value = Math.abs(noisejs.perlin2(x / 50, y / 50));
                value *= 255;

                const cell = Math.floor((x + y * viewWidth) * 4);

                perlin[cell] = perlin[cell + 1] = perlin[cell + 2] = value;
                // perlin[cell] += Math.max(0, value);
                perlin[cell + 3] = 255; // alpha
            }
        }

        // Grayscale the perlin
        // for (let i = 0; i < perlin.length; i += 4) {
        //     const avg = (perlin[i] + perlin[i + 1] + perlin[i + 2]) / 3;
        //     perlin[i] = avg;     // R
        //     perlin[i + 1] = avg; // G
        //     perlin[i + 2] = avg; // B
        // }

        for (let i = 0; i < this.particleCount; i++) {
            const position = Vec2.getRandom(-50, 50);

            const color = new Color(255, 0, 0, 255);
            const p = new Particle(this.position.add(position), 2, color);

            p.velocity = Vec2.getRandom(-1, 1);
            p.timeToLive = Utils.getRandom(10, 20);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {

        // this.context.putImageData(this.perlin, 0, 0);
        const viewWidth = 1280;
        const viewHeight = 720;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.update(deltaTime);

            if (p.dead === false) {
                p.rotation += deltaTime;

                const cell = Math.floor((p.position.x + p.position.y * viewWidth) * 4);
                const r = this.perlin.data[cell];
                const g = this.perlin.data[cell + 1];
                const b = this.perlin.data[cell + 2];

                p.velocity.x += (r - b) / 4;
                p.velocity.y += (g - b) / 4;

                // Speed limit with no sqrt
                const MAX_SPEED = 200;
                p.velocity.x = Math.min(p.velocity.x, MAX_SPEED);
                p.velocity.y = Math.min(p.velocity.y, MAX_SPEED);
                p.velocity.x = Math.max(p.velocity.x, -MAX_SPEED);
                p.velocity.y = Math.max(p.velocity.y, -MAX_SPEED);

                p.position.x += p.velocity.x * deltaTime;
                p.position.y += p.velocity.y * deltaTime;

                p.draw(this.context, false);
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
