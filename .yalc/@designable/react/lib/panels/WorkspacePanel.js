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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacePanel = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../hooks");
var WorkspacePanel = function (props) {
    var prefix = (0, hooks_1.usePrefix)('workspace-panel');
    return react_1.default.createElement("div", { className: prefix }, props.children);
};
exports.WorkspacePanel = WorkspacePanel;
exports.WorkspacePanel.Item = function (props) {
    var prefix = (0, hooks_1.usePrefix)('workspace-panel-item');
    return (react_1.default.createElement("div", { className: prefix, style: __assign(__assign({}, props.style), { flexGrow: props.flexable ? 1 : 0, flexShrink: props.flexable ? 1 : 0 }) }, props.children));
};
