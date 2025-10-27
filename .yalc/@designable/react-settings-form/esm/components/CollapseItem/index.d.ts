import React from 'react';
import './styles.less';
export interface ICollapseItemProps {
    className?: string;
    style?: React.CSSProperties;
    defaultExpand?: boolean;
}
export declare const CollapseItem: React.FC<ICollapseItemProps>;
