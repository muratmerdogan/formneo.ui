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
import React, { useContext } from 'react';
import { usePrefix, IconWidget } from '@designable/react';
import cls from 'classnames';
import './styles.less';
var InputItemsContext = React.createContext(null);
export var InputItems = function (props) {
    var prefix = usePrefix('input-items');
    return (React.createElement(InputItemsContext.Provider, { value: props },
        React.createElement("div", { className: cls(prefix, props.className), style: props.style }, props.children)));
};
InputItems.defaultProps = {
    width: '100%',
};
InputItems.Item = function (props) {
    var prefix = usePrefix('input-items-item');
    var ctx = useContext(InputItemsContext);
    return (React.createElement("div", { className: cls(prefix, props.className, {
            vertical: props.vertical || ctx.vertical,
        }), style: __assign({ width: props.width || ctx.width }, props.style) },
        props.icon && (React.createElement("div", { className: prefix + '-icon' },
            React.createElement(IconWidget, { infer: props.icon, size: 16 }))),
        props.title && React.createElement("div", { className: prefix + '-title' }, props.title),
        React.createElement("div", { className: prefix + '-controller' }, props.children)));
};
