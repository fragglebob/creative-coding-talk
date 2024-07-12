import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

interface WebMidiCtx {
    subscribe: (handler: (event: MIDIMessageEvent) => void) => (() => void)
    send: (portSelector: { name: string, manufacturer?: string }, data: number[]) => void;
}

const ctx = createContext<WebMidiCtx | undefined>(undefined)

type MessageHandler = (event: MIDIMessageEvent) => void;

class WebMidiManager implements WebMidiCtx {

    subs: Set<MessageHandler>

    outputs: MIDIOutput[] = [];

    constructor() {
        this.subs = new Set();
    }

    boot(midiAccess: MIDIAccess) {
        console.log(midiAccess)
        midiAccess.addEventListener("statechange", (event) => {
            console.log(event);
        })

        midiAccess.inputs.forEach(input => {
            input.open().then(() =>
            {
                input.addEventListener("midimessage", (event) => {
                    this.forwardMessage(event);
                })
            })
        })
        
        midiAccess.outputs.forEach(output => {
            output.open().then(() =>
            {
                this.outputs.push(output);
            })
        })
    }

    forwardMessage(event: MIDIMessageEvent) {
        this.subs.forEach(sub => {
            sub(event);
        });
    }

    subscribe(handler: MessageHandler): () => void {

        this.subs.add(handler);
        return () => {
            this.subs.delete(handler);
        }
    }

    send(portSelector: { name: string, manufacturer?: string }, data: number[]) {
        this.outputs.forEach(output => {
            if(output.name !== portSelector.name) {
                return;
            }
            if(portSelector.manufacturer && portSelector.manufacturer !== output.manufacturer) {
                return;
            }
            output.send(data);
        })
    }
}

export const WebMidiProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [midiManager] = useState(() => {
        return new WebMidiManager();
    })

    useEffect(() => {        
        navigator.requestMIDIAccess({ sysex: true })
            .then(
                (midiAccess) => {
                    midiManager.boot(midiAccess)
                },
                (err) => {
                    console.error(`Failed to get MIDI access - ${err}`);
                }
            );
    }, [])

    return <ctx.Provider value={midiManager}>{children}</ctx.Provider>
} 

export const useMidi = (): WebMidiCtx => {
    const midiCtx = useContext(ctx);

    if(!midiCtx) {
        throw new Error("plz setup midi ctx provider, noob");
    }

    return midiCtx;
}

export const useMidiMessage = (handler: MessageHandler) => {
    const midiCtx = useMidi()

    useEffect(() => {
        return midiCtx.subscribe(handler);
    }, [handler])
}