import React from 'react';
export interface IFormItemSwitcherProps {
    value?: string;
    onChange?: (value: string) => void;
}
export declare const FormItemSwitcher: React.FC<IFormItemSwitcherProps>;
