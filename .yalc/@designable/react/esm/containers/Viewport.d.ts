import React from 'react';
export interface IViewportProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
    placeholder?: React.ReactNode;
    dragTipsDirection?: 'left' | 'right';
}
export declare const Viewport: React.FC<IViewportProps>;
