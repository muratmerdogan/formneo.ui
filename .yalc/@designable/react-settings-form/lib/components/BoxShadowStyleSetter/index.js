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
exports.BoxShadowStyleSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@designable/react");
var react_3 = require("@formily/react");
var FoldItem_1 = require("../FoldItem");
var ColorInput_1 = require("../ColorInput");
var SizeInput_1 = require("../SizeInput");
var InputItems_1 = require("../InputItems");
var classnames_1 = __importDefault(require("classnames"));
exports.BoxShadowStyleSetter = (0, react_3.observer)(function (props) {
    var field = (0, react_3.useField)();
    var prefix = (0, react_2.usePrefix)('shadow-style-setter');
    var createBoxShadowConnector = function (position) {
        var splited = String(props.value || '')
            .trim()
            .split(' ');
        return {
            value: splited[position],
            onChange: function (value) {
                var _a;
                splited[position] = value;
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, "".concat(splited[0] || '', " ").concat(splited[1] || '', " ").concat(splited[2] || '', " ").concat(splited[3] || '', " ").concat(splited[4] || ''));
            },
        };
    };
    return (react_1.default.createElement(FoldItem_1.FoldItem, { className: (0, classnames_1.default)(prefix, props.className), style: props.style, label: field.title },
        react_1.default.createElement(FoldItem_1.FoldItem.Base, null,
            react_1.default.createElement(ColorInput_1.ColorInput, __assign({}, createBoxShadowConnector(4)))),
        react_1.default.createElement(FoldItem_1.FoldItem.Extra, null,
            react_1.default.createElement(InputItems_1.InputItems, { width: "50%" },
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "AxisX" },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(0)))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "AxisY" },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(1)))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "Blur" },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(2)))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "Shadow" },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(3))))))));
});
