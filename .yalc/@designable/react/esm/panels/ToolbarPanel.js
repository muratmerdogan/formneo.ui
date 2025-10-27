var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { WorkspacePanel } from './WorkspacePanel';
export var ToolbarPanel = function (props) {
    return (React.createElement(WorkspacePanel.Item, __assign({}, props, { style: __assign({ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '0 4px' }, props.style) }), props.children));
};
