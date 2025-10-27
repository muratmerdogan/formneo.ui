"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroppableWidget = void 0;
var react_1 = __importDefault(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../../hooks");
var NodeTitleWidget_1 = require("../NodeTitleWidget");
var NodeActionsWidget_1 = require("../NodeActionsWidget");
require("./styles.less");
exports.DroppableWidget = (0, reactive_react_1.observer)(function (_a) {
    var _b;
    var node = _a.node, actions = _a.actions, height = _a.height, placeholder = _a.placeholder, style = _a.style, className = _a.className, hasChildrenProp = _a.hasChildren, props = __rest(_a, ["node", "actions", "height", "placeholder", "style", "className", "hasChildren"]);
    var currentNode = (0, hooks_1.useTreeNode)();
    var nodeId = (0, hooks_1.useNodeIdProps)(node);
    var target = node !== null && node !== void 0 ? node : currentNode;
    var hasChildren = hasChildrenProp !== null && hasChildrenProp !== void 0 ? hasChildrenProp : ((_b = target.children) === null || _b === void 0 ? void 0 : _b.length) > 0;
    return (react_1.default.createElement("div", __assign({}, nodeId, props, { className: className, style: style }),
        hasChildren ? (props.children) : placeholder ? (react_1.default.createElement("div", { style: { height: height }, className: "dn-droppable-placeholder" },
            react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: target }))) : (props.children),
        (actions === null || actions === void 0 ? void 0 : actions.length) ? (react_1.default.createElement(NodeActionsWidget_1.NodeActionsWidget, null, actions.map(function (action, key) { return (react_1.default.createElement(NodeActionsWidget_1.NodeActionsWidget.Action, __assign({}, action, { key: key }))); }))) : null));
});
exports.DroppableWidget.defaultProps = {
    placeholder: true,
};
