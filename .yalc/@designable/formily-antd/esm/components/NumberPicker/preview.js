import { NumberPicker as FormilyNumberPicker } from '@formily/antd';
import { createBehavior, createResource } from '@designable/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var NumberPicker = FormilyNumberPicker;
NumberPicker.Behavior = createBehavior({
    name: 'NumberPicker',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'NumberPicker'; },
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.NumberPicker),
    },
    designerLocales: AllLocales.NumberPicker,
});
NumberPicker.Resource = createResource({
    icon: 'NumberPickerSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                title: 'NumberPicker',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
            },
        },
    ],
});
