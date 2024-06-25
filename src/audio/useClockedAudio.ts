import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AudioScene } from "./AudioScene";
import { useSlide } from "../useSlide";

const scheduleAheadTime = 0.2;

export function useClockedAudio<T>(audioScene: AudioScene<T>) {

    const { isSlideActive } = useSlide();

    const sceneState = useSyncExternalStore(audioScene.subscribe, audioScene.getSnapshot)

    const audioCtxRef = useRef<AudioContext>();

    useEffect(() => {
        if (isSlideActive) {
            const ctx = new AudioContext();
            audioScene.setup(ctx)
            audioCtxRef.current = ctx;
            return () => {
                audioCtxRef.current = undefined;
                ctx.close();

            }
        }
    }, [isSlideActive]);

    const [playing, setPlaying] = useState(false);
    const [display16thNote, setDisplay16thNote] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
            return;
        }

        const ctx = audioCtxRef.current;

        if (playing) {

            let queingTimeout: NodeJS.Timeout;
            let isPlaying = true;

            (async function (ctx: AudioContext) {
                if (ctx.state === "suspended") {
                    await ctx.resume()
                }


                let nextNoteTime = ctx.currentTime;
                let current16th = 0;

                setDisplay16thNote(0)



                function queueNotes() {
                    if (!isPlaying) {
                        return;
                    }

                    while (nextNoteTime < ctx.currentTime + scheduleAheadTime) {
                        audioScene.scheduleNotes(ctx, current16th, nextNoteTime);

                        setTimeout((value) => {

                            if (!isPlaying) {
                                return;
                            }

                            setDisplay16thNote(value);
                        }, nextNoteTime * 1000 - ctx.currentTime * 1000, current16th)



                        // calc next note time
                        nextNoteTime += 0.25 * (60 / audioScene.getTempo());
                        // advance 16th counter
                        current16th++;
                        if (current16th >= 16) {
                            current16th = 0;
                        }
                    }

                    queingTimeout = setTimeout(queueNotes, 25)
                }

                queueNotes();
            })(ctx)

            return () => {
                isPlaying = false;
                clearTimeout(queingTimeout);
                setDisplay16thNote(undefined)
            }
        }
    }, [playing])


    return {
        isPlaying: playing,
        play: () => setPlaying(true),
        stop: () => setPlaying(false),
        display16thNote,

        sceneState
    }


}