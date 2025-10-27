"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copy = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@designable/core");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var antd_1 = require("antd");
var Copy = function (_a) {
    var node = _a.node, style = _a.style;
    var prefix = (0, hooks_1.usePrefix)('aux-copy');
    if (node === node.root)
        return null;
    return (react_1.default.createElement(antd_1.Button, { className: prefix, style: style, type: "primary", onClick: function () {
            core_1.TreeNode.clone([node]);
        } },
        react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Clone" })));
};
exports.Copy = Copy;
exports.Copy.displayName = 'Copy';
