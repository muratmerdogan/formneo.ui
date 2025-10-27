"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var Container_1 = require("../../common/Container");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Space = Container_1.withContainer(antd_1.Space);
exports.Space.Behavior = core_1.createBehavior({
    name: 'Space',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Space'; },
    designerProps: {
        droppable: true,
        inlineChildrenLayout: true,
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.Space),
    },
    designerLocales: locales_1.AllLocales.Space,
});
exports.Space.Resource = core_1.createResource({
    icon: 'SpaceSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'Space',
            },
        },
    ],
});
