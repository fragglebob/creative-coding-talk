import React from 'react';
import { createRoot } from 'react-dom/client';
import { Image, Deck, DefaultTemplate, Slide, FlexBox, Heading, Text, SpectacleThemeOverrides } from 'spectacle'

import "./index.css";
import inputOutput from "./input_output.png";
import { AudioGraphExample } from './src/WebAudioIntoSlide/AudioGraphExample';
import { TB303 } from './src/TB303';
import { DNB } from './src/DNB';
import { RPS } from './src/RockPaperScissors';
import { LinesExample } from './src/LinesExample';
import { WebMidiProvider } from './src/midi/useMidi';
import { Pong } from './src/Pong';
import { GLSLDemo } from './src/GLSL';
import { Pizza } from './src/Pizza';

const theme: SpectacleThemeOverrides = {
  colors: {
    primary: "white",
    secondary: "hotpink",
    tertiary: "black",
  },
  fonts: {
    header: '"JetBrains Mono", monospace',
    text: '"JetBrains Mono", monospace',
    monospace: '"JetBrains Mono", monospace'
  }
};

const Presentation = () => (
  <WebMidiProvider>
    <Deck template={() => <DefaultTemplate />} theme={theme} overviewScale={1}>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Heading lineHeight="1em">Creative Coding on the Web</Heading>
          <Text fontSize="2em">Making cool stuff with the web platform</Text>
        </FlexBox>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Heading fontSize="h2">Hi, I'm Rob Wells</Heading>
          <Text fontSize="2em">I make websites, and I work places</Text>
        </FlexBox>
      </Slide>
      <Slide>
        <Heading fontSize="h2">So, What is Creative Coding?</Heading>
        <Text fontSize="2.5em">
          Creativity might not be the first word comes to mind when you think about programming, but we can use code to create all sorts of expressive pieces of work. 
        </Text>
        <Text fontSize="2.5em">It's mixing art, design, and <em>technology</em> together.</Text>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Image height="100%" width="100%" src={inputOutput} style={{ objectFit: "contain", filter: "invert()" }}></Image>
        </FlexBox>
        <p className='text-neutral-500'>Source: https://timrodenbroeker.de/what-is-creative-coding/</p>
      </Slide>
      <Slide>
        <Heading fontSize="h2">The {"<canvas>"} element</Heading>
        <Text>A great element for drawing graphics on the screen, with support for 2D, via the Canvas API, and 3D, with WebGL.</Text>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Heading fontSize="h2">Lines</Heading>
          <LinesExample />
        </FlexBox>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Heading fontSize="h2">Rock, Paper, Scissors</Heading>
          <RPS />
        </FlexBox>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Heading fontSize="h3">SDF Shader Fun</Heading>
          <GLSLDemo />
        </FlexBox>
      </Slide>
      <Slide>
        <Heading fontSize="h2">Web Audio API</Heading>
        <Text>
          The API provides a system for controlling audio on the Web. It's designed around modular routing of audio nodes, combined into a graph.
        </Text>
        <AudioGraphExample />
      </Slide>
      <Slide>
        <Heading fontSize="h2">TB303</Heading>
        <TB303 />
      </Slide>
      <Slide>
        <Heading fontSize="h2">Web MIDI API</Heading>
        <Text>
          An API for talking with MIDI devives. 
        </Text>
        <Pong />
      </Slide>
      <Slide>
        <Heading fontSize="h2">TB303</Heading>
        <TB303 />
      </Slide>
      <Slide>
        <Heading fontSize="h2">Slices</Heading>
        <DNB />
        <p className='mt-10 text-neutral-500'>Source: https://samplefocus.com/samples/fast-amen-breakcore-stutter</p>
      </Slide>
      <Slide>
          <Heading fontSize="h2">Other coooool Web APIs</Heading>
          <Text>
            <ul className='ml-4'>
              <li className="list-disc">CSS Painting API</li>
              <li className="list-disc">Web Serial API</li>
              <li className="list-disc">WebUSB API</li>
              <li className="list-disc">WebGPU API</li>
              <li className="list-disc">Gamepad API</li>
            </ul>
          </Text>
      </Slide>
      <Slide>
          <Heading fontSize="h2">Let's wrap this up.</Heading>
          <Text>
            Programming can be creative.
          </Text>
          <Text>
            For me, I enjoy using my web powers, for building something different. 
          </Text>
      </Slide>
      <Slide>
        <Pizza />
      </Slide>
    </Deck>
  </WebMidiProvider>
);

createRoot(document.getElementById('app')!).render(<Presentation />);