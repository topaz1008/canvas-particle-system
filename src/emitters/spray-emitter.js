import { Particle, ParticleUpdateMode } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { BaseEmitter } from './base-emitter.js';

export class SprayEmitter extends BaseEmitter {
    emitterTimeAlive = 0;
    emitterTimeToLive = 3;

    constructor(position, particleCount, context) {
        super(position, particleCount, context);

        // Reset array
        this.particles = [];
        this.particleCount = particleCount;

        this.options = {
            singleColor: true,
            updateMode: ParticleUpdateMode.KILL
        };

        // Color
        this.color = new Color(
            Utils.getRandom(30, 255),
            Utils.getRandom(30, 255),
            Utils.getRandom(30, 255)
        );
    }

    init() {
        // No init needed here, we create all particles on-the-fly
    }

    update(deltaTime) {
        this.theta += deltaTime;
        if (this.theta > (2 * Math.PI)) this.theta = 0;

        // Create a new particle every frame until emitter is dead
        const position = this.position.add(Vec2.getRandom(-3, 3));
        const p = new Particle(position, Utils.getRandom(0.5, 1), this.color, this.options);

        p.velocity = new Vec2(Utils.getRandom(-3, 3), Utils.getRandom(-15, -10))
            .normalize()
            .multiply(Utils.getRandom(10, 15));

        // Size and lifetime
        p.timeToLive = Utils.getRandom(1, 8);
        this.particles.push(p);

        this.emitterTimeAlive += deltaTime;
        if (this.emitterTimeAlive >= this.emitterTimeToLive) {
            // Kill emitter
            this.dead = true;
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.rotation += this.theta;
            p.timeAlive += deltaTime;
            if (p.timeAlive >= p.timeToLive) {
                p.dead = true;
            }

            if (p.dead === false) {
                p.rotation += (2.5 * Math.atan2(p.velocity.y, p.velocity.x) - this.theta) * (180 / Math.PI) * deltaTime;

                const acceleration = new Vec2(
                    5 * Math.cos(p.rotation - this.theta),
                    -Math.sin(p.rotation - 2 * this.theta)
                );
                p.acceleration = p.acceleration.add(acceleration);
                p.velocity = p.velocity.add(p.acceleration.multiply(deltaTime * deltaTime))
                    .add(new Vec2(Utils.getRandom(-1, 1), 0))
                    .add(new Vec2(0, Utils.getRandom(-0.5, 2))); // Gravity
                p.position = p.position.add(p.velocity);

                // Constraint to screen boundaries
                p.constraint(this.context, deltaTime, false);
                p.draw(this.context);
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
    }
}
