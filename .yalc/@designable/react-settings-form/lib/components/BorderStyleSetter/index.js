"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderStyleSetter = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@designable/react");
var shared_1 = require("@formily/shared");
var antd_1 = require("@formily/antd");
var reactive_1 = require("@formily/reactive");
var react_3 = require("@formily/react");
var FoldItem_1 = require("../FoldItem");
var ColorInput_1 = require("../ColorInput");
var SizeInput_1 = require("../SizeInput");
var PositionInput_1 = require("../PositionInput");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var Positions = ['center', 'top', 'right', 'bottom', 'left'];
var BorderStyleOptions = [
    {
        label: 'None',
        value: 'none',
    },
    {
        label: react_1.default.createElement("span", { className: "border-style-solid-line" }),
        value: 'solid',
    },
    {
        label: react_1.default.createElement("span", { className: "border-style-dashed-line" }),
        value: 'dashed',
    },
    {
        label: react_1.default.createElement("span", { className: "border-style-dotted-line" }),
        value: 'dotted',
    },
];
var createBorderProp = function (position, key) {
    var insert = position === 'center' ? '' : "-".concat(position);
    return (0, shared_1.camelCase)("border".concat(insert, "-").concat(key));
};
var parseInitPosition = function (field) {
    var basePath = field.address.parent();
    for (var i = 0; i < Positions.length; i++) {
        var position = Positions[i];
        var stylePath = "".concat(basePath, ".").concat(createBorderProp(position, 'style'));
        var widthPath = "".concat(basePath, ".").concat(createBorderProp(position, 'width'));
        var colorPath = "".concat(basePath, ".").concat(createBorderProp(position, 'color'));
        if (field.query(stylePath).value() ||
            field.query(widthPath).value() ||
            field.query(colorPath).value()) {
            return position;
        }
    }
    return 'center';
};
exports.BorderStyleSetter = (0, react_3.observer)(function (_a) {
    var className = _a.className, style = _a.style;
    var field = (0, react_3.useField)();
    var currentPosition = (0, react_1.useMemo)(function () {
        return (0, reactive_1.observable)({
            value: parseInitPosition(field),
        });
    }, [field.value]);
    var prefix = (0, react_2.usePrefix)('border-style-setter');
    var createReaction = function (position) { return function (field) {
        field.display = currentPosition.value === position ? 'visible' : 'hidden';
        if (position !== 'center') {
            var borderStyle = field.query('.borderStyle').value();
            var borderWidth = field.query('.borderWidth').value();
            var borderColor = field.query('.borderColor').value();
            if (borderStyle || borderWidth || borderColor) {
                field.value = undefined;
            }
        }
    }; };
    return (react_1.default.createElement(FoldItem_1.FoldItem, { label: field.title },
        react_1.default.createElement(FoldItem_1.FoldItem.Extra, null,
            react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, className), style: style },
                react_1.default.createElement("div", { className: prefix + '-position' },
                    react_1.default.createElement(PositionInput_1.PositionInput, { value: currentPosition.value, onChange: function (value) {
                            currentPosition.value = value;
                        } })),
                react_1.default.createElement("div", { className: prefix + '-input' }, Positions.map(function (position, key) {
                    return (react_1.default.createElement(react_1.Fragment, { key: key },
                        react_1.default.createElement(react_3.Field, { name: createBorderProp(position, 'style'), basePath: field.address.parent(), dataSource: BorderStyleOptions, reactions: createReaction(position), component: [antd_1.Select, { placeholder: 'Please Select' }] }),
                        react_1.default.createElement(react_3.Field, { name: createBorderProp(position, 'width'), basePath: field.address.parent(), reactions: createReaction(position), component: [SizeInput_1.SizeInput, { exclude: ['auto'] }] }),
                        react_1.default.createElement(react_3.Field, { name: createBorderProp(position, 'color'), basePath: field.address.parent(), reactions: createReaction(position), component: [ColorInput_1.ColorInput] })));
                }))))));
});
