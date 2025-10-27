import React from 'react';
import { Form } from '@formily/core';
import { IDataSourceItem } from './types';
import './styles.less';
export interface IDataSourceSetterProps {
    className?: string;
    style?: React.CSSProperties;
    onChange: (dataSource: IDataSourceItem[]) => void;
    value: IDataSourceItem[];
    allowTree?: boolean;
    allowExtendOption?: boolean;
    defaultOptionValue?: {
        label: string;
        value: any;
    }[];
    effects?: (form: Form<any>) => void;
}
export declare const DataSourceSetter: React.FC<IDataSourceSetterProps>;
