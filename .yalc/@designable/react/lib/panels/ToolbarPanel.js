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
exports.ToolbarPanel = void 0;
var react_1 = __importDefault(require("react"));
var WorkspacePanel_1 = require("./WorkspacePanel");
var ToolbarPanel = function (props) {
    return (react_1.default.createElement(WorkspacePanel_1.WorkspacePanel.Item, __assign({}, props, { style: __assign({ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '0 4px' }, props.style) }), props.children));
};
exports.ToolbarPanel = ToolbarPanel;
