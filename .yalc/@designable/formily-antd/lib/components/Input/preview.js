"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Input = antd_1.Input;
exports.Input.Behavior = core_1.createBehavior({
    name: 'Input',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Input'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Input),
    },
    designerLocales: locales_1.AllLocales.Input,
}, {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Input.TextArea'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Input.TextArea),
    },
    designerLocales: locales_1.AllLocales.TextArea,
});
exports.Input.Resource = core_1.createResource({
    icon: 'InputSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string',
                title: 'Input',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
            },
        },
    ],
}, {
    icon: 'TextAreaSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string',
                title: 'TextArea',
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
            },
        },
    ],
});
