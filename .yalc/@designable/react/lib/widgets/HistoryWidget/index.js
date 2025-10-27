"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryWidget = void 0;
var react_1 = __importDefault(require("react"));
var dateformat_1 = __importDefault(require("dateformat"));
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../../hooks");
var TextWidget_1 = require("../TextWidget");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.HistoryWidget = (0, reactive_react_1.observer)(function () {
    var workbench = (0, hooks_1.useWorkbench)();
    var currentWorkspace = (workbench === null || workbench === void 0 ? void 0 : workbench.activeWorkspace) || (workbench === null || workbench === void 0 ? void 0 : workbench.currentWorkspace);
    var prefix = (0, hooks_1.usePrefix)('history');
    if (!currentWorkspace)
        return null;
    return (react_1.default.createElement("div", { className: prefix }, currentWorkspace.history.list().map(function (item, index) {
        var type = item.type || 'default_state';
        var token = type.replace(/\:/g, '_');
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix + '-item', {
                active: currentWorkspace.history.current === index,
            }), key: item.timestamp, onClick: function () {
                currentWorkspace.history.goTo(index);
            } },
            react_1.default.createElement("span", { className: prefix + '-item-title' },
                react_1.default.createElement(TextWidget_1.TextWidget, { token: "operations.".concat(token) })),
            react_1.default.createElement("span", { className: prefix + '-item-timestamp' },
                ' ',
                (0, dateformat_1.default)(item.timestamp, 'yy/mm/dd HH:MM:ss'))));
    })));
});
