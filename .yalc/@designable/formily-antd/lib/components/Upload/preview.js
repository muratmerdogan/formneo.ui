"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
exports.Upload = antd_1.Upload;
exports.Upload.Behavior = core_1.createBehavior({
    name: 'Upload',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Upload'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Upload),
    },
    designerLocales: locales_1.AllLocales.Upload,
}, {
    name: 'Upload.Dragger',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Upload.Dragger'; },
    designerProps: {
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.Upload.Dragger),
    },
    designerLocales: locales_1.AllLocales.UploadDragger,
});
exports.Upload.Resource = core_1.createResource({
    icon: 'UploadSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array<object>',
                title: 'Upload',
                'x-decorator': 'FormItem',
                'x-component': 'Upload',
                'x-component-props': {
                    textContent: 'Upload',
                },
            },
        },
    ],
}, {
    icon: 'UploadDraggerSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array<object>',
                title: 'Drag Upload',
                'x-decorator': 'FormItem',
                'x-component': 'Upload.Dragger',
                'x-component-props': {
                    textContent: 'Click or drag file to this area to upload',
                },
            },
        },
    ],
});
