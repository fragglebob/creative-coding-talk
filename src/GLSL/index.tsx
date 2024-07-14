import React, { FC, useEffect, useState } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import { useSlide } from "../useSlide";


const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
    #version 300 es


precision mediump float;

in vec2 uv;
out vec4 fragColor;

uniform float iTime;

uniform vec2 iResolution;



// The MIT License
// Copyright © 2018 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Cylinder intersection: https://www.shadertoy.com/view/4lcSRn
// Cylinder bounding box: https://www.shadertoy.com/view/MtcXRf
// Cylinder distance:     https://www.shadertoy.com/view/wdXGDr

// List of other 3D SDFs: https://www.shadertoy.com/playlist/43cXRl
//
// and https://iquilezles.org/articles/distfunctions


float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float opU( float d1, float d2 )
{
	return (d1<d2) ? d1 : d2;
}

float map( vec3 p )
{
    float scale = 0.2;
    p = (p / scale);

    vec3 l = vec3(5.0);
    vec3 s = vec3(0.3);

    vec3 q = p - s*clamp(round(p/s),-l,l);

    float b = sdBox(q, vec3(0.1));


    float sp = sdSphere(p - vec3(0.0,sin(iTime)*2.0, 0.0), 2.5*cos(iTime*1.337));

    float tor = sdTorus(p - vec3(cos(iTime*2.01+0.3)*1.0, cos(iTime)*1.0, sin(iTime*2.01+0.3)*1.0 ), vec2(2.4, 0.4));

    return opSmoothUnion(opSmoothUnion(sp, tor, 1.0), b, 0.3) * scale;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.0005;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}

void main()
{
     // camera movement	
	float an = 0.5*(iTime-10.0);
	vec3 ro = vec3( 1.0*cos(an), 0.4, 1.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

        
    vec3 tot = vec3(0.0);

    vec2 fragCoord = iResolution * uv;
    
    vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;

    // create view ray
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    const float tmax = 2.0;
    float t = 0.0;
    for( int i=0; i<128; i++ )
    {
        vec3 pos = ro + t*rd;
        float h = map(pos);
        if( h<0.0001 || t>tmax ) break;
        t += h;
    }
    

    // shading/lighting	
    vec3 col = vec3(0.0);
    if( t<tmax )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
        float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
        col = vec3(0.8,0.1,0.1)*amb + vec3(0.4,0.5,0.2)*dif;
    }

    // gamma        
    col = sqrt( col );
    tot += col;


	fragColor = vec4( tot, 1.0 );
}
`
  }
});

const ShaderBiz: FC = () => {

    const [time, setTime] = useState<number>(0);

    useEffect(() =>{
        let animFrame: number;
        
        const loop = (time: DOMHighResTimeStamp) => {
            setTime(time);
            animFrame = requestAnimationFrame(loop);
        }
        animFrame = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animFrame)
        }
    }, [])
    return <Surface width={1066} height={500}>
    <Node shader={shaders.helloBlue} uniforms={{ iTime: time/1000, iResolution: [1066, 500] }} />
  </Surface>
}

export const GLSLDemo: FC = () => {

    const { isSlideActive } = useSlide()

    if(!isSlideActive) {
        return null
    }

    return <ShaderBiz />
}

