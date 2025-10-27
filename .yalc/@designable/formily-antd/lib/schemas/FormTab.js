"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormTab = void 0;
exports.FormTab = {
    type: 'object',
    properties: {
        animated: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        centered: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        size: {
            type: 'string',
            enum: ['large', 'small', 'default', null],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'default',
            },
        },
        type: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: 'line',
                optionType: 'button',
            },
        },
    },
};
exports.FormTab.TabPane = {
    type: 'object',
    properties: {
        tab: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
    },
};
