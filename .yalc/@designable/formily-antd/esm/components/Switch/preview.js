import { Switch as AntdSwitch } from 'antd';
import { createBehavior, createResource } from '@designable/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var Switch = AntdSwitch;
Switch.Behavior = createBehavior({
    name: 'Switch',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'Switch'; },
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Switch),
    },
    designerLocales: AllLocales.Switch,
});
Switch.Resource = createResource({
    icon: 'SwitchSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'boolean',
                title: 'Switch',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
            },
        },
    ],
});
