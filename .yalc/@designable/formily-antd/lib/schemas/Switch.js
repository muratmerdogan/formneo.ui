"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
exports.Switch = {
    type: 'object',
    properties: {
        autoFocus: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        size: {
            type: 'string',
            enum: ['large', 'small', 'default', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'default',
            },
        },
    },
};
