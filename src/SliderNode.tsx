import React, { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { StyledNode } from './StyledNode';

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <StyledNode title={data.label}>
                <input 
                    type="range" 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    onChange={(e) => {
                        if(data.onChange) {
                            data.onChange(e.target.value);
                        }
                    }} 
                    value={data.value}
                    className='w-full'
                    draggable
                />

            </StyledNode>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
}) satisfies FC<NodeProps>;