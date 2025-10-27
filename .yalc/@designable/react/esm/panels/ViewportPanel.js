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
import { Simulator } from '../containers';
export var ViewportPanel = function (props) {
    return (React.createElement(WorkspacePanel.Item, __assign({}, props, { flexable: true }),
        React.createElement(Simulator, null, props.children)));
};
