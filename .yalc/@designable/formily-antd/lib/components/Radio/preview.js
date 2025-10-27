"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radio = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Radio = antd_1.Radio;
exports.Radio.Behavior = core_1.createBehavior({
    name: 'Radio.Group',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Radio.Group'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Radio.Group),
    },
    designerLocales: locales_1.AllLocales.RadioGroup,
});
exports.Radio.Resource = core_1.createResource({
    icon: 'RadioGroupSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string | number',
                title: 'Radio Group',
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                enum: [
                    { label: '选项1', value: 1 },
                    { label: '选项2', value: 2 },
                ],
            },
        },
    ],
});
