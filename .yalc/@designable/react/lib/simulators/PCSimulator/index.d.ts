import React from 'react';
import './styles.less';
export interface IPCSimulatorProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: React.CSSProperties;
}
export declare const PCSimulator: React.FC<IPCSimulatorProps>;
