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
import { Space, Typography, Divider } from 'antd';
import { observer } from '@formily/reactive-react';
import { usePrefix, useTreeNode, useSelected } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { TextWidget } from '../TextWidget';
import cls from 'classnames';
import './styles.less';
export var NodeActionsWidget = observer(function (props) {
    var node = useTreeNode();
    var prefix = usePrefix('node-actions');
    var selected = useSelected();
    if (selected.indexOf(node.id) === -1 && props.activeShown)
        return null;
    return (React.createElement("div", { className: cls(prefix, props.className), style: props.style },
        React.createElement("div", { className: prefix + '-content' },
            React.createElement(Space, { split: React.createElement(Divider, { type: "vertical" }) }, props.children))));
});
NodeActionsWidget.Action = function (_a) {
    var icon = _a.icon, title = _a.title, props = __rest(_a, ["icon", "title"]);
    var prefix = usePrefix('node-actions-item');
    return (React.createElement(Typography.Link, __assign({}, props, { className: cls(props.className, prefix), "data-click-stop-propagation": "true" }),
        React.createElement("span", { className: prefix + '-text' },
            React.createElement(IconWidget, { infer: icon }),
            React.createElement(TextWidget, null, title))));
};
