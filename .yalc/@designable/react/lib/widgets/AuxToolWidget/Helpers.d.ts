import React from 'react';
import { TreeNode } from '@designable/core';
import { Rect } from '@designable/shared';
export interface IHelpersProps {
    node: TreeNode;
    nodeRect: Rect;
}
export interface IViewportState {
    viewportWidth?: number;
    viewportHeight?: number;
    viewportScrollX?: number;
    viewportScrollY?: number;
    viewportIsScrollTop?: boolean;
    viewportIsScrollBottom?: boolean;
}
export declare const Helpers: React.FC<IHelpersProps>;
