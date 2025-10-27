"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundStyleSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@formily/react");
var react_3 = require("@designable/react");
var antd_1 = require("@formily/antd");
var FoldItem_1 = require("../FoldItem");
var ColorInput_1 = require("../ColorInput");
var SizeInput_1 = require("../SizeInput");
var ImageInput_1 = require("../ImageInput");
var InputItems_1 = require("../InputItems");
var classnames_1 = __importDefault(require("classnames"));
exports.BackgroundStyleSetter = (0, react_2.observer)(function (props) {
    var field = (0, react_2.useField)();
    var prefix = (0, react_3.usePrefix)('background-style-setter');
    return (react_1.default.createElement(FoldItem_1.FoldItem, { className: (0, classnames_1.default)(prefix, props.className), label: field.title },
        react_1.default.createElement(FoldItem_1.FoldItem.Base, null,
            react_1.default.createElement(react_2.Field, { name: "backgroundColor", basePath: field.address.parent(), component: [ColorInput_1.ColorInput] })),
        react_1.default.createElement(FoldItem_1.FoldItem.Extra, null,
            react_1.default.createElement(InputItems_1.InputItems, null,
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "Image" },
                    react_1.default.createElement(react_2.Field, { name: "backgroundImage", basePath: field.address.parent(), component: [ImageInput_1.BackgroundImageInput] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "ImageSize", width: "50%" },
                    react_1.default.createElement(react_2.Field, { name: "backgroundSize", basePath: field.address.parent(), component: [SizeInput_1.BackgroundSizeInput] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "Repeat", width: "50%" },
                    react_1.default.createElement(react_2.Field, { name: "backgroundRepeat", basePath: field.address.parent(), component: [
                            antd_1.Select,
                            { style: { width: '100%' }, placeholder: 'Repeat' },
                        ], dataSource: [
                            {
                                label: 'No Repeat',
                                value: 'no-repeat',
                            },
                            {
                                label: 'Repeat',
                                value: 'repeat',
                            },
                            {
                                label: 'Repeat X',
                                value: 'repeat-x',
                            },
                            {
                                label: 'Repeat Y',
                                value: 'repeat-y',
                            },
                            {
                                label: 'Space',
                                value: 'space',
                            },
                            {
                                label: 'Round',
                                value: 'round',
                            },
                        ] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "Position" },
                    react_1.default.createElement(react_2.Field, { name: "backgroundPosition", basePath: field.address.parent(), component: [antd_1.Input, { placeholder: 'center center' }] }))))));
});
