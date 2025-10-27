import React from 'react';
export interface ICompositePanelProps {
    direction?: 'left' | 'right';
    showNavTitle?: boolean;
    defaultOpen?: boolean;
    defaultPinning?: boolean;
    defaultActiveKey?: number;
    activeKey?: number | string;
    onChange?: (activeKey: number | string) => void;
}
export interface ICompositePanelItemProps {
    shape?: 'tab' | 'button' | 'link';
    title?: React.ReactNode;
    icon?: React.ReactNode;
    key?: number | string;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    extra?: React.ReactNode;
}
export declare const CompositePanel: React.FC<ICompositePanelProps> & {
    Item: React.FC<ICompositePanelItemProps>;
};
