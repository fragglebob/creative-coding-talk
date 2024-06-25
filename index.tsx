import React from 'react';
import { createRoot } from 'react-dom/client';
import { Image, Deck, DefaultTemplate, Slide, FlexBox, Heading, Text, SpectacleThemeOverrides } from 'spectacle'

import "./index.css";
import inputOutput from "./input_output.png";
import { AudioGraphExample } from './src/WebAudioIntoSlide/AudioGraphExample';
import { TB303 } from './src/TB303';
import { DNB } from './src/DNB';

const theme: SpectacleThemeOverrides = {
  colors: {
    primary: "white",
    secondary: "hotpink",
    tertiary: "#222",
  },
  fonts: {
    header: '"JetBrains Mono", monospace',
    text: '"JetBrains Mono", monospace',
    monospace: '"JetBrains Mono", monospace'
  }
};

const Presentation = () => (
  <Deck template={() => <DefaultTemplate />} theme={theme} overviewScale={1}>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading lineHeight="1em">Creative Coding on the Web</Heading>
        <Text fontSize="2em">or whatever I'm talking about</Text>
      </FlexBox>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading fontSize="h2">Hi, I'm Rob</Heading>
        <Text fontSize="2em">Maker of web things</Text>
      </FlexBox>
    </Slide>
    <Slide>
      <Heading fontSize="h2">Creative Coding</Heading>
      <Text>
        Creativity might not be the first word comes to mind when you think about programming.
      </Text>
      <Text>
        It sits in an intersection where technology, art and design come together. It's programming with the goal of creating something expressive.
      </Text>
    </Slide>
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Image height="100%" width="100%" src={inputOutput} style={{ objectFit: "contain", filter: "brightness(0.87) invert()" }}></Image>
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
);

createRoot(document.getElementById('app')!).render(<Presentation />);