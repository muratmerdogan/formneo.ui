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
import { observer } from '@formily/reactive-react';
import { DroppableWidget } from '@designable/react';
import './styles.less';
export var Container = observer(function (props) {
    return React.createElement(DroppableWidget, null, props.children);
});
export var withContainer = function (Target) {
    return function (props) {
        return (React.createElement(DroppableWidget, null,
            React.createElement(Target, __assign({}, props))));
    };
};
