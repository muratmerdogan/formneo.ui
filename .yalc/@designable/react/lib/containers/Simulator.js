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
exports.Simulator = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../hooks");
var simulators_1 = require("../simulators");
exports.Simulator = (0, reactive_react_1.observer)(function (props) {
    var screen = (0, hooks_1.useScreen)();
    if (screen.type === core_1.ScreenType.PC)
        return react_1.default.createElement(simulators_1.PCSimulator, __assign({}, props), props.children);
    if (screen.type === core_1.ScreenType.Mobile)
        return react_1.default.createElement(simulators_1.MobileSimulator, __assign({}, props), props.children);
    if (screen.type === core_1.ScreenType.Responsive)
        return (react_1.default.createElement(simulators_1.ResponsiveSimulator, __assign({}, props), props.children));
    return react_1.default.createElement(simulators_1.PCSimulator, __assign({}, props), props.children);
}, {
    scheduler: shared_1.requestIdle,
});
