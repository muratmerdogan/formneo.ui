"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectContainer = void 0;
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var Container_1 = require("../../common/Container");
var locales_1 = require("../../locales");
exports.ObjectContainer = Container_1.Container;
exports.ObjectContainer.Behavior = core_1.createBehavior({
    name: 'Object',
    extends: ['Field'],
    selector: function (node) { return node.props.type === 'object'; },
    designerProps: {
        droppable: true,
        propsSchema: Field_1.createFieldSchema(),
    },
    designerLocales: locales_1.AllLocales.ObjectLocale,
});
exports.ObjectContainer.Resource = core_1.createResource({
    icon: 'ObjectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'object',
            },
        },
    ],
});
