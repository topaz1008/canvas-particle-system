import { Particle } from './particle.js';

export class ParticleEmitter {

    constructor(x, y, particleCount, context) {
        this.particles = new Array(particleCount);
        this.particleCount = particleCount;
        this.x = x;
        this.y = y;
        // this.theta = 0;
        this.dead = false;

        this.context = context;

        this.init();
    }

    init() {
        const r = this.#getRandom(30, 255);
        const g = this.#getRandom(30, 255);
        const b = this.#getRandom(30, 255);

        for (let i = 0; i < this.particleCount; i++) {
            const p = new Particle(this.x, this.y, 2, {
                r, g, b, a: 1
            });

            p.ax = this.#getRandom(-100, 100);
            p.ay = this.#getRandom(-100, 100);

            const randomLength = this.#getRandom(100, 200);
            p.vx = randomLength * Math.cos(2 * i / Math.PI - this.#getRandom(-Math.PI, Math.PI));
            p.vy = randomLength * Math.sin(2 * i / Math.PI - this.#getRandom(-Math.PI, Math.PI));

            p.timeToLive = this.#getRandom(7, 12);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {
        const gl = this.#getRandom(2, 15);

        // this.theta += deltaTime;
        // if (this.theta >= 2 * Math.PI) {
        //     this.theta = 0;
        // }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) {
                continue;
            }

            p.timeAlive += deltaTime;
            if (p.timeAlive >= p.timeToLive) {
                p.dead = true;
            }

            if (p.dead === false) {
                p.rotation += deltaTime;

                p.ax += this.#getRandom(-250, 250);
                p.ay += this.#getRandom(-250, 250);

                p.vx += p.ax * (deltaTime * deltaTime);
                p.vy += p.ay * (deltaTime * deltaTime);

                // Attract towards emitter
                let gx = this.x - p.x;
                let gy = this.y - p.y;
                gx += this.#getRandom(-50, 50);
                gy += this.#getRandom(-50, 50);

                const norm = Math.sqrt((gx * gx) + (gy * gy));
                gx /= norm; gy /= norm;
                gx *= gl; gy *= gl;

                p.vx += gx;
                p.vy += gy;

                p.x += p.vx * deltaTime;
                p.y += p.vy * deltaTime;

                //p.rgbaColor.a = (1 - p.timeAlive / p.timeToLive);
                // p.size -= (p.timeAlive / p.timeToLive) * deltaTime;
                // if (p.size <= 1) {
                //     p.size = 1;
                // }

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

    #getRandom(min, max) {
        return min + Math.random() * ((max + 1) - min);
    }
}
