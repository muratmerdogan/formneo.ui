"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Select = antd_1.Select;
exports.Select.Behavior = core_1.createBehavior({
    name: 'Select',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Select'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Select),
    },
    designerLocales: locales_1.AllLocales.Select,
});
exports.Select.Resource = core_1.createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Select',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
            },
        },
    ],
});
