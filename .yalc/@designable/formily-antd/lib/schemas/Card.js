"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var core_1 = require("@designable/core");
exports.Card = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        extra: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        type: {
            type: 'boolean',
            enum: core_1.GlobalRegistry.getDesignerMessage('settings.cardTypes'),
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: '',
                optionType: 'button',
            },
        },
        bordered: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                defaultChecked: true,
            },
        },
    },
};
