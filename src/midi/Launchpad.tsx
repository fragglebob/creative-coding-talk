import React, { useEffect, useState, type FC } from "react";
import useEvent from "../useEvent";
import { useMidi, useMidiMessage } from "./useMidi";
import { useSlide } from "../useSlide";
import { decodeMessage } from "./decoderMessage";
import { Pattern } from "../audio/Pattern";

const topRow = {
    0: "up",
    1: "down",
    2: "left",
    3: "right",
    4: "session",
    5: "user-1",
    6: "user-2",
    7: "mixer",
} as const;

const rightCol = {
    0: "vol",
    1: "pan",
    2: "snd-a",
    3: "snd-b",
    4: "stop",
    5: "trk-on",
    6: "solo",
    7: "arm",
} as const;

type TopRowButtonNames = typeof topRow[keyof typeof topRow];
type RightColButtonNames = typeof rightCol[keyof typeof rightCol]

export type Buttons = {type: "grid", x: number, y: number } | { type: "top", name: TopRowButtonNames } | { type: "right", name: RightColButtonNames }

interface LaunchpadProps {
    onButtonPress?: (button: Buttons) => void;
    pattern: boolean[][]
}
    
export const Launchpad: FC<LaunchpadProps> = ({ onButtonPress, pattern }) => {

    const { isSlideActive } = useSlide();

    const [previousPattern, updatePattern] = useState<boolean[][]>([]);

    const midi = useMidi();

    useEffect(() => {
        if(isSlideActive) {
            midi.send({ manufacturer: "Novation DMS Ltd", name: "Launchpad" }, [176, 0, 0]);
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    const newItem = pattern?.[x]?.[y] ?? false;
                    if(newItem){
                        const key = y * 16 + x;
                        midi.send({ manufacturer: "Novation DMS Ltd", name: "Launchpad" }, [ 144, key, newItem ? 60 : 12  ])
                    }
                }
            }
        }
    }, [isSlideActive])

    useEffect(() => {

        if(!isSlideActive) {
            return;
        }

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const newItem = pattern?.[x]?.[y] ?? false;
                const previousItem = previousPattern?.[x]?.[y] ?? false;

                if(newItem !== previousItem) {

                    const key = y * 16 + x;
                    midi.send({ manufacturer: "Novation DMS Ltd", name: "Launchpad" }, [ 144, key, newItem ? 60 : 12  ])
                
                }
            }
            
        }
        updatePattern(structuredClone(pattern));
    }, [isSlideActive, JSON.stringify(pattern)])

    const handler = useEvent((event: MIDIMessageEvent) => {

        if(!isSlideActive) {
            return;
        }

        const target = event.target as MIDIInput;

        if(target.manufacturer !== "Novation DMS Ltd" || target.name !== "Launchpad") {
            return;
        }

        if(!event.data) {
            return;
        }

        const message = decodeMessage(event.data);

        if(!message) {
            return;
        }

        if(message.type === "note_on" && message.velocity > 0) {
            const columm = message.index % 16;
            const row = Math.floor(message.index / 16);

            if(columm === 8) {
                onButtonPress?.({ type: "right", name: rightCol[row as keyof typeof rightCol] as RightColButtonNames })
            } else {
                onButtonPress?.({ type: "grid", x: columm, y: row })
            }
        } else if(message.type === "control_change" && message.value > 0) {
            const column = message.index - 104;
            onButtonPress?.({ type: "top", name: topRow[column as keyof typeof topRow] });
        }
    });

    useMidiMessage(handler);

    

    return null;
};