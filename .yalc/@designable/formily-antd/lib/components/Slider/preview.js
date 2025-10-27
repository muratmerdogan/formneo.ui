"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Slider = antd_1.Slider;
exports.Slider.Behavior = core_1.createBehavior({
    name: 'Slider',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Slider'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Slider),
    },
    designerLocales: locales_1.AllLocales.Slider,
});
exports.Slider.Resource = core_1.createResource({
    icon: 'SliderSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                title: 'Slider',
                'x-decorator': 'FormItem',
                'x-component': 'Slider',
            },
        },
    ],
});
