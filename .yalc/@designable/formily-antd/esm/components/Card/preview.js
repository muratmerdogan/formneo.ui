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
import React from 'react';
import { Card as AntdCard } from 'antd';
import { createBehavior, createResource } from '@designable/core';
import { createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var Card = function (props) {
    return (React.createElement(AntdCard, __assign({}, props, { title: React.createElement("span", { "data-content-editable": "x-component-props.title" }, props.title) }), props.children));
};
Card.Behavior = createBehavior({
    name: 'Card',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Card'; },
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AllSchemas.Card),
    },
    designerLocales: AllLocales.Card,
});
Card.Resource = createResource({
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
