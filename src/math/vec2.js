import { Utils } from '../common/utils.js';

/**
 * 2D vector class.
 */
export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(rhs) {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }

    subtract(rhs) {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }

    multiply(t) {
        return new Vec2(this.x * t, this.y * t);
    }

    divide(t) {
        return new Vec2(this.x / t, this.y / t);
    }

    dot(rhs) {
        return ((this.x * rhs.x) + (this.y * rhs.y));
    }

    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    magnitudeSquared() {
        return ((this.x * this.x) + (this.y * this.y));
    }

    normalize() {
        const invNorm = 1 / this.magnitude();
        return new Vec2(this.x * invNorm, this.y * invNorm);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    static getRandom(min, max) {
        return new Vec2(Utils.getRandom(min, max), Utils.getRandom(min, max));
    }
}
