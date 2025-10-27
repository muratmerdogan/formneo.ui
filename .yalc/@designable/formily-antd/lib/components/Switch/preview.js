"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Switch = antd_1.Switch;
exports.Switch.Behavior = core_1.createBehavior({
    name: 'Switch',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Switch'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Switch),
    },
    designerLocales: locales_1.AllLocales.Switch,
});
exports.Switch.Resource = core_1.createResource({
    icon: 'SwitchSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'boolean',
                title: 'Switch',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
            },
        },
    ],
});
