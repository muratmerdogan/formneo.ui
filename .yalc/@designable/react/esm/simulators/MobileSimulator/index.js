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
import { MobileBody } from './body';
import { usePrefix } from '../../hooks';
import cls from 'classnames';
import './styles.less';
export var MobileSimulator = function (props) {
    var prefix = usePrefix('mobile-simulator');
    return (React.createElement("div", __assign({}, props, { className: cls(prefix, props.className) }),
        React.createElement("div", { className: prefix + '-content' },
            React.createElement(MobileBody, null, props.children))));
};
