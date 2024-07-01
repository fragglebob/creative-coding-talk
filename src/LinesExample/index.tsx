import React, {FC} from "react"
import { use2DCanvas } from "../use2DCanvas"

function setup(ctx: CanvasRenderingContext2D) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, w, h);
}

function draw(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
   
    ctx.save()
    ctx.globalCompositeOperation = "multiply"
// 
    ctx.fillStyle = "rgb(240,220,220)"
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    

    ctx.save()

    ctx.globalCompositeOperation = "screen"

    ctx.strokeStyle = "rgb(255,100,200)"
    ctx.lineWidth = 4

    for (let index = 0; index < 30; index++) {
        const x1 = Math.sin(time / 532 + (index / 12.33)*1.24 + 34.433);
        const x2 = Math.cos(time / 553 + (index / 20.22)*1.21  + 34.02)
        const y1 = Math.cos(time / 512 + (index / 15.23)*1.13  + 34.3211)
        const y2 = Math.sin(time / 585 + (index / 15.93)*1.1  + 34.3745)
        
        ctx.beginPath();
        ctx.moveTo(x1 * w/2.5 + w/2, y1 * h/2.3 + h/2);
        ctx.lineTo(x2 * w/2.5 + w/2, y2 * h/2.4  + h/2);
        ctx.stroke()
    }


    ctx.strokeStyle = "rgb(100,200,255)"
    ctx.shadowColor = "rgb(120,220,255)"

    for (let index = 0; index < 30; index++) {
        const x1 = Math.sin(time / 600 + (index / 15)*1.24 + 1.3);
        const x2 = Math.cos(time / 510 + (index / 12)*1.22  + 0.3)
        const y1 = Math.cos(time / 613 + (index / 13.44)*1.22  + 0.123)
        const y2 = Math.sin(time / 498 + (index / 13.37)*1.21  + 0.9)
        
        ctx.beginPath();
        ctx.moveTo(x1 * w/3 + w/2, y1 * h/3 + h/2);
        ctx.lineTo(x2 * w/3 + w/2, y2 * h/3 + h/2);
        ctx.stroke()
    }


    ctx.restore()

}


export const LinesExample: FC = () => {

    const { canvasRef } = use2DCanvas(setup, draw)

    return <div className="w-full grow flex">
        <canvas ref={canvasRef} className="w-full"/>
    </div>

}