

export interface AudioScene<T> {
    setup: (ctx: AudioContext) => void;

    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => T;

    scheduleNotes: (ctx: AudioContext, current16th: number, time: number) => void;
    getTempo: () => number;
}

export abstract class BaseAudioScene<T> implements AudioScene<T> {

    state!: T;

    listnerers: Set<() => void> = new Set();

    abstract setup: (ctx: AudioContext) => void;

    getSnapshot = () => {
        return this.state
    }
    subscribe = (listener: () => void) => {
        this.listnerers.add(listener)
        return () => {
            this.listnerers.delete(listener)
        }
    };

    emitChange = () => {
        this.state = {
            ...this.state
        }
        for (const listnerer of this.listnerers) {
            listnerer()
        }
    }

    abstract scheduleNotes: (ctx: AudioContext, current16th: number, time: number) => void;
    abstract getTempo: () => number;

}