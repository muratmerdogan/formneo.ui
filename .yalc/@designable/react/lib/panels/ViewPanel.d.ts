import React from 'react';
import { TreeNode, ITreeNode, WorkbenchTypes } from '@designable/core';
export interface IViewPanelProps {
    type: WorkbenchTypes;
    children: (tree: TreeNode, onChange: (tree: ITreeNode) => void) => React.ReactElement;
    scrollable?: boolean;
    dragTipsDirection?: 'left' | 'right';
}
export declare const ViewPanel: React.FC<IViewPanelProps>;
