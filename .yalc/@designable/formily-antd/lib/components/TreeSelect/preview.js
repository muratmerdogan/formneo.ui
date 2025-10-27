"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSelect = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.TreeSelect = antd_1.TreeSelect;
exports.TreeSelect.Behavior = core_1.createBehavior({
    name: 'TreeSelect',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'TreeSelect'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.TreeSelect),
    },
    designerLocales: locales_1.AllLocales.TreeSelect,
});
exports.TreeSelect.Resource = core_1.createResource({
    icon: 'TreeSelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'TreeSelect',
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
            },
        },
    ],
});
