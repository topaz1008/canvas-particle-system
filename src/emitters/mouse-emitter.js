import { Particle, ParticleUpdateMode } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { BaseEmitter } from './base-emitter.js';

export class MouseEmitter extends BaseEmitter {
    emitterTimeAlive = 0;
    emitterTimeToLive = 6;
    mousePosition = new Vec2(0, 0);
    oldMousePosition = new Vec2(0, 0);
    particlesCreated = 0;

    constructor(position, particleCount, context) {
        super(position, particleCount, context);

        // Reset array
        this.particles = [];
        this.particleCount = particleCount;

        this.options = {
            singleColor: false,
            updateMode: ParticleUpdateMode.KILL
        };

        // Color
        this.color = Color.getRandom(64);
    }

    init(canvas) {
        canvas.addEventListener('mousemove', (e) => {
            this.mousePosition = new Vec2(e.offsetX, e.offsetY);
        }, false);
    }

    update(deltaTime) {
        if ((this.particlesCreated % 20) === 0) {
            // Generate a new color every 20 particles.
            this.color = Color.getRandom(64);
        }

        const p = new Particle(this.mousePosition, Utils.getRandom(1, 3), this.color, this.options);

        p.velocity = this.mousePosition.subtract(this.oldMousePosition)
            .normalize()
            .multiply(Utils.getRandom(2, 3))
            .add(new Vec2(0, 0));

        // Size and lifetime
        p.timeToLive = Utils.getRandom(1, 3);
        this.particles.push(p);
        this.particlesCreated++;

        this.emitterTimeAlive += deltaTime;
        if (this.emitterTimeAlive >= this.emitterTimeToLive) {
            // Kill emitter
            this.dead = true;
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.rotation += this.theta;
            p.update(deltaTime);

            if (p.dead === false) {
                p.velocity = p.velocity.add(new Vec2(0, Utils.getRandom(0.05, 0.2)));

                p.position = p.position.add(p.velocity);

                // Constraint to screen boundaries
                p.constraint(this.context, deltaTime, false);
                p.draw(this.context, false);
            }

            if (p.dead === true) {
                // Remove dead particles.
                this.particles.splice(i, 1);
            }

            // If no particles are left kill emitter
            if (this.particles.length === 0) {
                this.dead = true;
            }
        }

        // Old position is the current position
        this.oldMousePosition = this.mousePosition.clone();
    }
}
