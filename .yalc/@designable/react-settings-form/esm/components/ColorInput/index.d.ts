import React from 'react';
import './styles.less';
export interface IColorInputProps {
    value?: string;
    onChange?: (color: string) => void;
}
export declare const ColorInput: React.FC<IColorInputProps>;
