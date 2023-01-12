import { Utils } from '../common/utils.js';

export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(rhs) {
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    subtract(rhs) {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    multiply(t) {
        return new Vec3(this.x * t, this.y * t, this.z * t);
    }

    divide(t) {
        const inv = 1 / t;
        return new Vec3(this.x * inv, this.y * inv, this.z * inv);
    }

    dot(rhs) {
        return ((this.x * rhs.x) + (this.y * rhs.y) + (this.z * rhs.z));
    }

    norm() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    normSquared() {
        return ((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    normalize() {
        const invNorm = 1 / this.norm();
        return new Vec3(this.x * invNorm, this.y * invNorm, this.z * invNorm);
    }

    static getRandom(min, max) {
        return new Vec3(Utils.getRandom(min, max), Utils.getRandom(min, max), Utils.getRandom(min, max));
    }
}
