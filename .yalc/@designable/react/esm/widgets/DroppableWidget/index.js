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
import { observer } from '@formily/reactive-react';
import { useTreeNode, useNodeIdProps } from '../../hooks';
import { NodeTitleWidget } from '../NodeTitleWidget';
import { NodeActionsWidget, } from '../NodeActionsWidget';
import './styles.less';
export var DroppableWidget = observer(function (_a) {
    var _b;
    var node = _a.node, actions = _a.actions, height = _a.height, placeholder = _a.placeholder, style = _a.style, className = _a.className, hasChildrenProp = _a.hasChildren, props = __rest(_a, ["node", "actions", "height", "placeholder", "style", "className", "hasChildren"]);
    var currentNode = useTreeNode();
    var nodeId = useNodeIdProps(node);
    var target = node !== null && node !== void 0 ? node : currentNode;
    var hasChildren = hasChildrenProp !== null && hasChildrenProp !== void 0 ? hasChildrenProp : ((_b = target.children) === null || _b === void 0 ? void 0 : _b.length) > 0;
    return (React.createElement("div", __assign({}, nodeId, props, { className: className, style: style }),
        hasChildren ? (props.children) : placeholder ? (React.createElement("div", { style: { height: height }, className: "dn-droppable-placeholder" },
            React.createElement(NodeTitleWidget, { node: target }))) : (props.children),
        (actions === null || actions === void 0 ? void 0 : actions.length) ? (React.createElement(NodeActionsWidget, null, actions.map(function (action, key) { return (React.createElement(NodeActionsWidget.Action, __assign({}, action, { key: key }))); }))) : null));
});
DroppableWidget.defaultProps = {
    placeholder: true,
};
