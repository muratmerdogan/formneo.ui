import React from 'react';
import { usePrefix, IconWidget } from '@designable/react';
import { useField, Field, observer } from '@formily/react';
import { Select, Radio, NumberPicker } from '@formily/antd';
import { FoldItem } from '../FoldItem';
import { InputItems } from '../InputItems';
import { SizeInput } from '../SizeInput';
import { ColorInput } from '../ColorInput';
import cls from 'classnames';
var createFontFamilyOptions = function (fonts) {
    return fonts.map(function (font) {
        var splited = font.split('=');
        var label = splited === null || splited === void 0 ? void 0 : splited[0];
        var value = splited === null || splited === void 0 ? void 0 : splited[1];
        return {
            label: React.createElement("span", { style: { fontFamily: value } }, label),
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
export var FontStyleSetter = observer(function (props) {
    var field = useField();
    var prefix = usePrefix('font-style-setter');
    return (React.createElement(FoldItem, { label: field.title, className: cls(prefix, props.className), style: props.style },
        React.createElement(FoldItem.Base, null,
            React.createElement(Field, { name: "fontFamily", basePath: field.address.parent(), component: [
                    Select,
                    { style: { width: '100%' }, placeholder: 'Helvetica Neue' },
                ], dataSource: FontFamilyOptions })),
        React.createElement(FoldItem.Extra, null,
            React.createElement(InputItems, null,
                React.createElement(InputItems.Item, { icon: "FontWeight", width: "50%" },
                    React.createElement(Field, { name: "fontWeight", basePath: field.address.parent(), component: [NumberPicker, { placeholder: '400' }] })),
                React.createElement(InputItems.Item, { icon: "FontStyle", width: "50%" },
                    React.createElement(Field, { name: "fontStyle", basePath: field.address.parent(), dataSource: [
                            {
                                label: React.createElement(IconWidget, { infer: "NormalFontStyle" }),
                                value: 'normal',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "ItalicFontStyle" }),
                                value: 'italic',
                            },
                        ], component: [Radio.Group, { optionType: 'button' }] })),
                React.createElement(InputItems.Item, { icon: "FontColor", width: "100%" },
                    React.createElement(Field, { name: "color", basePath: field.address.parent(), component: [ColorInput] })),
                React.createElement(InputItems.Item, { icon: "FontSize", width: "50%" },
                    React.createElement(Field, { name: "fontSize", basePath: field.address.parent(), component: [SizeInput, { exclude: ['auto'] }] })),
                React.createElement(InputItems.Item, { icon: "LineHeight", width: "50%" },
                    React.createElement(Field, { name: "lineHeight", basePath: field.address.parent(), component: [SizeInput, { exclude: ['auto'] }] })),
                React.createElement(InputItems.Item, { icon: "TextAlign" },
                    React.createElement(Field, { name: "textAlign", basePath: field.address.parent(), dataSource: [
                            {
                                label: React.createElement(IconWidget, { infer: "TextAlignLeft" }),
                                value: 'left',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "TextAlignCenter" }),
                                value: 'center',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "TextAlignRight" }),
                                value: 'right',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "TextAlignJustify" }),
                                value: 'justify',
                            },
                        ], component: [Radio.Group, { optionType: 'button' }] })),
                React.createElement(InputItems.Item, { icon: "TextDecoration" },
                    React.createElement(Field, { name: "textDecoration", basePath: field.address.parent(), dataSource: [
                            {
                                label: '--',
                                value: 'none',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "TextUnderline" }),
                                value: 'underline',
                            },
                            {
                                label: React.createElement(IconWidget, { infer: "TextLineThrough" }),
                                value: 'line-through',
                            },
                        ], component: [Radio.Group, { optionType: 'button' }] }))))));
});
