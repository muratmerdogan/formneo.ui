import React from 'react';
import './styles.less';
export interface IInput {
    style?: React.CSSProperties;
    className?: string;
    value: any;
    onChange: (value: any) => void;
    exclude?: string[];
    include?: string[];
}
export interface IPolyType {
    type: string;
    title?: string;
    icon?: string;
    component?: any;
    checker: (value: any) => boolean;
    toInputValue?: (value: any) => any;
    toChangeValue?: (value: any) => any;
}
export declare type PolyTypes = IPolyType[];
export declare function createPolyInput(polyTypes?: PolyTypes): React.FC<IInput>;
