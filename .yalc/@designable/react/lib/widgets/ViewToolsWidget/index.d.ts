import React from 'react';
import { WorkbenchTypes } from '@designable/core';
export interface IViewToolsWidget {
    use?: WorkbenchTypes[];
    style?: React.CSSProperties;
    className?: string;
}
export declare const ViewToolsWidget: React.FC<IViewToolsWidget>;
