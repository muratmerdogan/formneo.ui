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
exports.DatePicker = void 0;
var CommonDatePickerAPI = {
    allowClear: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'x-component-props': {
            defaultChecked: true,
        },
    },
    autoFocus: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
    },
    bordered: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'x-component-props': {
            defaultChecked: true,
        },
    },
    disabledTime: {
        'x-decorator': 'FormItem',
        'x-component': 'ValueInput',
        'x-component-props': {
            include: ['EXPRESSION'],
        },
    },
    disabledDate: {
        'x-decorator': 'FormItem',
        'x-component': 'ValueInput',
        'x-component-props': {
            include: ['EXPRESSION'],
        },
    },
    inputReadOnly: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
    },
    placeholder: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
    },
    size: {
        type: 'string',
        enum: ['large', 'small', 'middle', null],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
            defaultValue: 'middle',
        },
    },
    format: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
            placeholder: 'YYYY-MM-DD',
        },
    },
};
exports.DatePicker = {
    type: 'object',
    properties: __assign(__assign({ picker: {
            type: 'string',
            enum: ['time', 'date', 'month', 'year', 'quarter', 'decade'],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'date',
            },
        } }, CommonDatePickerAPI), { showNow: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        }, showTime: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        }, showToday: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        } }),
};
exports.DatePicker.RangePicker = {
    type: 'object',
    properties: __assign(__assign({ picker: {
            type: 'string',
            enum: ['time', 'date', 'month', 'year', 'decade'],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'date',
            },
        } }, CommonDatePickerAPI), { showTime: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        } }),
};
