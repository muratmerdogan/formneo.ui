import { TreeNode } from '@designable/core';
import React from 'react';
interface INodeContext {
    renderTitle?: (node: TreeNode) => React.ReactNode;
    renderActions?: (node: TreeNode) => React.ReactNode;
}
export declare const NodeContext: React.Context<INodeContext>;
export {};
