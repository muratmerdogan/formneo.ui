"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@formily/react");
var core_1 = require("@designable/core");
var antd_1 = require("@formily/antd");
var react_settings_form_1 = require("@designable/react-settings-form");
var antd_2 = require("antd");
var ValidatorSchema = {
    type: 'array',
    items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        'x-decorator-props': {
            style: {
                alignItems: 'center',
                borderRadius: 3,
                paddingTop: 6,
                paddingBottom: 6,
            },
        },
        properties: {
            sortable: {
                type: 'void',
                'x-component': 'ArrayItems.SortHandle',
                'x-component-props': { style: { marginRight: 10 } },
            },
            drawer: {
                type: 'void',
                'x-component': 'DrawerSetter',
                properties: {
                    triggerType: {
                        type: 'string',
                        enum: ['onInput', 'onFocus', 'onBlur'],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                    },
                    validator: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'ValueInput',
                        'x-component-props': {
                            include: ['EXPRESSION'],
                        },
                    },
                    message: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                    },
                    format: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                            allowClear: true,
                        },
                    },
                    pattern: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                            prefix: '/',
                            suffix: '/',
                        },
                    },
                    len: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    max: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    min: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    exclusiveMaximum: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    exclusiveMinimum: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                    },
                    whitespace: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                    },
                    required: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                    },
                },
            },
            moveDown: {
                type: 'void',
                'x-component': 'ArrayItems.MoveDown',
                'x-component-props': { style: { marginLeft: 10 } },
            },
            moveUp: {
                type: 'void',
                'x-component': 'ArrayItems.MoveUp',
                'x-component-props': { style: { marginLeft: 5 } },
            },
            remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
                'x-component-props': { style: { marginLeft: 5 } },
            },
        },
    },
    properties: {
        addValidatorRules: {
            type: 'void',
            'x-component': 'ArrayItems.Addition',
            'x-component-props': {
                style: {
                    marginBottom: 10,
                },
            },
        },
    },
};
exports.ValidatorSetter = (0, react_2.observer)(function (props) {
    var field = (0, react_2.useField)();
    return (react_1.default.createElement(react_settings_form_1.FoldItem, { label: field.title },
        react_1.default.createElement(react_settings_form_1.FoldItem.Base, null,
            react_1.default.createElement(antd_2.Select, { value: Array.isArray(props.value) ? undefined : props.value, onChange: props.onChange, allowClear: true, placeholder: core_1.GlobalRegistry.getDesignerMessage('SettingComponents.ValidatorSetter.pleaseSelect'), options: core_1.GlobalRegistry.getDesignerMessage('SettingComponents.ValidatorSetter.formats') })),
        react_1.default.createElement(react_settings_form_1.FoldItem.Extra, null,
            react_1.default.createElement(react_2.SchemaContext.Provider, { value: new react_2.Schema(ValidatorSchema) },
                react_1.default.createElement(antd_1.ArrayItems, null)))));
});
