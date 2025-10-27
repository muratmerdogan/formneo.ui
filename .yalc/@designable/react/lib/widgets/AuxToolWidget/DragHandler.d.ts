import React from 'react';
import { TreeNode } from '@designable/core';
export interface IDragHandlerProps {
    node: TreeNode;
    style?: React.CSSProperties;
}
export declare const DragHandler: React.FC<IDragHandlerProps>;
