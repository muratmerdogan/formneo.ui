"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
exports.Text = {
    type: 'object',
    properties: {
        content: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
        },
        mode: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'normal',
            },
            enum: ['h1', 'h2', 'h3', 'p', 'normal'],
        },
    },
};
