import React from 'react';
import { TreeNode } from '@designable/core';
export interface ISelectionBoxProps {
    node: TreeNode;
    showHelpers: boolean;
}
export declare const SelectionBox: React.FC<ISelectionBoxProps>;
export declare const Selection: React.MemoExoticComponent<React.FunctionComponent<unknown>>;
