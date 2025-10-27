import React from 'react';
export interface ITemplateAction {
    title: React.ReactNode;
    tooltip?: React.ReactNode;
    icon?: string | React.ReactNode;
    onClick: () => void;
}
export interface ILoadTemplateProps {
    className?: string;
    style?: React.CSSProperties;
    actions?: ITemplateAction[];
}
export declare const LoadTemplate: React.FC<ILoadTemplateProps>;
