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
import React, { useMemo } from 'react';
import { createBehavior, createResource } from '@designable/core';
import { createForm } from '@formily/core';
import { observer } from '@formily/react';
import { Form as FormilyForm } from '@formily/antd';
import { usePrefix } from '@designable/react';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import './styles.less';
export var Form = observer(function (props) {
    var prefix = usePrefix('designable-form');
    var form = useMemo(function () {
        return createForm({
            designable: true,
        });
    }, []);
    return (React.createElement(FormilyForm, __assign({}, props, { style: __assign({}, props.style), className: prefix, form: form }), props.children));
});
Form.Behavior = createBehavior({
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
                properties: __assign(__assign({}, AllSchemas.FormLayout.properties), { style: AllSchemas.CSSStyle }),
            },
            defaultProps: {
                labelCol: 6,
                wrapperCol: 12,
            },
        };
    },
    designerLocales: AllLocales.Form,
});
Form.Resource = createResource({
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
