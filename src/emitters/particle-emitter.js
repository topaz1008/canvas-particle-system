import { Particle } from '../particle.js';
import { Vec2 } from '../math/vec2.js';
import { Vec3 } from '../math/vec3.js';
import { Utils } from '../common/utils.js';

export class ParticleEmitter {
    position = new Vec2(0, 0);

    constructor(position, particleCount, context) {
        this.position = position;
        this.particles = new Array(particleCount);
        this.particleCount = particleCount;
        this.dead = false;

        this.context = context;

        //this.startColor = new Vec3(Utils.getRandom(50, 255), Utils.getRandom(50, 255), Utils.getRandom(50, 255));
        //this.endColor = new Vec3(Utils.getRandom(50, 255), Utils.getRandom(50, 255), Utils.getRandom(50, 255));

        // this.init();
    }

    init() {
        const r = Utils.getRandom(30, 255);
        const g = Utils.getRandom(30, 255);
        const b = Utils.getRandom(30, 255);

        for (let i = 0; i < this.particleCount; i++) {
            const p = new Particle(this.position.add(Vec2.getRandom(-150, 150)), 2, {
                r, g, b, a: 1
            });

            p.acceleration.x = Utils.getRandom(-10, 10);
            p.acceleration.y = Utils.getRandom(-10, 10);

            const randomLength = Utils.getRandom(10, 20);
            p.velocity.x = randomLength * Math.cos(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI));
            p.velocity.y = randomLength * Math.sin(10 * i / Math.PI - Utils.getRandom(-Math.PI, Math.PI));

            p.timeToLive = Utils.getRandom(5, 12);

            this.particles[i] = p;
        }
    }

    update(deltaTime) {
        const gl = Utils.getRandom(20, 50);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!p) continue;

            p.timeAlive += deltaTime;
            if (p.timeAlive >= p.timeToLive) {
                p.dead = true;
            }

            if (p.dead === false) {
                p.rotation += deltaTime;

                p.acceleration.x += Utils.getRandom(-200, 200);
                p.acceleration.y += Utils.getRandom(-200, 200);

                p.velocity.x += p.acceleration.x * (deltaTime * deltaTime);
                p.velocity.y += p.acceleration.y * (deltaTime * deltaTime);

                // Attract towards emitter
                let gx = this.position.x - p.position.x;
                let gy = this.position.y - p.position.y;
                gx += Utils.getRandom(-10, 10);
                gy += Utils.getRandom(-10, 10);

                const norm = Math.sqrt((gx * gx) + (gy * gy));
                gx /= norm; gy /= norm;
                gx *= gl; gy *= gl;

                p.velocity.x += gx;
                p.velocity.y += gy;

                p.position.x += p.velocity.x * deltaTime;
                p.position.y += p.velocity.y * deltaTime;

                // Bounce off boundaries
                const halfSize = p.size / 2;
                const viewWidth = this.context.width;
                const viewHeight = this.context.height;
                if (p.position.x > viewWidth - halfSize) {
                    p.position.x = viewWidth - halfSize;
                    p.velocity.x *= -1;

                } else if (p.position.x < halfSize) {
                    p.position.x = halfSize;
                    p.velocity.x *= -1;
                }

                if (p.position.y > viewHeight - halfSize) {
                    p.position.y = viewHeight - halfSize;
                    p.velocity.y *= -1;

                } else if (p.position.y < halfSize) {
                    p.position.y = halfSize;
                    p.velocity.y *= -1;
                }

                p.color.a = (1 - p.timeAlive / p.timeToLive);
                p.size -= (p.timeAlive / p.timeToLive) * deltaTime;
                if (p.size <= 1) {
                    p.size = 1;
                }

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
