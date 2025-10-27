import React from 'react';
import { Layout } from '../containers';
export interface IStudioPanelProps {
    style?: React.CSSProperties;
    className?: string;
    logo?: React.ReactNode;
    actions?: React.ReactNode;
    prefixCls?: string;
    theme?: string;
    position?: React.ComponentProps<typeof Layout>['position'];
}
export declare const StudioPanel: React.FC<IStudioPanelProps>;
