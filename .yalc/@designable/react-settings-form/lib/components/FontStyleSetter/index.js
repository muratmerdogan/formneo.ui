"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontStyleSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@designable/react");
var react_3 = require("@formily/react");
var antd_1 = require("@formily/antd");
var FoldItem_1 = require("../FoldItem");
var InputItems_1 = require("../InputItems");
var SizeInput_1 = require("../SizeInput");
var ColorInput_1 = require("../ColorInput");
var classnames_1 = __importDefault(require("classnames"));
var createFontFamilyOptions = function (fonts) {
    return fonts.map(function (font) {
        var splited = font.split('=');
        var label = splited === null || splited === void 0 ? void 0 : splited[0];
        var value = splited === null || splited === void 0 ? void 0 : splited[1];
        return {
            label: react_1.default.createElement("span", { style: { fontFamily: value } }, label),
            value: value,
        };
    });
};
var FontFamilyOptions = createFontFamilyOptions([
    '宋体=SimSun',
    '微软雅黑=Microsoft Yahei',
    '苹方=PingFang SC',
    'Andale Mono=andale mono,monospace',
    'Arial=arial,helvetica,sans-serif',
    'Arial Black=arial black,sans-serif',
    'Book Antiqua=book antiqua,palatino,serif',
    'Comic Sans MS=comic sans ms,sans-serif',
    'Courier New=courier new,courier,monospace',
    'Georgia=georgia,palatino,serif',
    'Helvetica Neue=Helvetica Neue',
    'Helvetica=helvetica,arial,sans-serif',
    'Impact=impact,sans-serif',
    'Symbol=symbol',
    'Tahoma=tahoma,arial,helvetica,sans-serif',
    'Terminal=terminal,monaco,monospace',
    'Times New Roman=times new roman,times,serif',
    'Trebuchet MS=trebuchet ms,geneva,sans-serif',
    'Verdana=verdana,geneva,sans-serif',
]);
exports.FontStyleSetter = (0, react_3.observer)(function (props) {
    var field = (0, react_3.useField)();
    var prefix = (0, react_2.usePrefix)('font-style-setter');
    return (react_1.default.createElement(FoldItem_1.FoldItem, { label: field.title, className: (0, classnames_1.default)(prefix, props.className), style: props.style },
        react_1.default.createElement(FoldItem_1.FoldItem.Base, null,
            react_1.default.createElement(react_3.Field, { name: "fontFamily", basePath: field.address.parent(), component: [
                    antd_1.Select,
                    { style: { width: '100%' }, placeholder: 'Helvetica Neue' },
                ], dataSource: FontFamilyOptions })),
        react_1.default.createElement(FoldItem_1.FoldItem.Extra, null,
            react_1.default.createElement(InputItems_1.InputItems, null,
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "FontWeight", width: "50%" },
                    react_1.default.createElement(react_3.Field, { name: "fontWeight", basePath: field.address.parent(), component: [antd_1.NumberPicker, { placeholder: '400' }] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "FontStyle", width: "50%" },
                    react_1.default.createElement(react_3.Field, { name: "fontStyle", basePath: field.address.parent(), dataSource: [
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "NormalFontStyle" }),
                                value: 'normal',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "ItalicFontStyle" }),
                                value: 'italic',
                            },
                        ], component: [antd_1.Radio.Group, { optionType: 'button' }] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "FontColor", width: "100%" },
                    react_1.default.createElement(react_3.Field, { name: "color", basePath: field.address.parent(), component: [ColorInput_1.ColorInput] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "FontSize", width: "50%" },
                    react_1.default.createElement(react_3.Field, { name: "fontSize", basePath: field.address.parent(), component: [SizeInput_1.SizeInput, { exclude: ['auto'] }] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "LineHeight", width: "50%" },
                    react_1.default.createElement(react_3.Field, { name: "lineHeight", basePath: field.address.parent(), component: [SizeInput_1.SizeInput, { exclude: ['auto'] }] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "TextAlign" },
                    react_1.default.createElement(react_3.Field, { name: "textAlign", basePath: field.address.parent(), dataSource: [
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextAlignLeft" }),
                                value: 'left',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextAlignCenter" }),
                                value: 'center',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextAlignRight" }),
                                value: 'right',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextAlignJustify" }),
                                value: 'justify',
                            },
                        ], component: [antd_1.Radio.Group, { optionType: 'button' }] })),
                react_1.default.createElement(InputItems_1.InputItems.Item, { icon: "TextDecoration" },
                    react_1.default.createElement(react_3.Field, { name: "textDecoration", basePath: field.address.parent(), dataSource: [
                            {
                                label: '--',
                                value: 'none',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextUnderline" }),
                                value: 'underline',
                            },
                            {
                                label: react_1.default.createElement(react_2.IconWidget, { infer: "TextLineThrough" }),
                                value: 'line-through',
                            },
                        ], component: [antd_1.Radio.Group, { optionType: 'button' }] }))))));
});
