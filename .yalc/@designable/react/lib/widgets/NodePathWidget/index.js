"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodePathWidget = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var NodeTitleWidget_1 = require("../NodeTitleWidget");
var reactive_react_1 = require("@formily/reactive-react");
require("./styles.less");
exports.NodePathWidget = (0, reactive_react_1.observer)(function (props) {
    var _a;
    var selected = (0, hooks_1.useSelectedNode)(props.workspaceId);
    var selection = (0, hooks_1.useSelection)(props.workspaceId);
    var hover = (0, hooks_1.useHover)(props.workspaceId);
    var prefix = (0, hooks_1.usePrefix)('node-path');
    if (!selected)
        return react_1.default.createElement(react_1.default.Fragment, null);
    var maxItems = (_a = props.maxItems) !== null && _a !== void 0 ? _a : 3;
    var nodes = selected
        .getParents()
        .slice(0, maxItems - 1)
        .reverse()
        .concat(selected);
    return (react_1.default.createElement(antd_1.Breadcrumb, { className: prefix }, nodes.map(function (node, key) {
        return (react_1.default.createElement(antd_1.Breadcrumb.Item, { key: key },
            key === 0 && (react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Position", style: { marginRight: 3 } })),
            react_1.default.createElement("a", { href: "", onMouseEnter: function () {
                    hover.setHover(node);
                }, onClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    selection.select(node);
                } },
                react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: node }))));
    })));
});
