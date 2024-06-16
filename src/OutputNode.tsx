import React, { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { StyledNode } from './StyledNode';

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <StyledNode title={data.label}/>
        </>
    );
}) satisfies FC<NodeProps>;