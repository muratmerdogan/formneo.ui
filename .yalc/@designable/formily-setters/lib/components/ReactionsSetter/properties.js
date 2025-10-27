"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldProperties = void 0;
var helpers_1 = require("./helpers");
exports.FieldProperties = [
    {
        key: 'visible',
        type: 'boolean',
        helpCode: helpers_1.BooleanHelper,
    },
    { key: 'hidden', type: 'boolean', helpCode: helpers_1.BooleanHelper },
    {
        key: 'display',
        type: '"visible" | "hidden" | "none"',
        helpCode: helpers_1.DisplayHelper,
    },
    {
        key: 'pattern',
        type: '"editable" | "disabled" | "readOnly" | "readPretty"',
        helpCode: helpers_1.PatternHelper,
    },
    { key: 'title', type: 'string', helpCode: helpers_1.StringHelper },
    { key: 'description', type: 'string', helpCode: helpers_1.StringHelper },
    { key: 'value', type: 'any', helpCode: helpers_1.AnyHelper },
    { key: 'initialValue', type: 'any', helpCode: helpers_1.AnyHelper },
    { key: 'required', type: 'boolean', helpCode: helpers_1.BooleanHelper },
    {
        key: 'dataSource',
        type: 'Array<{label?:string,value?:any}>',
        helpCode: helpers_1.DataSourceHelper,
    },
    {
        key: 'componentProps',
        token: 'componentProps',
        type: 'object',
        helpCode: helpers_1.ComponentPropsHelper,
    },
    {
        key: 'decoratorProps',
        token: 'decoratorProps',
        type: 'object',
        helpCode: helpers_1.DecoratorPropsHelper,
    },
];
