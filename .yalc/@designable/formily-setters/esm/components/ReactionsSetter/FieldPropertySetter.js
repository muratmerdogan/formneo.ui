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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState } from 'react';
import { TextWidget, usePrefix } from '@designable/react';
import { Menu } from 'antd';
import { MonacoInput } from '@designable/react-settings-form';
import { isPlainObj, reduce } from '@formily/shared';
import { FieldProperties } from './properties';
var template = function (code) {
    if (!code)
        return;
    return code.trim();
};
export var FieldPropertySetter = function (props) {
    var _a = __read(useState(['visible']), 2), selectKeys = _a[0], setSelectKeys = _a[1];
    var prefix = usePrefix('field-property-setter');
    var value = __assign({}, props.value);
    var parseExpression = function (expression) {
        var _a;
        if (!expression)
            return '';
        return ((_a = String(expression).match(/^\{\{([\s\S]*)\}\}$/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
    };
    var filterEmpty = function (value) {
        return reduce(value, function (buf, value, key) {
            if (!value || value === '{{}}')
                return buf;
            buf[key] = value;
            return buf;
        }, {});
    };
    var currentProperty = FieldProperties.find(function (item) { return item.key === selectKeys[0]; });
    return (React.createElement("div", { className: prefix },
        React.createElement(Menu, { mode: "vertical", style: {
                width: 200,
                height: 300,
                paddingRight: 4,
                overflowY: 'auto',
                overflowX: 'hidden',
            }, defaultSelectedKeys: selectKeys, selectedKeys: selectKeys, onSelect: function (_a) {
                var selectedKeys = _a.selectedKeys;
                setSelectKeys(selectedKeys);
            } }, FieldProperties.map(function (key) {
            if (isPlainObj(key)) {
                return (React.createElement(Menu.Item, { key: key.key },
                    React.createElement(TextWidget, { token: "SettingComponents.ReactionsSetter.".concat(key.token || key.key) })));
            }
            return (React.createElement(Menu.Item, { key: key },
                React.createElement(TextWidget, { token: "SettingComponents.ReactionsSetter.".concat(key) })));
        })),
        React.createElement("div", { className: prefix + '-coder-wrapper' },
            React.createElement("div", { className: prefix + '-coder-start' }, "$self.".concat(selectKeys[0], " = ("),
                React.createElement("span", { style: {
                        fontSize: 14,
                        marginLeft: 10,
                        color: '#888',
                        fontWeight: 'normal',
                    } },
                    '//',
                    ' ',
                    React.createElement(TextWidget, { token: "SettingComponents.ReactionsSetter.expressionValueTypeIs" }),
                    ' ',
                    '`', currentProperty === null || currentProperty === void 0 ? void 0 :
                    currentProperty.type,
                    '`')),
            React.createElement("div", { className: prefix + '-coder' },
                React.createElement(MonacoInput, { key: selectKeys[0], language: "javascript.expression", extraLib: props.extraLib, helpCode: template(currentProperty === null || currentProperty === void 0 ? void 0 : currentProperty.helpCode), value: parseExpression(value[selectKeys[0]]), options: {
                        lineNumbers: 'off',
                        wordWrap: 'on',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        minimap: {
                            enabled: false,
                        },
                    }, onChange: function (expression) {
                        var _a;
                        var _b;
                        (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, filterEmpty(__assign(__assign({}, value), (_a = {}, _a[selectKeys[0]] = "{{".concat(expression, "}}"), _a))));
                    } })),
            React.createElement("div", { className: prefix + '-coder-end' }, ")"))));
};
