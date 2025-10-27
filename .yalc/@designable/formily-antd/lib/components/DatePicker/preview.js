"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.DatePicker = antd_1.DatePicker;
exports.DatePicker.Behavior = core_1.createBehavior({
    name: 'DatePicker',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'DatePicker'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.DatePicker),
    },
    designerLocales: locales_1.AllLocales.DatePicker,
}, {
    name: 'DatePicker.RangePicker',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'DatePicker.RangePicker'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.DatePicker.RangePicker),
    },
    designerLocales: locales_1.AllLocales.DateRangePicker,
});
exports.DatePicker.Resource = core_1.createResource({
    icon: 'DatePickerSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string',
                title: 'DatePicker',
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
            },
        },
    ],
}, {
    icon: 'DateRangePickerSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string[]',
                title: 'DateRangePicker',
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker.RangePicker',
            },
        },
    ],
});
