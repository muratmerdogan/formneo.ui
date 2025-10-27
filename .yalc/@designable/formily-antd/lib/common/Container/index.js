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
exports.withContainer = exports.Container = void 0;
var react_1 = __importDefault(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@designable/react");
require("./styles.less");
exports.Container = reactive_react_1.observer(function (props) {
    return react_1.default.createElement(react_2.DroppableWidget, null, props.children);
});
var withContainer = function (Target) {
    return function (props) {
        return (react_1.default.createElement(react_2.DroppableWidget, null,
            react_1.default.createElement(Target, __assign({}, props))));
    };
};
exports.withContainer = withContainer;
