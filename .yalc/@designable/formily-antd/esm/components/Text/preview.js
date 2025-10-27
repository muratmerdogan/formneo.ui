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
import { createBehavior, createResource } from '@designable/core';
import { createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import cls from 'classnames';
import './styles.less';
export var Text = function (props) {
    var tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode;
    return React.createElement(tagName, __assign(__assign({}, props), { className: cls(props.className, 'dn-text'), 'data-content-editable': 'x-component-props.content' }), props.content);
};
Text.Behavior = createBehavior({
    name: 'Text',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Text'; },
    designerProps: {
        propsSchema: createVoidFieldSchema(AllSchemas.Text),
    },
    designerLocales: AllLocales.Text,
});
Text.Resource = createResource({
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
