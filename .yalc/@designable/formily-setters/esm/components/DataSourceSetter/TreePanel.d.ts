import React from 'react';
import { ITreeDataSource } from './types';
import './styles.less';
export interface ITreePanelProps {
    treeDataSource: ITreeDataSource;
    allowTree: boolean;
    defaultOptionValue: {
        label: string;
        value: any;
    }[];
}
export declare const TreePanel: React.FC<ITreePanelProps>;
