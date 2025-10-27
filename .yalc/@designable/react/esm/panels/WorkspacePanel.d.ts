import React from 'react';
export interface IWorkspaceItemProps {
    style?: React.CSSProperties;
    flexable?: boolean;
}
export declare const WorkspacePanel: React.FC & {
    Item?: React.FC<IWorkspaceItemProps>;
};
