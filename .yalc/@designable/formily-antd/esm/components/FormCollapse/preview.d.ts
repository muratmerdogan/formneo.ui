import React from 'react';
import { CollapseProps, CollapsePanelProps } from 'antd/lib/collapse';
import { DnFC } from '@designable/react';
export declare const FormCollapse: DnFC<CollapseProps> & {
    CollapsePanel?: React.FC<CollapsePanelProps>;
};
