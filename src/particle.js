import { Vec2 } from './math/vec2.js';
import { Utils } from './common/utils.js';

const TWO_PI = 2 * Math.PI;
const TO_RADIANS = Math.PI / 180;
const TO_DEGREES = 180 / Math.PI;

// Particle png image
const PARTICLE_IMAGE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDODBBNUEzMzRBMTFFMUE3OEVBQkVEMTZGNUYyREEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDODBBNUIzMzRBMTFFMUE3OEVBQkVEMTZGNUYyREEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4MEE1ODMzNEExMUUxQTc4RUFCRUQxNkY1RjJEQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4MEE1OTMzNEExMUUxQTc4RUFCRUQxNkY1RjJEQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpKgAvcAAAFMSURBVHjadJNNTsMwEIXtxMVtWlGQgN6ADawQ979BWWUFJ4AVRQ1umzRlBn2GIQqWnvz35s342fbOuSA4Ck7ut3lBKSiY6143xvGQKkFCaCqYCc4Qd6zvBTt4AU7jIejCjeAgmAiWECbstwRvGKv4q1ZlM2jwHb0SLug92d8Fl4IoqDnST4mRbEp8pNf5HIGtYAVvjbBWmAIEnZxD0FIfqMSamIMjXPViH3A7YuTSVHKPmCNBDU85H4zLQJaSQF1cMNcMt1T4zHEX5rjfsYX72/zI+EQS70aaqvTcQkvpDUFa9gu8Ct4Wb1pi+mAeSeKqVrhcm1vqWevgJPw5BrIljLmCuOZFzhFoyDxFZINAnzPs2FBznozbkf2DCcoiyRqlgdcQ8z1Xg6ecEMkv9U3Xxz7TDETjQTf4TAWcT//Pdy4G3znfVD/8zl8CDABJRWjZo1juvQAAAABJRU5ErkJggg==';

export class Particle {
    position = new Vec2(0, 0);
    velocity = new Vec2(0, 0);
    acceleration = new Vec2(0, 0);

    /**
     * @param position {Vec2}
     * @param size {Number}
     * @param rgbaColor {Object}
     * @constructor
     */
    constructor(position, size, rgbaColor) {
        this.position = position; // Position
        this.size = size; // Image scaling
        this.color = rgbaColor;
        this.dead = false;
        this.rotation = 0;
        this.timeToLive = 0;
        this.timeAlive = 0;

        // Color transform the original image and use that
        const tintColor = Utils.makeRGBA(this.color.r, this.color.g, this.color.b, this.color.a);
        this.img = new Image();

        const originalImage = new Image();
        originalImage.src = PARTICLE_IMAGE_DATA;

        // TODO: this can be optimized in the case we only use one color per emitter
        //       So we can do this at the emitter level, and do it only once, instead of per particle.
        this.img.src = Utils.tintImage(originalImage, tintColor);
    }

    /**
     * @param context {CanvasRenderingContext2D}
     */
    draw(context) {
        context.save();
        context.globalAlpha = (1 - this.timeAlive / this.timeToLive);

        context.translate(this.position.x, this.position.y);
        // this.img.src = tintImage(this.img, makeRGBA(this.rgbaColor.r, this.rgbaColor.g, this.rgbaColor.b, alpha));
        context.drawImage(this.img, 0, 0, this.img.width * this.size, this.img.height * this.size);
        context.restore();
    }
}
