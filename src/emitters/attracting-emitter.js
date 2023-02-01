import { Particle } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { BaseEmitter } from './base-emitter.js';

export class AttractingEmitter extends BaseEmitter {

    constructor(position, particleCount, context) {
        super(position, particleCount, context);
    }

    init() {
        const color1 = Color.getRandom(64);
        const color2 = Color.getRandom(64);
        for (let i = 0; i < this.particleCount; i++) {
            // Randomly select between the 2 colors
            const color = (Math.random() > 0.5) ? color1 : color2;
            const p = new Particle(this.position.add(Vec2.getRandom(-150, 150)), 2, color);

            p.acceleration.x = Utils.getRandom(-10, 10);
            p.acceleration.y = Utils.getRandom(-10, 10);

            const randomLength = Utils.getRandom(10, 20);
            p.velocity = new Vec2(
                randomLength * Math.cos(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)),
                randomLength * Math.sin(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI))
            );

            p.timeToLive = Utils.getRandom(3, 7);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {
        const gravityLength = Utils.getRandom(5, 35);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.update(deltaTime);

            if (p.dead === false) {
                p.rotation += deltaTime;

                p.acceleration = p.acceleration.add(Vec2.getRandom(-150, 150));
                p.velocity = p.velocity.add(p.acceleration.multiply(deltaTime * deltaTime));

                // Attract towards emitter
                let g = this.position.subtract(p.position)
                    .add(Vec2.getRandom(-10, 10));

                p.velocity = p.velocity.add(g.normalize().multiply(gravityLength));

                p.position = p.position.add(p.velocity.multiply(deltaTime));

                // Constraint to screen boundaries
                p.constraint(this.context, deltaTime);

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
