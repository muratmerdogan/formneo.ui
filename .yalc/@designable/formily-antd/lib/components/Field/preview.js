"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@formily/core");
var reactive_1 = require("@formily/reactive");
var react_2 = require("@formily/react");
var antd_1 = require("@formily/antd");
var shared_1 = require("@formily/shared");
var core_2 = require("@designable/core");
var react_3 = require("@designable/react");
var shared_2 = require("@designable/shared");
var Container_1 = require("../../common/Container");
var locales_1 = require("../../locales");
react_2.Schema.silent(true);
var SchemaStateMap = {
    title: 'title',
    description: 'description',
    default: 'value',
    enum: 'dataSource',
    readOnly: 'readOnly',
    writeOnly: 'editable',
    required: 'required',
    'x-content': 'content',
    'x-value': 'value',
    'x-editable': 'editable',
    'x-disabled': 'disabled',
    'x-read-pretty': 'readPretty',
    'x-read-only': 'readOnly',
    'x-visible': 'visible',
    'x-hidden': 'hidden',
    'x-display': 'display',
    'x-pattern': 'pattern',
};
var NeedShownExpression = {
    title: true,
    description: true,
    default: true,
    'x-content': true,
    'x-value': true,
};
var isExpression = function (val) { return shared_2.isStr(val) && /^\{\{.*\}\}$/.test(val); };
var filterExpression = function (val) {
    if (typeof val === 'object') {
        var isArray_1 = shared_2.isArr(val);
        var results = shared_1.reduce(val, function (buf, value, key) {
            if (isExpression(value)) {
                return buf;
            }
            else {
                var results_1 = filterExpression(value);
                if (results_1 === undefined || results_1 === null)
                    return buf;
                if (isArray_1) {
                    return buf.concat([results_1]);
                }
                buf[key] = results_1;
                return buf;
            }
        }, isArray_1 ? [] : {});
        return results;
    }
    if (isExpression(val)) {
        return;
    }
    return val;
};
var toDesignableFieldProps = function (schema, components, nodeIdAttrName, id) {
    var results = {};
    shared_1.each(SchemaStateMap, function (fieldKey, schemaKey) {
        var value = schema[schemaKey];
        if (isExpression(value)) {
            if (!NeedShownExpression[schemaKey])
                return;
            if (value) {
                results[fieldKey] = value;
                return;
            }
        }
        else if (value) {
            results[fieldKey] = filterExpression(value);
        }
    });
    if (!components['FormItem']) {
        components['FormItem'] = antd_1.FormItem;
    }
    var decorator = schema['x-decorator'] && core_1.FormPath.getIn(components, schema['x-decorator']);
    var component = schema['x-component'] && core_1.FormPath.getIn(components, schema['x-component']);
    var decoratorProps = schema['x-decorator-props'] || {};
    var componentProps = schema['x-component-props'] || {};
    if (decorator) {
        results.decorator = [decorator, reactive_1.toJS(decoratorProps)];
    }
    if (component) {
        results.component = [component, reactive_1.toJS(componentProps)];
    }
    if (decorator) {
        core_1.FormPath.setIn(results['decorator'][1], nodeIdAttrName, id);
    }
    else if (component) {
        core_1.FormPath.setIn(results['component'][1], nodeIdAttrName, id);
    }
    results.title = results.title && (react_1.default.createElement("span", { "data-content-editable": "title" }, results.title));
    results.description = results.description && (react_1.default.createElement("span", { "data-content-editable": "description" }, results.description));
    return results;
};
exports.Field = react_2.observer(function (props) {
    var designer = react_3.useDesigner();
    var components = react_3.useComponents();
    var node = react_3.useTreeNode();
    if (!node)
        return null;
    var fieldProps = toDesignableFieldProps(props, components, designer.props.nodeIdAttrName, node.id);
    if (props.type === 'object') {
        return (react_1.default.createElement(Container_1.Container, null,
            react_1.default.createElement(react_2.ObjectField, __assign({}, fieldProps, { name: node.id }), props.children)));
    }
    else if (props.type === 'array') {
        return react_1.default.createElement(react_2.ArrayField, __assign({}, fieldProps, { name: node.id }));
    }
    else if (node.props.type === 'void') {
        return (react_1.default.createElement(react_2.VoidField, __assign({}, fieldProps, { name: node.id }), props.children));
    }
    return react_1.default.createElement(react_2.Field, __assign({}, fieldProps, { name: node.id }));
});
exports.Field.Behavior = core_2.createBehavior({
    name: 'Field',
    selector: 'Field',
    designerLocales: locales_1.AllLocales.Field,
});
