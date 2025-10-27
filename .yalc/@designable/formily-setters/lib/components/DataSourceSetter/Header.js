"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
var react_1 = __importDefault(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@designable/react");
require("./styles.less");
exports.Header = (0, reactive_react_1.observer)(function (_a) {
    var extra = _a.extra, title = _a.title;
    var prefix = (0, react_2.usePrefix)('data-source-setter');
    return (react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item-header') },
        react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item-title') }, title),
        extra));
});
