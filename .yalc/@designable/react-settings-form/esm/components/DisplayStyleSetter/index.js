import React from 'react';
import { useField, Field, observer } from '@formily/react';
import { FormItem } from '@formily/antd';
import { Radio } from 'antd';
import { usePrefix, IconWidget } from '@designable/react';
import { FlexStyleSetter } from '../FlexStyleSetter';
import cls from 'classnames';
import './styles.less';
export var DisplayStyleSetter = observer(function (props) {
    var field = useField();
    var prefix = usePrefix('display-style-setter');
    return (React.createElement(React.Fragment, null,
        React.createElement(FormItem.BaseItem, { label: field.title, className: cls(prefix, props.className), style: props.style },
            React.createElement(Radio.Group, { className: prefix + '-radio', options: [
                    {
                        label: React.createElement(IconWidget, { infer: "DisplayBlock", size: 16 }),
                        value: 'block',
                    },
                    {
                        label: React.createElement(IconWidget, { infer: "DisplayInlineBlock", size: 16 }),
                        value: 'inline-block',
                    },
                    {
                        label: React.createElement(IconWidget, { infer: "DisplayInline", size: 16 }),
                        value: 'inline',
                    },
                    {
                        label: React.createElement(IconWidget, { infer: "DisplayFlex", size: 16 }),
                        value: 'flex',
                    },
                ], value: props.value, onChange: function (e) {
                    var _a;
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, e.target.value);
                }, optionType: "button" })),
        React.createElement(Field, { name: "flex", basePath: field.address.parent(), visible: false, reactions: function (flexField) {
                flexField.visible = field.value === 'flex';
            }, component: [FlexStyleSetter] })));
});
