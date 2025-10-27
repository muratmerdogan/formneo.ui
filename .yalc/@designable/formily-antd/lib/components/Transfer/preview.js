"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Transfer = antd_1.Transfer;
exports.Transfer.Behavior = core_1.createBehavior({
    name: 'Transfer',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Transfer'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Transfer),
    },
    designerLocales: locales_1.AllLocales.Transfer,
});
exports.Transfer.Resource = core_1.createResource({
    icon: 'TransferSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Transfer',
                'x-decorator': 'FormItem',
                'x-component': 'Transfer',
            },
        },
    ],
});
