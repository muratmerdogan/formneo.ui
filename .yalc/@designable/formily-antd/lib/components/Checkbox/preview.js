"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Checkbox = antd_1.Checkbox;
exports.Checkbox.Behavior = core_1.createBehavior({
    name: 'Checkbox.Group',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Checkbox.Group'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Checkbox.Group),
    },
    designerLocales: locales_1.AllLocales.CheckboxGroup,
});
exports.Checkbox.Resource = core_1.createResource({
    icon: 'CheckboxGroupSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array<string | number>',
                title: 'Checkbox Group',
                'x-decorator': 'FormItem',
                'x-component': 'Checkbox.Group',
                enum: [
                    { label: '选项1', value: 1 },
                    { label: '选项2', value: 2 },
                ],
            },
        },
    ],
});
