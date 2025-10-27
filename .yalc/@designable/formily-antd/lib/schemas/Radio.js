"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radio = void 0;
exports.Radio = {
    type: 'object',
    properties: {
        autoFocus: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
    },
};
exports.Radio.Group = {
    type: 'object',
    properties: {
        optionType: {
            type: 'string',
            enum: ['default', 'button'],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: 'default',
                optionType: 'button',
            },
        },
        buttonStyle: {
            type: 'string',
            enum: ['outline', 'solid'],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: 'outline',
                optionType: 'button',
            },
        },
    },
};
