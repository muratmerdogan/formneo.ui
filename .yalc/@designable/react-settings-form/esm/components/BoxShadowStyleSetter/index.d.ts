import React from 'react';
export interface IBoxShadowStyleSetterProps {
    className?: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
}
export declare const BoxShadowStyleSetter: React.FC<IBoxShadowStyleSetterProps>;
