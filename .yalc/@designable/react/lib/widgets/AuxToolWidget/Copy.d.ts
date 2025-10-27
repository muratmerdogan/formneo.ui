import React from 'react';
import { TreeNode } from '@designable/core';
export interface ICopyProps {
    node: TreeNode;
    style?: React.CSSProperties;
}
export declare const Copy: React.FC<ICopyProps>;
