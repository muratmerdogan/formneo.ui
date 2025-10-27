import { Cascader as FormilyCascader } from '@formily/antd';
import { createBehavior, createResource } from '@designable/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var Cascader = FormilyCascader;
Cascader.Behavior = createBehavior({
    name: 'Cascader',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Cascader'; },
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Cascader),
    },
    designerLocales: AllLocales.Cascader,
});
Cascader.Resource = createResource({
    icon: 'CascaderSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Cascader',
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
            },
        },
    ],
});
