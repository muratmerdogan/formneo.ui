import React from 'react';
import { Form as FormCore } from '@formily/core';
import { ITreeDataSource } from './types';
import './styles.less';
export interface IDataSettingPanelProps {
    treeDataSource: ITreeDataSource;
    allowExtendOption?: boolean;
    effects?: (form: FormCore<any>) => void;
}
export declare const DataSettingPanel: React.FC<IDataSettingPanelProps>;
