import React from 'react';
import './styles.less';
export interface ICornerInputProps {
    className?: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
}
export declare const CornerInput: React.FC<ICornerInputProps>;
