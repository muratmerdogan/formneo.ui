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
exports.BoxStyleSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@formily/react");
var react_3 = require("@designable/react");
var FoldItem_1 = require("../FoldItem");
var SizeInput_1 = require("../SizeInput");
var InputItems_1 = require("../InputItems");
var classnames_1 = __importDefault(require("classnames"));
var PositionMap = {
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
    all: 1,
};
var BoxRex = /([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+))?)?)?/;
exports.BoxStyleSetter = (0, react_2.observer)(function (props) {
    var field = (0, react_2.useField)();
    var prefix = (0, react_3.usePrefix)('box-style-setter');
    var createPositionHandler = function (position, props) {
        var matched = String(props.value).match(BoxRex) || [];
        var value = matched[PositionMap[position]];
        var v1 = matched[1];
        var v2 = matched[2];
        var v3 = matched[3];
        var v4 = matched[4];
        var allEqualls = v1 === v2 && v2 === v3 && v3 === v4;
        return __assign(__assign({}, props), { value: position === 'all' ? (allEqualls ? v1 : undefined) : value, onChange: function (value) {
                var _a, _b;
                if (position === 'all') {
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, "".concat(value || '0px', " ").concat(value || '0px', " ").concat(value || '0px', " ").concat(value || '0px'));
                }
                else {
                    matched[PositionMap[position]] = value;
                    (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, "".concat(matched[1] || '0px', " ").concat(matched[2] || '0px', " ").concat(matched[3] || '0px', " ").concat(matched[4] || '0px'));
                }
            } });
    };
    return (react_1.default.createElement(FoldItem_1.FoldItem, { className: (0, classnames_1.default)(prefix, props.className), label: field.title },
        react_1.default.createElement(FoldItem_1.FoldItem.Base, null,
            react_1.default.createElement(SizeInput_1.SizeInput, __assign({}, createPositionHandler('all', props), { exclude: ['inherit', 'auto'] }))),
        react_1.default.createElement(FoldItem_1.FoldItem.Extra, null,
            react_1.default.createElement(InputItems_1.InputItems, { width: "50%" },
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: props.labels[0] },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({}, createPositionHandler('top', props), { exclude: ['inherit', 'auto'] }))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: props.labels[1] },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({}, createPositionHandler('right', props), { exclude: ['inherit', 'auto'] }))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: props.labels[2] },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({}, createPositionHandler('bottom', props), { exclude: ['inherit', 'auto'] }))),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: props.labels[3] },
                    react_1.default.createElement(SizeInput_1.SizeInput, __assign({}, createPositionHandler('left', props), { exclude: ['inherit', 'auto'] })))))));
});
exports.BoxStyleSetter.defaultProps = {
    labels: [
        react_1.default.createElement(react_3.IconWidget, { infer: "Top", size: 16, key: "1" }),
        react_1.default.createElement(react_3.IconWidget, { infer: "Right", size: 16, key: "2" }),
        react_1.default.createElement(react_3.IconWidget, { infer: "Bottom", size: 16, key: "3" }),
        react_1.default.createElement(react_3.IconWidget, { infer: "Left", size: 16, key: "4" }),
    ],
};
