import React from 'react';
import { ButtonProps } from 'antd';
import './styles.less';
export interface IDrawerSetterProps {
    text: React.ReactNode;
    triggerProps: ButtonProps;
}
export declare const DrawerSetter: React.FC<IDrawerSetterProps>;
