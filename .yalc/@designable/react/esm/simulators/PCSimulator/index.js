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
import cls from 'classnames';
import { usePrefix } from '../../hooks';
import './styles.less';
export var PCSimulator = function (props) {
    var prefix = usePrefix('pc-simulator');
    return (React.createElement("div", __assign({}, props, { className: cls(prefix, props.className) }), props.children));
};
