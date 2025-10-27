import React from 'react';
import { IResourceLike, IResource } from '@designable/core';
import './styles.less';
export declare type SourceMapper = (resource: IResource) => React.ReactChild;
export interface IResourceWidgetProps {
    title: React.ReactNode;
    sources?: IResourceLike[];
    className?: string;
    defaultExpand?: boolean;
    children?: SourceMapper | React.ReactElement;
}
export declare const ResourceWidget: React.FC<IResourceWidgetProps>;
