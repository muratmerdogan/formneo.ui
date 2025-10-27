import { Select as FormilySelect } from '@formily/antd';
import { createBehavior, createResource } from '@designable/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var Select = FormilySelect;
Select.Behavior = createBehavior({
    name: 'Select',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Select'; },
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Select),
    },
    designerLocales: AllLocales.Select,
});
Select.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Select',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
            },
        },
    ],
});
