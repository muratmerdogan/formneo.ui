"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormItemSwitcher = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var FormItemSwitcher = function (props) {
    return (react_1.default.createElement(antd_1.Switch, { checked: props.value === 'FormItem', onChange: function (value) {
            props.onChange(value ? 'FormItem' : undefined);
        } }));
};
exports.FormItemSwitcher = FormItemSwitcher;
