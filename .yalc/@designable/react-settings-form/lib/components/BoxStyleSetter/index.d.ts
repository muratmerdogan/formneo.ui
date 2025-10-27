import React from 'react';
export interface IMarginStyleSetterProps {
    className?: string;
    style?: React.CSSProperties;
    labels?: React.ReactNode[];
    value?: string;
    onChange?: (value: string) => void;
}
export declare const BoxStyleSetter: React.FC<IMarginStyleSetterProps>;
