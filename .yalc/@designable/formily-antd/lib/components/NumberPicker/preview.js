"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberPicker = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.NumberPicker = antd_1.NumberPicker;
exports.NumberPicker.Behavior = core_1.createBehavior({
    name: 'NumberPicker',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'NumberPicker'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.NumberPicker),
    },
    designerLocales: locales_1.AllLocales.NumberPicker,
});
exports.NumberPicker.Resource = core_1.createResource({
    icon: 'NumberPickerSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                title: 'NumberPicker',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
            },
        },
    ],
});
