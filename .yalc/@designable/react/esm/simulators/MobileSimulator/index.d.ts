import React from 'react';
import './styles.less';
export interface IMobileSimulatorProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: React.CSSProperties;
}
export declare const MobileSimulator: React.FC<IMobileSimulatorProps>;
