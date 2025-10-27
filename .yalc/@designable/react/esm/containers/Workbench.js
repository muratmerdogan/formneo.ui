import React from 'react';
import { observer } from '@formily/reactive-react';
import { useWorkbench } from '../hooks';
import { Workspace } from './Workspace';
export var Workbench = observer(function (props) {
    var _a;
    var workbench = useWorkbench();
    return (React.createElement(Workspace, { id: (_a = workbench.currentWorkspace) === null || _a === void 0 ? void 0 : _a.id }, props.children));
});
