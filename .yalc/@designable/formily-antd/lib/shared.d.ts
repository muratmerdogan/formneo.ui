import { TreeNode, Engine } from '@designable/core';
export declare type ComponentNameMatcher = string | string[] | ((name: string, node: TreeNode, context?: any) => boolean);
export declare const matchComponent: (node: TreeNode, name: ComponentNameMatcher, context?: any) => boolean;
export declare const matchChildComponent: (node: TreeNode, name: ComponentNameMatcher, context?: any) => boolean;
export declare const includesComponent: (node: TreeNode, names: ComponentNameMatcher[], target?: TreeNode) => boolean;
export declare const queryNodesByComponentPath: (node: TreeNode, path: ComponentNameMatcher[]) => TreeNode[];
export declare const findNodeByComponentPath: (node: TreeNode, path: ComponentNameMatcher[]) => TreeNode;
export declare const hasNodeByComponentPath: (node: TreeNode, path: ComponentNameMatcher[]) => boolean;
export declare const matchArrayItemsNode: (node: TreeNode) => boolean;
export declare const createNodeId: (designer: Engine, id: string) => {
    [x: string]: string;
};
export declare const createEnsureTypeItemsNode: (type: string) => (node: TreeNode) => TreeNode;
