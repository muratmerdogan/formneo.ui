import React from 'react';
import { IDesignerMiniLocales } from '@designable/core';
export interface ITextWidgetProps {
    componentName?: string;
    sourceName?: string;
    token?: string | IDesignerMiniLocales;
    defaultMessage?: string | IDesignerMiniLocales;
}
export declare const TextWidget: React.FC<ITextWidgetProps>;
