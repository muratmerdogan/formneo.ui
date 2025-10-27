"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Password = antd_1.Password;
exports.Password.Behavior = core_1.createBehavior({
    name: 'Password',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Password'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Password),
    },
    designerLocales: locales_1.AllLocales.Password,
});
exports.Password.Resource = core_1.createResource({
    icon: 'PasswordSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Password',
                'x-decorator': 'FormItem',
                'x-component': 'Password',
            },
        },
    ],
});
