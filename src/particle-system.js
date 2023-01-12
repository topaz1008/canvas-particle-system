export class ParticleSystem {
    constructor() {
        this.emitters = [];
    }

    addEmitter(emitter) {
        this.emitters.push(emitter);

        return this;
    }

    update(deltaTime) {
        for (let i = 0; i < this.emitters.length; i++) {
            const emitter = this.emitters[i];
            if (!emitter) {
                continue;
            }

            emitter.update(deltaTime);

            if (emitter.dead === true) {
                this.emitters.splice(i, 1);
            }
        }
    }
}
