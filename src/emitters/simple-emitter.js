import { Particle } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';

export class SimpleEmitter {
    position = new Vec2(0, 0);
    dead = false;
    theta = 0;

    constructor(position, particleCount, context) {
        this.position = position;
        this.particles = new Array(particleCount);
        this.particleCount = particleCount;

        this.context = context;
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            const color = new Color(
                Utils.getRandom(30, 255),
                Utils.getRandom(30, 255),
                Utils.getRandom(30, 255)
            );

            const size = Utils.getRandom(0.5, 2);

            const p = new Particle(this.position.clone(), size, color);

            p.velocity = new Vec2(
                Math.cos(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)),
                Math.sin(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)))
                    .normalize()
                    .multiply(Utils.getRandom(2, 6));

            p.timeToLive = Utils.getRandom(4, 7);

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
                p.acceleration = p.acceleration.add(Vec2.getRandom(-5, 5));
                p.velocity = p.velocity.add(p.acceleration.multiply(deltaTime));
                p.position = p.position.add(p.velocity);

                // Constraint to screen boundaries
                p.constraint(this.context, deltaTime);
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
