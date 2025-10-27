import React from 'react';
import { TreeNode } from '@designable/core';
export interface ISelectorProps {
    node: TreeNode;
    style?: React.CSSProperties;
}
export declare const Selector: React.FC<ISelectorProps>;
