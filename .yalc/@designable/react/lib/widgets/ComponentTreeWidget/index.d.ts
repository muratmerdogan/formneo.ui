import React from 'react';
import { IDesignerComponents } from '../../types';
import { TreeNode } from '@designable/core';
import './styles.less';
export interface IComponentTreeWidgetProps {
    style?: React.CSSProperties;
    className?: string;
    components: IDesignerComponents;
}
export interface ITreeNodeWidgetProps {
    node: TreeNode;
    children?: React.ReactChild;
}
export declare const TreeNodeWidget: React.FC<ITreeNodeWidgetProps>;
export declare const ComponentTreeWidget: React.FC<IComponentTreeWidgetProps>;
