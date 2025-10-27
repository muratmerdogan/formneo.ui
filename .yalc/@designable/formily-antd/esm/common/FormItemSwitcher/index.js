import React from 'react';
import { Switch } from 'antd';
export var FormItemSwitcher = function (props) {
    return (React.createElement(Switch, { checked: props.value === 'FormItem', onChange: function (value) {
            props.onChange(value ? 'FormItem' : undefined);
        } }));
};
