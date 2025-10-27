import { TreeSelect as FormilyTreeSelect } from '@formily/antd';
import { createBehavior, createResource } from '@designable/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var TreeSelect = FormilyTreeSelect;
TreeSelect.Behavior = createBehavior({
    name: 'TreeSelect',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'TreeSelect'; },
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.TreeSelect),
    },
    designerLocales: AllLocales.TreeSelect,
});
TreeSelect.Resource = createResource({
    icon: 'TreeSelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'TreeSelect',
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
            },
        },
    ],
});
