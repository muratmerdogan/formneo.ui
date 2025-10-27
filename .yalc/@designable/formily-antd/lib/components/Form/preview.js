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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@designable/core");
var core_2 = require("@formily/core");
var react_2 = require("@formily/react");
var antd_1 = require("@formily/antd");
var react_3 = require("@designable/react");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
require("./styles.less");
exports.Form = react_2.observer(function (props) {
    var prefix = react_3.usePrefix('designable-form');
    var form = react_1.useMemo(function () {
        return core_2.createForm({
            designable: true,
        });
    }, []);
    return (react_1.default.createElement(antd_1.Form, __assign({}, props, { style: __assign({}, props.style), className: prefix, form: form }), props.children));
});
exports.Form.Behavior = core_1.createBehavior({
    name: 'Form',
    selector: function (node) { return node.componentName === 'Form'; },
    designerProps: function (node) {
        return {
            draggable: !node.isRoot,
            cloneable: !node.isRoot,
            deletable: !node.isRoot,
            droppable: true,
            propsSchema: {
                type: 'object',
                properties: __assign(__assign({}, schemas_1.AllSchemas.FormLayout.properties), { style: schemas_1.AllSchemas.CSSStyle }),
            },
            defaultProps: {
                labelCol: 6,
                wrapperCol: 12,
            },
        };
    },
    designerLocales: locales_1.AllLocales.Form,
});
exports.Form.Resource = core_1.createResource({
    title: { 'zh-CN': '表单', 'en-US': 'Form' },
    icon: 'FormLayoutSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'object',
                'x-component': 'Form',
            },
        },
    ],
});
