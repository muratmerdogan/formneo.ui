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
/*
 * 支持文本、数字、布尔、表达式
 * Todo: JSON、富文本，公式
 */
import React from 'react';
import { createPolyInput } from '../PolyInput';
import { Input, Button, Popover, InputNumber, Select } from 'antd';
import { MonacoInput } from '../MonacoInput';
import { TextWidget } from '@designable/react';
var STARTTAG_REX = /<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/;
var isNumber = function (value) { return typeof value === 'number'; };
var isBoolean = function (value) { return typeof value === 'boolean'; };
var isExpression = function (value) {
    return typeof value === 'string' && EXPRESSION_REX.test(value);
};
var isRichText = function (value) {
    return typeof value === 'string' && STARTTAG_REX.test(value);
};
var isNormalText = function (value) {
    return typeof value === 'string' && !isExpression(value) && !isRichText(value);
};
var takeNumber = function (value) {
    var num = String(value).replace(/[^\d\.]+/, '');
    if (num === '')
        return;
    return Number(num);
};
export var ValueInput = createPolyInput([
    {
        type: 'TEXT',
        icon: 'Text',
        component: Input,
        checker: isNormalText,
    },
    {
        type: 'EXPRESSION',
        icon: 'Expression',
        component: function (props) {
            return (React.createElement(Popover, { content: React.createElement("div", { style: {
                        width: 400,
                        height: 200,
                        marginLeft: -16,
                        marginRight: -16,
                        marginBottom: -12,
                    } },
                    React.createElement(MonacoInput, __assign({}, props, { language: "javascript.expression" }))), trigger: "click" },
                React.createElement(Button, { block: true },
                    React.createElement(TextWidget, { token: "SettingComponents.ValueInput.expression" }))));
        },
        checker: isExpression,
        toInputValue: function (value) {
            if (!value || value === '{{}}')
                return;
            var matched = String(value).match(EXPRESSION_REX);
            return (matched === null || matched === void 0 ? void 0 : matched[1]) || value || '';
        },
        toChangeValue: function (value) {
            if (!value || value === '{{}}')
                return;
            var matched = String(value).match(EXPRESSION_REX);
            return "{{".concat((matched === null || matched === void 0 ? void 0 : matched[1]) || value || '', "}}");
        },
    },
    {
        type: 'BOOLEAN',
        icon: 'Boolean',
        component: function (props) { return (React.createElement(Select, __assign({}, props, { options: [
                { label: 'True', value: true },
                { label: 'False', value: false },
            ] }))); },
        checker: isBoolean,
        toInputValue: function (value) {
            return !!value;
        },
        toChangeValue: function (value) {
            return !!value;
        },
    },
    {
        type: 'NUMBER',
        icon: 'Number',
        component: InputNumber,
        checker: isNumber,
        toInputValue: takeNumber,
        toChangeValue: takeNumber,
    },
]);
