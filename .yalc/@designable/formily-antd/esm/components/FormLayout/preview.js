import { FormLayout as FormilyFormLayout } from '@formily/antd';
import { createBehavior, createResource } from '@designable/core';
import { withContainer } from '../../common/Container';
import { createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var FormLayout = withContainer(FormilyFormLayout);
FormLayout.Behavior = createBehavior({
    name: 'FormLayout',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormLayout'; },
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AllSchemas.FormLayout),
    },
    designerLocales: AllLocales.FormLayout,
});
FormLayout.Resource = createResource({
    icon: 'FormLayoutSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'FormLayout',
            },
        },
    ],
});
