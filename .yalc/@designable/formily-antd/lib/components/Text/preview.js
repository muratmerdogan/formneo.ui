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
exports.Text = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var Text = function (props) {
    var tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode;
    return react_1.default.createElement(tagName, __assign(__assign({}, props), { className: classnames_1.default(props.className, 'dn-text'), 'data-content-editable': 'x-component-props.content' }), props.content);
};
exports.Text = Text;
exports.Text.Behavior = core_1.createBehavior({
    name: 'Text',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Text'; },
    designerProps: {
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.Text),
    },
    designerLocales: locales_1.AllLocales.Text,
});
exports.Text.Resource = core_1.createResource({
    icon: 'TextSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string',
                'x-component': 'Text',
            },
        },
    ],
});
