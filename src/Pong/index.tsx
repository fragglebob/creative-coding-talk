import React, {FC} from "react"
import { use2DCanvas } from "../use2DCanvas"
import { MidiMix } from "../midi/MidiMix";

interface State {
    leftScore: number;
    rightScore: number;
    leftPlayer: number;
    rightPlayer: number;
    ball: {
        x: number;
        y: number;
        velX: number;
        velY: number;
    }
}

function makeNewBall(w: number, h: number) {
    const stateDir = Math.random()>0.5?0:1;

    const startAngle = stateDir*Math.PI+Math.PI/2+Math.random()*Math.PI/4;

    return {
        x: Math.floor(w/2),
        y: Math.floor(h/2),
        velX: Math.sin(startAngle)*5,
        velY: Math.cos(startAngle)*5
    }
}

function setup(ctx: CanvasRenderingContext2D): State {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0,0, w, h);

    return {
        leftScore: 0,
        rightScore: 0,
        leftPlayer: Math.floor(h/2),
        rightPlayer: Math.floor(h/2),
        ball: makeNewBall(w, h)
    }
}

function draw(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp, state: State) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0,0, w, h);

    const target = state.ball.y;
    const current = state.rightPlayer;
    const maxSpeed = 5;
    const diff = target - current

    state.rightPlayer = Math.max(50, Math.min(h-50, current + Math.max(maxSpeed*-1, Math.min(maxSpeed, diff*0.1))))

    state.ball.velX *= 1.0005
    state.ball.velY *= 1.0005

    state.ball.x += state.ball.velX;
    state.ball.y += state.ball.velY;

    if(state.ball.y < 20 || state.ball.y > h - 20) {
        state.ball.velY = -state.ball.velY;
    }

    if(state.ball.x > w-220) {
        state.leftScore++;
        state.ball = makeNewBall(w, h)
    }

    if(state.ball.x < 220) {
        state.rightScore++;
        state.ball = makeNewBall(w, h)
    }


    if(state.ball.x <= 260 && state.ball.y >= state.leftPlayer - 70 && state.ball.y <= state.leftPlayer + 70) {
        state.ball.x = 261
        const paddleCenter = state.rightPlayer + (100/2)
        const d = paddleCenter - state.ball.y;
        state.ball.velY -= d * -0.1;
        state.ball.velX = -state.ball.velX;
    }

    if(state.ball.x >= w-260 && state.ball.y >= state.rightPlayer - 70 && state.ball.y <= state.rightPlayer + 70) {
        state.ball.x = w-261

        const paddleCenter = state.rightPlayer + (100/2)
        const d = paddleCenter - state.ball.y;


 
        state.ball.velY += d * -0.1;
        state.ball.velX = -state.ball.velX;
    }

    ctx.fillStyle = "white"
    ctx.fillRect(220, state.leftPlayer-50, 40, 100);
    ctx.fillRect(w-260, state.rightPlayer-50, 40, 100);
    ctx.fillRect(state.ball.x-20, state.ball.y-20, 40, 40);

    ctx.font = "88px \"JetBrains Mono\", monospace"
    const rightW = ctx.measureText(""+state.rightScore)
    ctx.fillText(""+state.leftScore, 60, 140);
    ctx.fillText(""+state.rightScore, w - 60 - rightW.width, 140);
}


export const Pong: FC = () => {

    const { canvasRef, state } = use2DCanvas(setup, draw)

    return <div className="w-2/3 grow flex mx-auto border border-white">
        <MidiMix onSliderChange={({ value }) => {
            if(!state.current || !canvasRef.current) {
                return;
            }
            const h = canvasRef.current.height;

            state.current.leftPlayer = (h - 100) * ((127-value) / 127) + 50;
        }} />
        <canvas ref={canvasRef} className="w-full"/>
    </div>

}