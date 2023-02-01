/**
 * This class is very straight-forward
 * It handles updating all emitters that were added to it until the emitters are dead.
 * There should really only be one instance of this in a scene.
 */
export class ParticleSystem {
    constructor() {
        this.emitters = [];
    }

    /**
     * Add a new emitter to this system.
     *
     * @param emitter {BaseEmitter}
     * @returns {ParticleSystem}
     */
    addEmitter(emitter) {
        this.emitters.push(emitter);

        return this;
    }

    /**
     * Clears/kills all active emitters.
     *
     * @returns {ParticleSystem}
     */
    clear() {
        for (let i = 0; i < this.emitters.length; i++) {
            this.emitters[i].dead = true;
        }

        return this;
    }

    /**
     * Update all attached emitters.
     *
     * @param deltaTime {Number}
     */
    update(deltaTime) {
        for (let i = 0; i < this.emitters.length; i++) {
            const emitter = this.emitters[i];
            if (!emitter) continue;

            emitter.update(deltaTime);

            if (emitter.dead === true) {
                this.emitters.splice(i, 1);
            }
        }
    }
}
