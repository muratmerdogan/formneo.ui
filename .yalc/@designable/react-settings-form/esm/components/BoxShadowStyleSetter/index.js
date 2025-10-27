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
import React from 'react';
import { usePrefix } from '@designable/react';
import { useField, observer } from '@formily/react';
import { FoldItem } from '../FoldItem';
import { ColorInput } from '../ColorInput';
import { SizeInput } from '../SizeInput';
import { InputItems } from '../InputItems';
import cls from 'classnames';
export var BoxShadowStyleSetter = observer(function (props) {
    var field = useField();
    var prefix = usePrefix('shadow-style-setter');
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
    return (React.createElement(FoldItem, { className: cls(prefix, props.className), style: props.style, label: field.title },
        React.createElement(FoldItem.Base, null,
            React.createElement(ColorInput, __assign({}, createBoxShadowConnector(4)))),
        React.createElement(FoldItem.Extra, null,
            React.createElement(InputItems, { width: "50%" },
                React.createElement(InputItems.Item, { icon: "AxisX" },
                    React.createElement(SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(0)))),
                React.createElement(InputItems.Item, { icon: "AxisY" },
                    React.createElement(SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(1)))),
                React.createElement(InputItems.Item, { icon: "Blur" },
                    React.createElement(SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(2)))),
                React.createElement(InputItems.Item, { icon: "Shadow" },
                    React.createElement(SizeInput, __assign({ exclude: ['inherit', 'auto'] }, createBoxShadowConnector(3))))))));
});
