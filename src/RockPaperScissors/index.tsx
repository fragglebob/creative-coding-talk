import React, {FC} from "react";
import { use2DCanvas } from "../use2DCanvas";



interface Actor {
    role: "🪨" | "📜" | "✂️"
    x: number;
    y: number;
    velX: number,
    velY: number,
}

interface State {
    actors: Actor[]
}

const bois = 300

function setup(ctx: CanvasRenderingContext2D): State {

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const margin = 100;

    const actors: Actor[] = [];

    const roles = ["🪨", "📜", "✂️"] satisfies Actor["role"][];

    for (let i = 0; i < bois; i++) {
        actors.push({
            role: roles[Math.floor(Math.random()*roles.length)],
            x: (w-margin*2)*Math.random()+margin,
            y: (h-margin*2)*Math.random()+margin,
            velX: 0,
            velY: 0,
        })
    }

    return {
        actors
    }
}

function hasCollision(a: Actor, b: Actor): boolean {
    if (
        a.x <= b.x + 42 &&
        a.x + 42 >= b.x &&
        a.y <= b.y + 42 &&
        a.y + 42 >= b.y
    ) {
        if(a.role === b.role) {
            const diffX = (b.x - a.x)/10.5;
            const diffY = (b.y - a.y)/10.5
            if(a.x > b.x) {
                
                a.x -= diffX*1.1;
                b.x += diffX;
            } else {
                a.x += diffX;
                b.x -= diffX*1.1;
            }
    
            if(a.y > b.y) {
                
                a.y -= diffY*1.1;
                b.y += diffY;
            } else {
                a.y += diffY;
                b.y -= diffY*1.1;
            }
        }
        
        return true;
    }

    return false;
}

const distance = (a: Actor, b: Actor): number => {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

function draw(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp, state: State) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;



    ctx.clearRect(0, 0, w, h);

    ctx.font = "bold 48px sans-serif";
    ctx.strokeStyle = "red";

    const papers: Actor[] = [];
    const rocks: Actor[] = [];
    const scissors: Actor[] = [];

    // check collisions
    for (let i = 0; i < state.actors.length; i++) {
        const a = state.actors[i];
        for (let j = i+1; j < state.actors.length; j++) {
            
            const b = state.actors[j]
            if(hasCollision(a, b)) {
                if(a.role === "✂️") {
                    if(b.role === "📜") {
                        b.role = "✂️"
                    } else if(b.role === "🪨") {
                        a.role = "🪨"
                    }
                } else if(a.role === "📜") {
                    if(b.role === "🪨") {
                        b.role = "📜"
                    } else if(b.role === "✂️") {
                        a.role = "✂️"
                    }
                } else if(a.role === "🪨") {
                    if(b.role === "✂️") {
                        b.role = "🪨"
                    } else if(b.role === "📜") {
                        a.role = "📜"
                    }
                }
            }
        }
        if(a.role === "🪨") {
            rocks.push(a);
        } else if(a.role === "📜") {
            papers.push(a);
        } else if(a.role === "✂️") {
            scissors.push(a);
        }
    }

    if(rocks.length  === 0|| papers.length  === 0|| scissors.length === 0) {
        const newState = setup(ctx);
        state.actors = newState.actors;
    }

    const pairs: [Actor, [Actor, number] | undefined][] = [];

    const targetCounts = new Map<Actor, number>();

    // movement 
    for (let index = 0; index < state.actors.length; index++) {

        const actor = state.actors[index];

        const team: Actor[] =  actor.role === "🪨" ? rocks : actor.role === "📜" ? papers : scissors;
        const targets: Actor[] =  actor.role === "🪨" ? scissors : actor.role === "📜" ? rocks : papers;

        let target: Actor | undefined = undefined;
        let targetDistance: number | undefined = undefined;

        if(targets.length > 0) {
            target = targets[0];
            targetDistance = distance(actor, target);
           
            for (let j = 1; j < targets.length; j++) {
                const posisibleTarget = targets[j];
                const posisibleTargetDistance = distance(actor, posisibleTarget);
    
                if(posisibleTargetDistance < targetDistance) {

                    const posisibleTargetCount = targetCounts.get(posisibleTarget);

                    if(posisibleTargetCount == null || posisibleTargetCount < team.length/20) {
                        target = posisibleTarget;
                        targetDistance = posisibleTargetDistance;
                    }

                   
                }
            }

            const count = targetCounts.get(target) ?? 0;
            targetCounts.set(target, count+1);
        }

        

        const t: [Actor, number] | undefined = target && targetDistance ? [target, targetDistance] : undefined;

        pairs.push([actor, t]);

    }

    const rSpeedFactor = (bois - rocks.length) / bois;
    const pSpeedFactor = (bois - papers.length) / bois;
    const sSpeedFactor = (bois - scissors.length) / bois;

    for (let index = 0; index < pairs.length; index++) {
        const [actor, target] = pairs[index];

        const speedFactor = actor.role === "🪨" ? rSpeedFactor : actor.role === "📜" ? pSpeedFactor : sSpeedFactor;

        if(target) {
            const vectorX = (target[0].x - actor.x) / target[1];
            const vectorY = (target[0].y - actor.y) / target[1];
    
            actor.velX = vectorX * Math.pow(speedFactor * 1.2, 2) + actor.velX/1.3;
            actor.velY = vectorY * Math.pow(speedFactor * 1.2, 2) + actor.velY/1.3;

            actor.x += actor.velX;
            actor.y += actor.velY;
    
                // ctx.strokeStyle = "red"
                // ctx.beginPath();
                // ctx.moveTo(actor.x, actor.y-34 - 13);
                // ctx.lineTo(target[0].x, target[0].y-34 - 13);
                // ctx.stroke();
        }
        
    }

    // drawing
    for (let index = 0; index < state.actors.length; index++) {
        const actor = state.actors[index];

        ctx.strokeStyle = "green"

        // ctx.strokeRect(actor.x-16, actor.y-34 - 29, 42, 42);
        ctx.fillText(actor.role, actor.x-21, actor.y-25);
       
        
    }
}

export const RPS: FC = () => {

    const { canvasRef } = use2DCanvas(setup, draw)

    return <div className="w-full grow flex">
        <canvas ref={canvasRef} className="w-full"/>
    </div>

}