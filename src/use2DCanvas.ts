import { useEffect, useRef } from "react";
import { useSlide } from "./useSlide";

export function use2DCanvas<TState>(setup: (ctx: CanvasRenderingContext2D) => TState, draw: (ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp, state: TState) => void) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const rect = parent?.getBoundingClientRect();

        canvas.width = Math.floor(rect.width) * 2;
        canvas.height = Math.floor(rect.height) * 2;
    
        const state = setup(ctx);

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
        canvasRef
    }
}