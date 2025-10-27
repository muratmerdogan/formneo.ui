"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cascader = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Cascader = antd_1.Cascader;
exports.Cascader.Behavior = core_1.createBehavior({
    name: 'Cascader',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Cascader'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Cascader),
    },
    designerLocales: locales_1.AllLocales.Cascader,
});
exports.Cascader.Resource = core_1.createResource({
    icon: 'CascaderSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Cascader',
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
            },
        },
    ],
});
