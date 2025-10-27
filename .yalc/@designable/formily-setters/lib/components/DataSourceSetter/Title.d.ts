import React from 'react';
import { INodeItem, ITreeDataSource } from './types';
import './styles.less';
export interface ITitleProps extends INodeItem {
    treeDataSource: ITreeDataSource;
}
export declare const Title: React.FC<ITitleProps>;
