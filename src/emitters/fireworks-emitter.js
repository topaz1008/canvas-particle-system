import { Particle, ParticleUpdateMode } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Utils } from '../common/utils.js';
import { Color } from '../common/color.js';
import { SimpleEmitter } from './simple-emitter.js';

export class FireworksEmitter extends SimpleEmitter {
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

        // Create a new particle with a 15% chance until the emitter is dead
        if (Math.random() > 0.85) {
            const position = this.position.add(Vec2.getRandom(-3, 3));
            const p = new Particle(position, Utils.getRandom(0.2, 0.75), this.color, this.options);

            p.explodeAfter = Utils.getRandom(0.1, 0.3);

            p.velocity = new Vec2(Utils.getRandom(-3, 3), Utils.getRandom(-15, -10))
                .normalize()
                .multiply(Utils.getRandom(20, 30));

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
            p.timeAlive += deltaTime;
            if (p.timeAlive >= p.timeToLive) {
                p.dead = true;
            }

            if (p.dead === false) {
                p.rotation += (2.5 * Math.atan2(p.velocity.y, p.velocity.x) - this.theta) * (180 / Math.PI) * deltaTime;

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
                    this.#createExplosion(p.position);
                }

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

    #createExplosion(position) {
        const COUNT = 15;
        const options = {
            singleColor: true,
            updateMode: ParticleUpdateMode.KILL
        };
        for (let i = 0; i < COUNT; i++) {
            const color = new Color(
                Utils.getRandomInt(30, 255),
                Utils.getRandomInt(30, 255),
                Utils.getRandomInt(30, 255)
            );
            const p = new Particle(position.clone(), Utils.getRandom(0.7, 1.5), color, options);

            // p.velocity = Vec2.getRandom(-3, 3)
            //     .normalize()
            //     .multiply(Utils.getRandom(30, 50));
            p.velocity = new Vec2(
                Math.cos(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)),
                Math.sin(2 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI)))
                .normalize()
                .multiply(Utils.getRandom(2, 6));

            p.timeToLive = Utils.getRandom(0.1, 0.4);
            this.particles.push(p);
        }
    }
}
