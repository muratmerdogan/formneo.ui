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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldPropertySetter = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@designable/react");
var antd_1 = require("antd");
var react_settings_form_1 = require("@designable/react-settings-form");
var shared_1 = require("@formily/shared");
var properties_1 = require("./properties");
var template = function (code) {
    if (!code)
        return;
    return code.trim();
};
var FieldPropertySetter = function (props) {
    var _a = __read((0, react_1.useState)(['visible']), 2), selectKeys = _a[0], setSelectKeys = _a[1];
    var prefix = (0, react_2.usePrefix)('field-property-setter');
    var value = __assign({}, props.value);
    var parseExpression = function (expression) {
        var _a;
        if (!expression)
            return '';
        return ((_a = String(expression).match(/^\{\{([\s\S]*)\}\}$/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
    };
    var filterEmpty = function (value) {
        return (0, shared_1.reduce)(value, function (buf, value, key) {
            if (!value || value === '{{}}')
                return buf;
            buf[key] = value;
            return buf;
        }, {});
    };
    var currentProperty = properties_1.FieldProperties.find(function (item) { return item.key === selectKeys[0]; });
    return (react_1.default.createElement("div", { className: prefix },
        react_1.default.createElement(antd_1.Menu, { mode: "vertical", style: {
                width: 200,
                height: 300,
                paddingRight: 4,
                overflowY: 'auto',
                overflowX: 'hidden',
            }, defaultSelectedKeys: selectKeys, selectedKeys: selectKeys, onSelect: function (_a) {
                var selectedKeys = _a.selectedKeys;
                setSelectKeys(selectedKeys);
            } }, properties_1.FieldProperties.map(function (key) {
            if ((0, shared_1.isPlainObj)(key)) {
                return (react_1.default.createElement(antd_1.Menu.Item, { key: key.key },
                    react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.ReactionsSetter.".concat(key.token || key.key) })));
            }
            return (react_1.default.createElement(antd_1.Menu.Item, { key: key },
                react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.ReactionsSetter.".concat(key) })));
        })),
        react_1.default.createElement("div", { className: prefix + '-coder-wrapper' },
            react_1.default.createElement("div", { className: prefix + '-coder-start' }, "$self.".concat(selectKeys[0], " = ("),
                react_1.default.createElement("span", { style: {
                        fontSize: 14,
                        marginLeft: 10,
                        color: '#888',
                        fontWeight: 'normal',
                    } },
                    '//',
                    ' ',
                    react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.ReactionsSetter.expressionValueTypeIs" }),
                    ' ',
                    '`', currentProperty === null || currentProperty === void 0 ? void 0 :
                    currentProperty.type,
                    '`')),
            react_1.default.createElement("div", { className: prefix + '-coder' },
                react_1.default.createElement(react_settings_form_1.MonacoInput, { key: selectKeys[0], language: "javascript.expression", extraLib: props.extraLib, helpCode: template(currentProperty === null || currentProperty === void 0 ? void 0 : currentProperty.helpCode), value: parseExpression(value[selectKeys[0]]), options: {
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
            react_1.default.createElement("div", { className: prefix + '-coder-end' }, ")"))));
};
exports.FieldPropertySetter = FieldPropertySetter;
