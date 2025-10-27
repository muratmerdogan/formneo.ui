import React from 'react';
import { InputProps } from 'antd/lib/input';
import './styles.less';
export interface ImageInputProps extends Omit<InputProps, 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
}
export declare const ImageInput: React.FC<ImageInputProps>;
export declare const BackgroundImageInput: React.FC<ImageInputProps>;
