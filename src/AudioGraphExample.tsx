import React, { useEffect } from 'react';
import ReactFlow, { Node, Position, useNodesState, useEdgesState, Edge } from 'reactflow';

import 'reactflow/dist/style.css';
import { useSlide } from './useSlide';
import SliderNode from './SliderNode';
import { impulse } from './impulse';
import StandardNode from './StandardNode';
import OutputNode from './OutputNode';



const nodeTypes = {
    sliderNode: SliderNode,
    normal: StandardNode,
    coolOutput: OutputNode
};

export function AudioGraphExample() {
    const { isSlideActive } = useSlide();

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    useEffect(() => {
        if (isSlideActive) {

            const ctx = new AudioContext();

            const oscillatorNode = ctx.createOscillator();
            oscillatorNode.frequency.value = 200;
            oscillatorNode.start(0)

            const gainNode = ctx.createGain();
            gainNode.gain.value = 0;

            const convNode = ctx.createConvolver();
            convNode.buffer = impulse(ctx, 0.3)

            oscillatorNode.connect(gainNode);
            gainNode.connect(convNode);
            convNode.connect(ctx.destination)

            const initialNodes: Node[] = [
                {
                    id: 'freq-value',
                    type: 'sliderNode',
                    position: { x: 0, y: 0 },
                    data: {
                        label: 'Frequency Value',
                        value: oscillatorNode.frequency.value / 1000,
                        onChange: (value: number) => {
                            oscillatorNode.frequency.value = value * 1000;
                            console.log(oscillatorNode.frequency);
                            setNodes((nodes) => nodes.map(node => {
                                if(node.id === "freq-value") {
                                    node.data = {
                                        ...node.data,
                                        value: value,
                                    }
                                }
                                return node;
                            }))
                        }
                    },
                    draggable: false
                    
                },
                {
                    id: 'oscillator',
                    type: "normal",
                    position: { x: 200, y: 0 },
                    data: { label: 'Oscillator Node' },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    draggable: false
                },

                {
                    id: 'gain-value',
                    type: 'sliderNode',
                    position: { x: 200, y: 60 },
                    data: {
                        label: 'Gain Value',
                        value: gainNode.gain.value,
                        onChange: (value: number) => {
                            gainNode.gain.value = value;
                            console.log(gainNode.gain);
                            setNodes((nodes) => nodes.map(node => {
                                if(node.id === "gain-value") {
                                    node.data = {
                                        ...node.data,
                                        value: value,
                                    }
                                }
                                return node;
                            }))
                        }
                    },
                    draggable: false
                },
                { 
                    id: 'gain',
                    type: "normal",
                    position: { x: 400, y: 0 },
                    data: { label: 'Gain Node' },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    draggable: false
                },

                {
                    id: 'convolver',
                    type: "normal",
                    position: { x: 600, y: 0 },
                    data: { label: 'Convolver Node' },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    draggable: false
                },

                {
                    id: 'sink',
                    type: 'coolOutput',
                    position: { x: 800, y: 0 },
                    data: { label: 'Audio Destination Node' },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    draggable: false
                },
            ];

            const initialEdges: Edge[] = [
                { id: 'freq-value_2_oscillator', source: 'freq-value', target: 'oscillator' },
                { id: 'oscillator_2_gain', source: 'oscillator', target: 'gain' },
                { id: 'gain-value_2_gain', source: 'gain-value', target: 'gain' },
                { id: 'gain_2_convolver', source: 'gain', target: 'convolver' },
                { id: 'convolver_2_sink', source: 'convolver', target: 'sink' }
            ];

            setNodes(initialNodes)
            setEdges(initialEdges)

            return () => {
                ctx.close();
            }
        }
    }, [isSlideActive])

    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            fitView={true}
            draggable={false}
            panOnDrag={false}
        />
    );
}