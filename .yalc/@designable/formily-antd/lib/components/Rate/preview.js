"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rate = void 0;
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Rate = antd_1.Rate;
exports.Rate.Behavior = core_1.createBehavior({
    name: 'Rate',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Rate'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Rate),
    },
    designerLocales: locales_1.AllLocales.Rate,
});
exports.Rate.Resource = core_1.createResource({
    icon: 'RateSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                title: 'Rate',
                'x-decorator': 'FormItem',
                'x-component': 'Rate',
            },
        },
    ],
});
