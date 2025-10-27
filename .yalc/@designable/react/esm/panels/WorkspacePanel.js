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
import { usePrefix } from '../hooks';
export var WorkspacePanel = function (props) {
    var prefix = usePrefix('workspace-panel');
    return React.createElement("div", { className: prefix }, props.children);
};
WorkspacePanel.Item = function (props) {
    var prefix = usePrefix('workspace-panel-item');
    return (React.createElement("div", { className: prefix, style: __assign(__assign({}, props.style), { flexGrow: props.flexable ? 1 : 0, flexShrink: props.flexable ? 1 : 0 }) }, props.children));
};
