import { Particle } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { BaseEmitter } from './base-emitter.js';

export class TunnelEmitter extends BaseEmitter {

    constructor(position, particleCount, context) {
        super(position, particleCount, context);

        this.particleCount = 150;
    }

    init() {
        const color = Color.getRandom(64);
        for (let i = 0; i < this.particleCount; i++) {
            // const p = new Particle(this.position.clone(), 2, color);
            //
            // p.velocity = Vec2.getRandom(-2, 2)
            //     .normalize()
            //     .multiply(Utils.getRandom(45, 55));
            //
            // p.timeToLive = Utils.getRandom(5, 8);
            // p.size = Utils.getRandom(0.5, 1.5);
            //
            // this.particles[i] = p;
            const p = new Particle(this.position.add(Vec2.getRandom(-100, 100)), 2, color);

            p.acceleration.x = Utils.getRandom(-10, 10);
            p.acceleration.y = Utils.getRandom(-10, 10);

            const randomLength = Utils.getRandom(10, 20);
            p.velocity = new Vec2(
                randomLength * Math.cos(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)),
                randomLength * Math.sin(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI))
            );

            p.timeToLive = Utils.getRandom(5, 12);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {
        const gl = Utils.getRandom(20, 50);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.update(deltaTime);

            if (p.dead === false) {
                p.rotation += deltaTime;

                p.acceleration = p.acceleration.add(Vec2.getRandom(-200, 200));
                p.velocity = p.velocity.add(p.acceleration.multiply(deltaTime * deltaTime));

                // Attract towards emitter
                let g = this.position.subtract(p.position)
                    .add(Vec2.getRandom(-10, 10));

                p.velocity = p.velocity.add(g.normalize().multiply(gl));

                // p.position = p.position.add(p.velocity.multiply(deltaTime));

                p.position.x += p.velocity.x * deltaTime;
                p.position.y += -p.velocity.y * deltaTime * deltaTime;

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
