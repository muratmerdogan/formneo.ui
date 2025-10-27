import React from 'react';
import { TreeNode } from '@designable/core';
import { TreeSelectProps } from 'antd';
export interface IPathSelectorProps extends Omit<TreeSelectProps<any>, 'onChange'> {
    value?: string;
    onChange?: (value: string, node: TreeNode) => void;
    style?: React.CSSProperties;
    className?: string;
}
export declare const PathSelector: React.FC<IPathSelectorProps>;
