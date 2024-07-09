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
          <Text fontSize="2em">I make websites, and work places</Text>
        </FlexBox>
      </Slide>
      <Slide>
        <Heading fontSize="h2">So, What is Creative Coding?</Heading>
        <Text>
          Creativity might not be the first word comes to mind when you think about programming.
        </Text>
        <Text>
          It exists where technology, art and design come together. It's programming with the goal of creating something expressive.
        </Text>
      </Slide>
      <Slide>
        <FlexBox height="100%" flexDirection="column">
          <Image height="100%" width="100%" src={inputOutput} style={{ objectFit: "contain", filter: "invert()" }}></Image>
        </FlexBox>
        <p>Source: https://timrodenbroeker.de/what-is-creative-coding/</p>
      </Slide>
      <Slide>
        <Heading fontSize="h2">{"<canvas>"}</Heading>
        <Text>A cool element for drawing things on the screen, with support for 2D, via the Canvas API, and 3D, with WebGL.</Text>
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
        <Heading fontSize="h2">Slices</Heading>
        <DNB />
      </Slide>
    </Deck>
  </WebMidiProvider>
);

createRoot(document.getElementById('app')!).render(<Presentation />);