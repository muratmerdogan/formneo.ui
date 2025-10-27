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
import { IconWidget } from '@designable/react';
import { BoxStyleSetter } from '../BoxStyleSetter';
export var BorderRadiusStyleSetter = function (props) {
    return (React.createElement(BoxStyleSetter, __assign({}, props, { labels: [
            React.createElement(IconWidget, { infer: "TopLeft", size: 16, key: "1" }),
            React.createElement(IconWidget, { infer: "TopRight", size: 16, key: "2" }),
            React.createElement(IconWidget, { infer: "BottomRight", size: 16, key: "3" }),
            React.createElement(IconWidget, { infer: "BottomLeft", size: 16, key: "4" }),
        ] })));
};
