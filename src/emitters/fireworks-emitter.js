import { Particle, ParticleUpdateMode } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { BaseEmitter } from './base-emitter.js';

export class FireworksEmitter extends BaseEmitter {
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
        // this.color = Color.getRandom(30);
        this.color = new Color(255, 255, 255);
    }

    init() {
        // No init needed here, we create all particles on-the-fly
    }

    update(deltaTime) {
        this.theta += deltaTime;
        if (this.theta > (2 * Math.PI)) this.theta = 0;

        // Create a new particle with a 10% chance until the emitter is dead
        if (Math.random() > 0.90) {
            // Jitter the particle's position a little
            const position = this.position.add(Vec2.getRandom(-3, 3));
            const p = new Particle(position, 1, this.color, this.options);

            p.velocity = new Vec2(Utils.getRandom(-3, 3), Utils.getRandom(-15, -10))
                .normalize()
                .multiply(Utils.getRandom(10, 20));

            // Random explode time
            p.explodeAfter = Utils.getRandom(0.2, 0.4);
            p.exploded = false;

            // Size and lifetime
            p.timeToLive = Utils.getRandom(1, 3);
            this.particles.push(p);
        }

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
                p.rotation += (2.5 * Math.atan2(p.velocity.y, p.velocity.x) - this.theta) * deltaTime;

                const acceleration = new Vec2(
                    10 * Math.cos(p.rotation - this.theta),
                    10 * Math.sin(p.rotation - 2 * this.theta)
                );
                p.acceleration = p.acceleration.add(acceleration);
                p.velocity = p.velocity.add(p.acceleration.multiply(deltaTime * deltaTime))
                    .add(new Vec2(Utils.getRandom(-1, 1), 0));

                p.position = p.position.add(p.velocity);

                // Explode?
                if (p.timeAlive > p.explodeAfter && p.exploded === false) {
                    // After some random time we create
                    // an explosion at this particle's position
                    p.exploded = true;
                    this.particles.splice(i, 1);
                    this.#createExplosion(p.position);
                }

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
    }

    #createExplosion(position) {
        const COUNT = 20;
        const options = {
            singleColor: true,
            updateMode: ParticleUpdateMode.KILL
        };
        const color1 = Color.getRandom(64);
        const color2 = Color.getRandom(64);
        for (let i = 0; i < COUNT; i++) {
            // Randomly select between the 2 colors
            const type = (Math.random() > 0.5) ? 0 : 1;
            const color = (type === 0) ? color1 : color2;
            const p = new Particle(position.clone(), Utils.getRandom(0.7, 1.5), color, options);

            // Get a random velocity on the unit circle and randomly scale it
            p.velocity = new Vec2(
                Math.cos(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)),
                Math.sin(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)))
                .normalize()
                .multiply(Utils.getRandom(2, 6));

            if (type === 0) {
                p.timeToLive = Utils.getRandom(0.1, 0.5);

            } else {
                p.timeToLive = Utils.getRandom(0.3, 0.6);
            }

            this.particles.push(p);
        }
    }
}
