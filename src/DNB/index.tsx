import React, { FC } from "react";
import { useClockedAudio } from "../audio/useClockedAudio";
import { AudioScene, BaseAudioScene } from "../audio/AudioScene";
import { Pattern } from "../audio/Pattern";
import cx from "classnames"

import drumLoop from "./drum-loop-2.mp3";
import { Buttons, Launchpad } from "../midi/Launchpad";

class DNBScene extends BaseAudioScene<{ pattern: Pattern<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"> }> {

    constructor() {
        super();
        this.state = {
            pattern: new Pattern({
                labels: [
                    "1", "2", "3", "4", "5", "6", "7", "8"
                ],
                steps: 8,
                default: [
                    ["1"],
                    ["2"],
                    ["3"],
                    ["4"],
                    ["5"],
                    ["6"],
                    ["7"],
                    ["8"],
                ]
            }, this.emitChange)
        }
    }

    loopPromise: Promise<AudioBuffer> | undefined;

    fetchLoop = (ctx: AudioContext): Promise<AudioBuffer> => {

        if(this.loopPromise) {
            return this.loopPromise;
        }

        return this.loopPromise = fetch(drumLoop)
            .then(resp => resp.arrayBuffer())
            .then(buffer => ctx.decodeAudioData(buffer))
    }

    audioBuffer: AudioBuffer | undefined;

    setup = (ctx: AudioContext) => {
        this.fetchLoop(ctx)
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer;
         
            });
    }

    scheduleNotes = (ctx: AudioContext, current16th: number, time: number) => {
        if(!this.audioBuffer) {
            return;
        }

        const secondsPerBeat = 60 / 170;

        const offsets = this.state.pattern.getRow(current16th % 8);

        if(offsets.length === 0) {
            return;
        }

        const offset = parseInt(offsets[0])-1;
        
        const bufferNode = ctx.createBufferSource();
        bufferNode.buffer = this.audioBuffer;
        bufferNode.start(time, offset * secondsPerBeat, secondsPerBeat)
        bufferNode.connect(ctx.destination)
    }

    getTempo = () => {
        return 45
    }

}

const scene = new DNBScene()

export const DNB: FC = () => {
    const { isPlaying, play, stop, display16thNote, sceneState } = useClockedAudio(scene);

    const handleButtonPress = (button: Buttons) => {
        if(button.type === "right" && button.name === "arm") {
            play();
            return;
        } else if(button.type === "right" && button.name ==="stop") {
            stop();
            return;
        } else if (button.type === "grid") {
            for (let index = 0; index < sceneState.pattern.grid[button.x].length; index++) {
                sceneState.pattern.grid[button.x][index] = index === button.y ? !sceneState.pattern.grid[button.x][index] : false;
            }
            sceneState.pattern.onChange();
        }
    }

    return <div className="flex justify-center gap-12 font-mono">
        <Launchpad onButtonPress={handleButtonPress} pattern={sceneState.pattern.grid}/>
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

            <div className="flex flex-row col-span-2 bg-gray-600 p-4 rounded">
                <div className="gap-1 flex flex-col p-1 pr-4">
                    {
                        sceneState.pattern.labels.map((label, i) => {
                            return <div key={i} className="h-8 leading-8 text-right">{label}</div>
                        })
                    }
                </div>
                {sceneState.pattern.grid.map(((column, i) => {
                    return <div key={i} className={display16thNote != null && i === display16thNote%8 ? "rounded bg-red-500 p-1 gap-1 flex flex-col" : "p-1 gap-1 flex flex-col rounded"}>
                        {
                            column.map(((note, j) => {
                                return <div
                                    key={j}
                                    className={note ? "bg-white rounded w-8 h-8" : "bg-gray-800 rounded w-8 h-8"}
                                    onClick={() => {
                                        sceneState.pattern.toggle(i, j);
                                    }}>
                                </div>
                            }))
                        }
                    </div>
                }))}
            </div>
        </div>
    </div>
}