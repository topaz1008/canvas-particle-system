import { Vec2 } from '../math/vec2.js';

/**
 * Represents an axis aligned bounding box.
 */
export class AABB {
    min = null;
    max = null;

    constructor(...params) {
        // if params.length === 0
        this.min = new Vec2(0, 0);
        this.max = new Vec2(0, 0);

        if (params.length === 1) {
            // Same Vec2 for both min and max
            this.min = this.max = params[0];

        } else if (params.length === 2) {
            // Different Vec2 for min and max
            this.min = params[0];
            this.max = params[1];

        } else if (params.length === 4) {
            // 4 numbers; minX, minY, maxX, maxY
            this.min.x = params[0];
            this.min.y = params[1];
            this.max.x = params[2];
            this.max.y = params[3];
        }
    }
}
