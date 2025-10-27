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
exports.Card = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
var Card = function (props) {
    return (react_1.default.createElement(antd_1.Card, __assign({}, props, { title: react_1.default.createElement("span", { "data-content-editable": "x-component-props.title" }, props.title) }), props.children));
};
exports.Card = Card;
exports.Card.Behavior = core_1.createBehavior({
    name: 'Card',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Card'; },
    designerProps: {
        droppable: true,
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.Card),
    },
    designerLocales: locales_1.AllLocales.Card,
});
exports.Card.Resource = core_1.createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                    title: 'Title',
                },
            },
        },
    ],
});
