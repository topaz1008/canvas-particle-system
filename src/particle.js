import { Vec2 } from './math/vec2.js';
import { Utils } from './common/utils.js';
import { Color } from './common/color.js';

const PARTICLE_PNG_PATH = 'assets/particle.png';

// Particle png image (assets/particle.png converted to base64)
const PARTICLE_IMAGE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDODBBNUEzMzRBMTFFMUE3OEVBQkVEMTZGNUYyREEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDODBBNUIzMzRBMTFFMUE3OEVBQkVEMTZGNUYyREEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4MEE1ODMzNEExMUUxQTc4RUFCRUQxNkY1RjJEQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4MEE1OTMzNEExMUUxQTc4RUFCRUQxNkY1RjJEQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpKgAvcAAAFMSURBVHjadJNNTsMwEIXtxMVtWlGQgN6ADawQ979BWWUFJ4AVRQ1umzRlBn2GIQqWnvz35s342fbOuSA4Ck7ut3lBKSiY6143xvGQKkFCaCqYCc4Qd6zvBTt4AU7jIejCjeAgmAiWECbstwRvGKv4q1ZlM2jwHb0SLug92d8Fl4IoqDnST4mRbEp8pNf5HIGtYAVvjbBWmAIEnZxD0FIfqMSamIMjXPViH3A7YuTSVHKPmCNBDU85H4zLQJaSQF1cMNcMt1T4zHEX5rjfsYX72/zI+EQS70aaqvTcQkvpDUFa9gu8Ct4Wb1pi+mAeSeKqVrhcm1vqWevgJPw5BrIljLmCuOZFzhFoyDxFZINAnzPs2FBznozbkf2DCcoiyRqlgdcQ8z1Xg6ecEMkv9U3Xxz7TDETjQTf4TAWcT//Pdy4G3znfVD/8zl8CDABJRWjZo1juvQAAAABJRU5ErkJggg==';
const originalImage = new Image();
originalImage.src = PARTICLE_IMAGE_DATA;

/**
 * Particle update mode enum
 * What to do when a particle leaves the screen bounds.
 */
export class ParticleUpdateMode {
    static BOUNCE = 0;
    static WARP = 1;
    static KILL = 2;
}

/**
 * This class represents a single particle.
 *
 * TODO: Optimize image tinting.
 *       Create enough tinted images ahead of time which
 *       can then be referenced quickly instead of tinting in real-time.
 *       Can randomly create ~100 colored images and randomly select between them when needed.
 */
export class Particle {
    position = new Vec2(0, 0);
    velocity = new Vec2(0, 0);
    acceleration = new Vec2(0, 0);
    color = null;
    imageLoaded = false;
    updateMode = ParticleUpdateMode.BOUNCE;

    /**
     * @param position {Vec2}
     * @param size {Number}
     * @param color {Color=}
     * @param options {Object=}
     * @constructor
     */
    constructor(position, size, color, options) {
        this.position = position;
        this.size = size; // Image scaling

        this.color = color || new Color();
        this.dead = false;
        this.rotation = 0;
        this.timeToLive = 0;
        this.timeAlive = 0;

        // FIXME: temp; handle options properly
        //        maybe move all constructor
        //        parameters to the options object.
        if (!options) {
            options = {
                singleColor: true,
                updateMode: ParticleUpdateMode.BOUNCE
            };
        }

        this.options = options;
        this.updateMode = options.updateMode;

        const tintColor = Utils.makeRGBA(this.color.r, this.color.g, this.color.b, this.color.a);
        if (this.options.singleColor) {
            // Same color for all particles
            this.img = new Image();

            this.img.onload = () => {
                this.imageLoaded = true;
            };
            this.img.src = Utils.tintImage(originalImage, tintColor);

        } else {
            // Different color per particle
            const originalImage = new Image();
            originalImage.onload = () => {
                // Color transform the original image and use that
                this.img = new Image();

                this.img.onload = () => {
                    this.imageLoaded = true;
                };
                this.img.src = Utils.tintImage(originalImage, tintColor);
            };
            originalImage.src = PARTICLE_PNG_PATH;
        }
    }

    /**
     * Draw the particle on the passed context.
     *
     * @param context {CanvasRenderingContext2D}
     * @param rotate {Boolean}
     */
    draw(context, rotate) {
        if (!this.imageLoaded) return;

        context.save();
        context.globalAlpha = (1 - this.timeAlive / this.timeToLive);

        context.resetTransform();
        context.translate(this.position.x, this.position.y);
        if (rotate === true) {
            context.rotate(this.rotation);
        }

        context.drawImage(this.img, 0, 0, this.img.width * this.size, this.img.height * this.size);
        context.restore();
    }

    update(deltaTime) {
        // TODO: implement this; move stuff from constraint() that doesnt belong there
        this.timeAlive += deltaTime;
        if (this.timeAlive >= this.timeToLive) {
            this.dead = true;
            return;
        }

        this.color.a = 1 - (this.timeAlive / this.timeToLive);
        this.size -= (this.timeAlive / this.timeToLive) * deltaTime;
        if (this.size <= 1) {
            // Clamp the size to 1
            this.size = 1;
        }
    }

    /**
     * Constraints the particle to screen bounds and selected update method.
     *
     * @param context {CanvasRenderingContext2D}
     * @param deltaTime {Number}
     * @param bounce {Boolean=}
     */
    constraint(context, deltaTime, bounce) {
        const radius = this.size / 2;
        const viewWidth = 1280; // TODO: fix this urgently, refactor the constructor options
        const viewHeight = 720;

        if (this.updateMode === ParticleUpdateMode.WARP) {
            // Wrap around boundaries
            if (this.x > viewWidth) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = viewWidth;
            }

            if (this.y > viewHeight) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = viewHeight;
            }

        } else if (this.updateMode === ParticleUpdateMode.BOUNCE) {
            // Bounce
            if (this.position.x > (viewWidth - radius)) {
                this.position.x = viewWidth - radius;
                this.velocity.x *= -1;

            } else if (this.position.x < radius) {
                this.position.x = radius;
                this.velocity.x *= -1;
            }

            if (this.position.y > (viewHeight - radius)) {
                this.position.y = viewHeight - radius;
                this.velocity.y *= -1;

            } else if (this.position.y < radius) {
                this.position.y = radius;
                this.velocity.y *= -1;
            }

        } else if (this.updateMode === ParticleUpdateMode.KILL) {
            // Kill
            if (this.position.x > (viewWidth - radius) || this.position.x < radius) {
                this.dead = true;
            }

            if (this.position.y > (viewHeight - radius )|| this.position.y < radius) {
                this.dead = true;
            }
        }
    }
}
