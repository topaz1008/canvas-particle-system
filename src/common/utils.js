import { Vec2 } from '../math/vec2.js';
import { Vec3 } from '../math/vec3.js';

export class Utils {
    static makeRGBA(r, g, b, a) {
        return ('rgba(R, G, B, A)')
            .replace('R', (r | r).toString())
            .replace('G', (g | g).toString())
            .replace('B', (b | b).toString())
            .replace('A', a.toString());
    }

    static getRandom(min, max) {
        return min + Math.random() * ((max) - min);
    }

    static getRandomInt(min, max) {
        const x = (min + Math.random() * (max + 1 - min));

        return (x > 0) ? Math.floor(x) : Math.floor(x - 1);
    }

    /**
     * Tints an image with the specified color
     * and return it as a base64 string.
     *
     * @param imageElement {HTMLImageElement}
     * @param tintColor {String}
     * @returns {String}
     */
    static tintImage(imageElement, tintColor) {
        const canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        if (canvas.width === 0 || canvas.height === 0) {
            console.warn('Utils.tintImage(): ' +
                'Trying to tint an image with a zero width or height; returning an empty image string.');
            return 'data:image/png;base64,';
        }

        context.drawImage(imageElement, 0, 0);

        const buffer = context.getImageData(0, 0, imageElement.width, imageElement.height);

        // Convert image to grayscale
        for (let i = 0; i < buffer.data.length; i += 4) {
            const r = buffer.data[i];
            const g = buffer.data[i + 1];
            const b = buffer.data[i + 2];
            // Alpha is ignored

            // Set all 3 channels to the average
            const avg = Math.floor((r + g + b) / 3);
            buffer.data[i] = buffer.data[i + 1] = buffer.data[i + 2] = avg;
        }

        context.putImageData(buffer, 0, 0);

        // Overlay filled rectangle using source-in composition
        context.globalCompositeOperation = 'source-in';
        // context.globalAlpha = 1;
        context.fillStyle = tintColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    }

    /**
     * Linear interpolation between 2D vectors a and b along t.
     *
     * @param a {Vec2}
     * @param b {Vec2}
     * @param t {Number}
     * @return {Vec2}
     */
    static vec2Lerp(a, b, t) {
        const x = a.x + t * (b.x - a.x);
        const y = a.y + t * (b.y - a.y);

        return new Vec2(x, y);
    }

    /**
     * Linear interpolation 3D vectors a and b along t.
     *
     * @param a {Vec3}
     * @param b {Vec3}
     * @param t {Number}
     * @return {Vec3}
     */
    static vec3Lerp(a, b, t) {
        const x = a.x + t * (b.x - a.x);
        const y = a.y + t * (b.y - a.y);
        const z = a.z + t * (b.z - a.z);

        return new Vec3(x, y, z);
    }
}
