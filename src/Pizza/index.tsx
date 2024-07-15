import React, {FC} from "react"
import { use2DCanvas } from "../use2DCanvas"
import pizzaImage from "./pizza.png";

interface Pizza {
    x: number;
    y: number;
    size: number;
    velX: number;
    velY: number;
}

interface State {
    img: HTMLImageElement,
    pizzas: Pizza[]
}

function makePizza(w: number, h: number): Pizza {

    const size = Math.round(Math.random()*280+30);

    return {
        x: Math.random() * w,
        y: Math.random() * (h+size),
        size: size,
        velX: 0,
        velY: Math.random()*0.2+0.1
    }
}

function setup(ctx: CanvasRenderingContext2D): State {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0,0, w, h);

    const pizzas: Pizza[] = [];

    for (let i = 0; i < 500; i++) {
        pizzas.push(makePizza(w, h))
        
    }

    const img = new Image();
    img.src = pizzaImage;

    return {
        img,
        pizzas
    }
}

let lastTime = 0;

function draw(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp, state: State) {

    const delta = (time - lastTime);

    if(lastTime === 0) {
        lastTime = time;
        return;
    }

    lastTime = time;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0,0,w, h)
    
    for (let index = 0; index < state.pizzas.length; index++) {

        ctx.save()

        const pizza = state.pizzas[index];

        const size = Math.round(pizza.size + Math.sin(index/13.38+time/200)*pizza.size/4);

        pizza.x += pizza.velX * delta;
        pizza.y += pizza.velY * delta;

        if(pizza.y > h+size*2) {
            pizza.y = -size - 10;
            pizza.x = Math.random()*w;
        }

       

        ctx.translate(pizza.x, pizza.y);
        ctx.rotate(Math.sin(index*12.3)*Math.PI*2);

        ctx.drawImage(state.img, -size/2, -size/2, size, size)

        ctx.restore()
       
        
    }

    ctx.save()
    ctx.globalCompositeOperation = "difference"
    ctx.fillStyle = Math.floor(time/750)%2===0 ? "hotpink" : "lime";
    ctx.font = `bold 800px serif`;

    const mes = ctx.measureText("PIZZA")
    ctx.fillText("PIZZA", w/2 - mes.width/2, h/2 +  250)
    ctx.restore()
}


export const Pizza: FC = () => {

    const { canvasRef } = use2DCanvas(setup, draw)

    return <div className="w-full grow flex">
        <canvas ref={canvasRef} className="w-full"/>
    </div>

}