"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewToolsWidget = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var reactive_react_1 = require("@formily/reactive-react");
var IconWidget_1 = require("../IconWidget");
var hooks_1 = require("../../hooks");
var classnames_1 = __importDefault(require("classnames"));
exports.ViewToolsWidget = (0, reactive_react_1.observer)(function (_a) {
    var use = _a.use, style = _a.style, className = _a.className;
    var workbench = (0, hooks_1.useWorkbench)();
    var prefix = (0, hooks_1.usePrefix)('view-tools');
    return (react_1.default.createElement(antd_1.Button.Group, { style: style, className: (0, classnames_1.default)(prefix, className) },
        use.includes('DESIGNABLE') && (react_1.default.createElement(antd_1.Button, { disabled: workbench.type === 'DESIGNABLE', onClick: function () {
                workbench.type = 'DESIGNABLE';
            }, size: "small" },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Design" }))),
        use.includes('JSONTREE') && (react_1.default.createElement(antd_1.Button, { disabled: workbench.type === 'JSONTREE', onClick: function () {
                workbench.type = 'JSONTREE';
            }, size: "small" },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "JSON" }))),
        use.includes('MARKUP') && (react_1.default.createElement(antd_1.Button, { disabled: workbench.type === 'MARKUP', onClick: function () {
                workbench.type = 'MARKUP';
            }, size: "small" },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Code" }))),
        use.includes('PREVIEW') && (react_1.default.createElement(antd_1.Button, { disabled: workbench.type === 'PREVIEW', onClick: function () {
                workbench.type = 'PREVIEW';
            }, size: "small" },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Play" })))));
});
exports.ViewToolsWidget.defaultProps = {
    use: ['DESIGNABLE', 'JSONTREE', 'PREVIEW'],
};
