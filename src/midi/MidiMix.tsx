import Recat, { FC, useState } from "react";
import { useMidiMessage } from "./useMidi";
import useEvent from "../useEvent";
import { decodeMessage } from "./decoderMessage";
import { useSlide } from "../useSlide";

const buttonMap = {
    1: "MUTE_1",
    2: "SOLO_1",
    3: "ARM_1",

    4: "MUTE_2",
    5: "SOLO_2",
    6: "ARM_2",

    7: "MUTE_3",
    8: "SOLO_3",
    9: "ARM_3",

    10: "MUTE_4",
    11: "SOLO_4",
    12: "ARM_4",

    13: "MUTE_5",
    14: "SOLO_5",
    15: "ARM_5",

    16: "MUTE_6",
    17: "SOLO_6",
    18: "ARM_6",

    19: "MUTE_7",
    20: "SOLO_7",
    21: "ARM_7",

    22: "MUTE_8",
    23: "SOLO_8",
    24: "ARM_8",

    25: "BANK_LEFT",
    26: "BANK_RIGHT",

    27: "SOLO_TOGGLE",
}  as const;

export type ButtonNames = typeof buttonMap[keyof typeof buttonMap];

interface MidiMixProps {
  onSliderChange?: (event: { name: string, value: number }) => void;
  onKnobChange?: (event: { name: string, value: number }) => void;
  onButtonPress?: (event: { name: ButtonNames }) => void;
}



export const MidiMix: FC<MidiMixProps> = ({ onButtonPress, onKnobChange, onSliderChange }) => {

    const { isSlideActive } = useSlide()


    const handler = useEvent((event: MIDIMessageEvent) => {

        if(!isSlideActive) {
            return;
        }

        const target = event.target as MIDIInput;

        if(target.manufacturer !== "AKAI" || target.name !== "MIDI Mix") {
            return;
        }

        if(!event.data) {
            return;
        }


        const message = decodeMessage(event.data);

        if(!message) {
            return;
        }

        if(message.type === "control_change") {
            let index = message.index - 16;
            if(index >= 30) {
                index -= 14
            }
            const row = (index % 4);
            const column = Math.floor(index/4);

            const isSlider = row === 3 || index === 32;

            if(isSlider) {
                onSliderChange?.({ value: message.value, name: "" + (column + 1) })
            } else {
                onKnobChange?.({ value: message.value, name: "" + (column + 1) + String.fromCharCode(row + 65) })
            }
        } else if(message.type === "note_on") {
            onButtonPress?.({ name: buttonMap[message.index as keyof typeof buttonMap] })
        }
    })

    useMidiMessage(handler)

    return null;

}