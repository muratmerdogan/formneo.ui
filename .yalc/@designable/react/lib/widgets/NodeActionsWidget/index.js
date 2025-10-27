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
exports.NodeActionsWidget = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var TextWidget_1 = require("../TextWidget");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.NodeActionsWidget = (0, reactive_react_1.observer)(function (props) {
    var node = (0, hooks_1.useTreeNode)();
    var prefix = (0, hooks_1.usePrefix)('node-actions');
    var selected = (0, hooks_1.useSelected)();
    if (selected.indexOf(node.id) === -1 && props.activeShown)
        return null;
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className), style: props.style },
        react_1.default.createElement("div", { className: prefix + '-content' },
            react_1.default.createElement(antd_1.Space, { split: react_1.default.createElement(antd_1.Divider, { type: "vertical" }) }, props.children))));
});
exports.NodeActionsWidget.Action = function (_a) {
    var icon = _a.icon, title = _a.title, props = __rest(_a, ["icon", "title"]);
    var prefix = (0, hooks_1.usePrefix)('node-actions-item');
    return (react_1.default.createElement(antd_1.Typography.Link, __assign({}, props, { className: (0, classnames_1.default)(props.className, prefix), "data-click-stop-propagation": "true" }),
        react_1.default.createElement("span", { className: prefix + '-text' },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: icon }),
            react_1.default.createElement(TextWidget_1.TextWidget, null, title))));
};
