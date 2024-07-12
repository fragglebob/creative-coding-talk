import React, { FC } from "react";

import cx from "classnames"
import { BaseAudioScene } from "../audio/AudioScene";
import { Param } from "../audio/Param";
import { useClockedAudio } from "../audio/useClockedAudio";
import { Pattern } from "../audio/Pattern";
import { ButtonNames, MidiMix } from "../midi/MidiMix";

class TB303Scene extends BaseAudioScene<{
    tempo: Param,
    volume: Param,
    decay: Param,
    accent: Param,
    envmod: Param,
    cutoff: Param,
    reso: Param,
    pattern: Pattern<
        "C" | "C#" | "D" | "D#" |
        "E" | "F" | "F#" | "G" |
        "G#" | "A" | "A#" |
        "B" | "Accent" | "Slide" | "Up" | "Down"
    >,
}> {

    listnerers: Set<() => void> = new Set();

    gainParam: AudioParam | undefined;
    frequenceParam: AudioParam | undefined;
    filter1CutoffParam: AudioParam | undefined;
    filter2CutoffParam: AudioParam | undefined;

    previous: boolean = false;
    previousFreqeunce: number | undefined;

    constructor() {
        super()
        this.state = {
            tempo: new Param({
                default: 120,
                min: 60,
                max: 160
            }, this.emitChange),
            volume: new Param({
                default: 0.8,
                min: 0,
                max: 1,
                step: 0.01,
            }, this.emitChange),
            decay: new Param({
                default: 0.1,
                min: 0,
                max: 1,
                step: 0.01,
            }, this.emitChange),
            accent: new Param({
                default: 80,
                min: 0,
                max: 100
            }, this.emitChange),
            envmod: new Param({
                default: 440,
                min: 0,
                max: 500
            }, this.emitChange),
            cutoff: new Param({
                default: 1400,
                min: 1,
                max: 9000,
                scale: "log2",
            }, this.emitChange),
            reso: new Param({
                default: 10,
                min: 0,
                max: 12,
                step: 0.1,
            }, this.emitChange),
            pattern: new Pattern({
                labels: [
                    "C",
                    "C#",
                    "D",
                    "D#",
                    "E",
                    "F",
                    "F#",
                    "G",
                    "G#",
                    "A",
                    "A#",
                    "B",
                    "Up",
                    "Down",
                    "Accent",
                    "Slide"
                ],
                default: [
                    ["B", "Accent", "Slide", "Down"],
                    ["C"],
                    ["C"],
                    ["C"],

                    ["D#", "Up"],
                    ["C"],
                    ["C"],
                    ["B", "Slide"],

                    ["B", "Up"],
                    ["C"],
                    ["C", "Up"],
                    ["C"],

                    ["D#", "Accent"],
                    ["D#"],
                    ["C", "Accent"],
                    ["C"],
                ],
                steps: 16,
            }, this.emitChange)
        }
    }

    setup = (ctx: AudioContext) => {
        const oscNode = ctx.createOscillator();
        oscNode.type = "sawtooth";
        oscNode.start();

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0;

        const filter1 = ctx.createBiquadFilter();
        filter1.type = "lowpass";
        filter1.frequency.value = 9e3;
        filter1.Q.value = 4.5;
        filter1.gain.value - 50;

        const filter2 = ctx.createBiquadFilter();
        filter2.type = "lowpass";
        filter2.frequency.value = 9e3;
        filter2.Q.value = 4.5;
        filter2.gain.value - 50;

        oscNode.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);

        gainNode.connect(ctx.destination)

        this.state.reso.connect(filter2.Q);

        this.gainParam = gainNode.gain;
        this.filter1CutoffParam = filter1.frequency;
        this.filter2CutoffParam = filter2.frequency;
        this.frequenceParam = oscNode.frequency;

    }
    close() {

    }

    freqLookup = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ]

    scheduleNotes = (ctx: AudioContext, current16th: number, time: number) => {

        const notes = this.state.pattern.getRow(current16th);

        let freq: number | undefined;

        const up = notes.includes("Up");
        const down = notes.includes("Down");

        for (const note of notes) {
            let index = this.freqLookup.indexOf(note);
            if (index > -1) {

                index -= (12 * 3) + 3

                if (up) {
                    index = index + 12;
                } else if (down) {
                    index = index - 12;
                }

                freq = 440 * Math.pow(2, (index / 12));
                break;
            }
        }

        const accent = notes.includes("Accent");
        const slide = notes.includes("Slide");

        if (freq == null) {
            this.previous = false;
            return;
        }

        this.gainParam?.cancelScheduledValues(time);

        if (this.previous && this.previousFreqeunce != null) {
            this.frequenceParam?.setValueAtTime(this.previousFreqeunce, time);
            this.frequenceParam?.linearRampToValueAtTime(freq, time + 0.0006);
        } else {
            this.gainParam?.setValueAtTime(0.0001, time);
            this.frequenceParam?.setValueAtTime(freq, time);
            this.gainParam?.linearRampToValueAtTime(this.state.volume.value, time + 0.001);
        }

        if (!slide) {
            this.gainParam?.setValueAtTime(this.state.volume.value, time + 0.068);
            this.gainParam?.setValueAtTime(0.0001, time + 0.069);
        }

        if (!this.previous) {
            this.filter1CutoffParam?.cancelScheduledValues(time);
            this.filter2CutoffParam?.cancelScheduledValues(time);

            const decay = this.state.decay.value;
            const y = this.state.cutoff.value;
            const h = y + this.state.envmod.value;
            if (accent) {
                const g = 2 * (this.state.accent.value - 10) / 1000;
                const v = (100 - (decay - 1)) / 1000;

                this.filter1CutoffParam?.linearRampToValueAtTime(h + g, time);
                this.filter2CutoffParam?.linearRampToValueAtTime(h + g, time);

                this.filter1CutoffParam?.exponentialRampToValueAtTime(600, time + v);
                this.filter2CutoffParam?.exponentialRampToValueAtTime(600, time + v);
            } else {
                this.filter1CutoffParam?.setValueAtTime(h, time);
                this.filter2CutoffParam?.setValueAtTime(h, time);
                this.filter1CutoffParam?.linearRampToValueAtTime(y, time + decay);
                this.filter2CutoffParam?.linearRampToValueAtTime(y, time + decay);
            }
        }

        this.previous = slide;
        this.previousFreqeunce = freq;

    }
    getTempo = () => {
        return this.state.tempo.value;
    }
    
}

const tb303 = new TB303Scene();

export const TB303: FC = () => {

    const { isPlaying, play, stop, display16thNote, sceneState } = useClockedAudio(tb303);

    const handleButtonPress = ({ name }: { name: ButtonNames }) => {
        if(name === "BANK_LEFT") {
            play();
        } else if(name === "BANK_RIGHT") {
            stop();
        }
    }

    const handleSliderChange = ({ name, value }: { name: string, value: number }) => {
        if(name === "1") {
            sceneState.tempo.setNormalized(value / 127);
        } else if(name === "2") {
            sceneState.volume.setNormalized(value / 127);
        } else if(name === "3") {
            sceneState.decay.setNormalized(value / 127);
        } else if(name === "4") {
            sceneState.cutoff.setNormalized(value / 127);
        } else if(name === "5") {
            sceneState.envmod.setNormalized(value / 127);
        } else if(name === "6") {
            sceneState.accent.setNormalized(value / 127);
        } else if(name === "7") {
            sceneState.reso.setNormalized(value / 127);
        }
    }

    return <div className="flex justify-center gap-12 font-mono">
        <MidiMix onButtonPress={handleButtonPress} onSliderChange={handleSliderChange} />
        <div className="w-30">

            <div className="flex w-full gap-4 mb-10">
                <button className={cx("rounded px-2 py-1 bg-green-500", {
                    "shadow-inner shadow-slate-900": isPlaying
                })} onClick={play}>
                    Play ▶️
                </button>
                <button className={cx("rounded px-2 py-1", {
                    "bg-red-500": isPlaying,
                    "bg-red-300": !isPlaying
                })} onClick={stop} disabled={!isPlaying}>
                    Stop ⏹️
                </button>
            </div>
            <div>
                {(["tempo", "volume", "decay", "cutoff", "envmod", "accent", "reso"] as const).map((param) => {
                    const p = sceneState[param] as Param;
                    return <div key={param}>

                        <label className="block" htmlFor={param}>{param}: {p.value.toFixed(4)}</label>
                        <input
                            id={param}
                            type="range"
                            min={p.min}
                            max={p.max}
                            value={p.value}
                            step={p.step}
                            onChange={e => {
                                p.setValue(parseFloat(e.target.value))
                            }}
                        />
                    </div>
                })}
            </div>
        </div>

        <div className="flex flex-row col-span-2 bg-gray-600 p-4 rounded">
            <div className=" gap-1 flex flex-col p-1 pr-4">
                {sceneState.pattern.labels.map((label, i) => {
                    return <div key={i} className="h-6 text-right leading-6">{label}</div>
                })}
            </div>
            {sceneState.pattern.grid.map(((column, i) => {
                return <div key={i} className={i === display16thNote ? "rounded bg-red-500 p-1 gap-1 flex flex-col" : "p-1 gap-1 flex flex-col rounded"}>
                    {column.map(((note, j) => {
                        return <div
                            key={j}
                            className={note ? "bg-white rounded w-6 h-6" : "bg-gray-800 rounded w-6 h-6"}
                            onClick={() => {
                                sceneState.pattern.toggle(i, j);
                            }}>

                        </div>
                    }))}
                </div>
            }))}
        </div>

    </div>
}