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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoidFieldSchema = exports.createFieldSchema = exports.createComponentSchema = void 0;
var formily_setters_1 = require("@designable/formily-setters");
var FormItemSwitcher_1 = require("../../common/FormItemSwitcher");
var schemas_1 = require("../../schemas");
var createComponentSchema = function (component, decorator) {
    return {
        'component-group': component && {
            type: 'void',
            'x-component': 'CollapseItem',
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: '{{!!$form.values["x-component"]}}',
                    },
                },
            },
            properties: {
                'x-component-props': component,
            },
        },
        'decorator-group': decorator && {
            type: 'void',
            'x-component': 'CollapseItem',
            'x-component-props': { defaultExpand: false },
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: '{{!!$form.values["x-decorator"]}}',
                    },
                },
            },
            properties: {
                'x-decorator-props': decorator,
            },
        },
        'component-style-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            'x-component-props': { defaultExpand: false },
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: '{{!!$form.values["x-component"]}}',
                    },
                },
            },
            properties: {
                'x-component-props.style': schemas_1.AllSchemas.CSSStyle,
            },
        },
        'decorator-style-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            'x-component-props': { defaultExpand: false },
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: '{{!!$form.values["x-decorator"]}}',
                    },
                },
            },
            properties: {
                'x-decorator-props.style': schemas_1.AllSchemas.CSSStyle,
            },
        },
    };
};
exports.createComponentSchema = createComponentSchema;
var createFieldSchema = function (component, decorator) {
    if (decorator === void 0) { decorator = schemas_1.AllSchemas.FormItem; }
    return {
        type: 'object',
        properties: __assign({ 'field-group': {
                type: 'void',
                'x-component': 'CollapseItem',
                properties: {
                    name: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                    },
                    title: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                    },
                    description: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                    },
                    'x-display': {
                        type: 'string',
                        enum: ['visible', 'hidden', 'none', ''],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                            defaultValue: 'visible',
                        },
                    },
                    'x-pattern': {
                        type: 'string',
                        enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                            defaultValue: 'editable',
                        },
                    },
                    default: {
                        'x-decorator': 'FormItem',
                        'x-component': 'ValueInput',
                    },
                    enum: {
                        'x-decorator': 'FormItem',
                        'x-component': formily_setters_1.DataSourceSetter,
                    },
                    'x-reactions': {
                        'x-decorator': 'FormItem',
                        'x-component': formily_setters_1.ReactionsSetter,
                    },
                    'x-validator': {
                        type: 'array',
                        'x-component': formily_setters_1.ValidatorSetter,
                    },
                    required: {
                        type: 'boolean',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                    },
                },
            } }, exports.createComponentSchema(component, decorator)),
    };
};
exports.createFieldSchema = createFieldSchema;
var createVoidFieldSchema = function (component, decorator) {
    if (decorator === void 0) { decorator = schemas_1.AllSchemas.FormItem; }
    return {
        type: 'object',
        properties: __assign({ 'field-group': {
                type: 'void',
                'x-component': 'CollapseItem',
                properties: {
                    name: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                    },
                    title: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-reactions': {
                            fulfill: {
                                state: {
                                    hidden: '{{$form.values["x-decorator"] !== "FormItem"}}',
                                },
                            },
                        },
                    },
                    description: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                        'x-reactions': {
                            fulfill: {
                                state: {
                                    hidden: '{{$form.values["x-decorator"] !== "FormItem"}}',
                                },
                            },
                        },
                    },
                    'x-display': {
                        type: 'string',
                        enum: ['visible', 'hidden', 'none', ''],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                            defaultValue: 'visible',
                        },
                    },
                    'x-pattern': {
                        type: 'string',
                        enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                            defaultValue: 'editable',
                        },
                    },
                    'x-reactions': {
                        'x-decorator': 'FormItem',
                        'x-component': formily_setters_1.ReactionsSetter,
                    },
                    'x-decorator': {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': FormItemSwitcher_1.FormItemSwitcher,
                    },
                },
            } }, exports.createComponentSchema(component, decorator)),
    };
};
exports.createVoidFieldSchema = createVoidFieldSchema;
