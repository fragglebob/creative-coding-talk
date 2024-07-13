import { useEffect, useRef } from "react";
import { useSlide } from "./useSlide";

export function use2DCanvas<TState>(setup: (ctx: CanvasRenderingContext2D) => TState, draw: (ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp, state: TState) => void) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<TState>();
    const { isSlideActive } = useSlide();

    useEffect(() => {

        if(!isSlideActive) {
            return;
        }

        const canvas = canvasRef.current;

        if(!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d", { alpha: true });

        if(!ctx) {
            return;
        }

        const parent = canvas.parentElement;

        if(!parent) {
            return;
        }

        canvas.width = Math.floor(parent.clientWidth) * 2;
        canvas.height = Math.floor(parent.clientHeight) * 2;
    
        const state = setup(ctx);

        stateRef.current = state;

        let animFrame: number;
        
        const drawWrap = (time: DOMHighResTimeStamp) => {
            draw(ctx, time, state);
            animFrame = requestAnimationFrame(drawWrap)
        }

        animFrame = requestAnimationFrame(drawWrap);

        return () => {
            cancelAnimationFrame(animFrame)
        }
        


    }, [isSlideActive])

    return {
        canvasRef,
        state: stateRef,
    }
}