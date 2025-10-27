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
import { NodeActionsWidget } from '@designable/react';
export var LoadTemplate = function (props) {
    var _a;
    return (React.createElement(NodeActionsWidget, null, (_a = props.actions) === null || _a === void 0 ? void 0 : _a.map(function (action, key) {
        return React.createElement(NodeActionsWidget.Action, __assign({}, action, { key: key }));
    })));
};
