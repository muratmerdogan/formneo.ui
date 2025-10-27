"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var core_1 = require("@designable/core");
exports.Slider = {
    type: 'object',
    properties: {
        allowClear: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        dots: {
            title: core_1.GlobalRegistry.getDesignerMessage('settings.sliderDots'),
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        range: {
            title: core_1.GlobalRegistry.getDesignerMessage('settings.sliderRange'),
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        reverse: {
            title: core_1.GlobalRegistry.getDesignerMessage('settings.sliderReverse'),
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        vertical: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        tooltipVisible: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        tooltipPlacement: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
            },
        },
        marks: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
            },
        },
        max: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
                defaultValue: 100,
            },
        },
        min: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
                defaultValue: 0,
            },
        },
        step: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
                defaultValue: 1,
            },
        },
    },
};
