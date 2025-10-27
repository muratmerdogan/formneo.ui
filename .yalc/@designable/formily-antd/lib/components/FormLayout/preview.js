"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLayout = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Container_1 = require("../../common/Container");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.FormLayout = Container_1.withContainer(antd_1.FormLayout);
exports.FormLayout.Behavior = core_1.createBehavior({
    name: 'FormLayout',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormLayout'; },
    designerProps: {
        droppable: true,
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.FormLayout),
    },
    designerLocales: locales_1.AllLocales.FormLayout,
});
exports.FormLayout.Resource = core_1.createResource({
    icon: 'FormLayoutSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'FormLayout',
            },
        },
    ],
});
