import React from 'react';
import './styles.less';
export interface IInputItemsContext {
    width?: string | number;
    vertical?: boolean;
}
export interface IInputItemsProps {
    className?: string;
    style?: React.CSSProperties;
    width?: string | number;
    vertical?: boolean;
}
export interface IInputItemProps {
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
    width?: string | number;
    vertical?: boolean;
    title?: React.ReactNode;
}
export declare const InputItems: React.FC<IInputItemsProps> & {
    Item: React.FC<IInputItemProps>;
};
