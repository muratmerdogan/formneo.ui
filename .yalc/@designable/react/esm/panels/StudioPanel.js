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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import { usePrefix, usePosition } from '../hooks';
import { Layout } from '../containers';
import cls from 'classnames';
var StudioPanelInternal = function (_a) {
    var logo = _a.logo, actions = _a.actions, props = __rest(_a, ["logo", "actions"]);
    var prefix = usePrefix('main-panel');
    var position = usePosition();
    var classNameBase = cls('root', position, props.className);
    if (logo || actions) {
        return (React.createElement("div", __assign({}, props, { className: cls("".concat(prefix, "-container"), classNameBase) }),
            React.createElement("div", { className: prefix + '-header' },
                React.createElement("div", { className: prefix + '-header-logo' }, logo),
                React.createElement("div", { className: prefix + '-header-actions' }, actions)),
            React.createElement("div", { className: prefix }, props.children)));
    }
    return (React.createElement("div", __assign({}, props, { className: cls(prefix, classNameBase) }), props.children));
};
export var StudioPanel = function (props) {
    return (React.createElement(Layout, { theme: props.theme, prefixCls: props.prefixCls, position: props.position },
        React.createElement(StudioPanelInternal, __assign({}, props))));
};
