import React, { useMemo, Fragment } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ArrayItems, Form, Input, FormItem } from '@formily/antd';
import { createForm } from '@formily/core';
import { observer } from '@formily/reactive-react';
import { createSchemaField } from '@formily/react';
import { ValueInput } from '@designable/react-settings-form';
import { usePrefix, TextWidget } from '@designable/react';
import { Header } from './Header';
import { traverseTree } from './shared';
import './styles.less';
var SchemaField = createSchemaField({
    components: {
        FormItem: FormItem,
        Input: Input,
        ArrayItems: ArrayItems,
        ValueInput: ValueInput,
    },
});
export var DataSettingPanel = observer(function (props) {
    var allowExtendOption = props.allowExtendOption, effects = props.effects;
    var prefix = usePrefix('data-source-setter');
    var form = useMemo(function () {
        var values;
        traverseTree(props.treeDataSource.dataSource, function (dataItem) {
            if (dataItem.key === props.treeDataSource.selectedKey) {
                values = dataItem;
            }
        });
        return createForm({
            values: values,
            effects: effects,
        });
    }, [
        props.treeDataSource.selectedKey,
        props.treeDataSource.dataSource.length,
    ]);
    if (!props.treeDataSource.selectedKey)
        return (React.createElement(Fragment, null,
            React.createElement(Header, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.nodeProperty" }), extra: null }),
            React.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
                React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.pleaseSelectNode" }))));
    return (React.createElement(Fragment, null,
        React.createElement(Header, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.nodeProperty" }), extra: allowExtendOption ? (React.createElement(Button, { type: "text", onClick: function () {
                    form.setFieldState('map', function (state) {
                        state.value.push({});
                    });
                }, icon: React.createElement(PlusOutlined, null) },
                React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.addKeyValuePair" }))) : null }),
        React.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
            React.createElement(Form, { form: form, labelWidth: 60, wrapperWidth: 160 },
                React.createElement(SchemaField, null,
                    React.createElement(SchemaField.Array, { name: "map", "x-component": "ArrayItems" },
                        React.createElement(SchemaField.Object, { "x-decorator": "ArrayItems.Item", "x-decorator-props": { type: 'divide' } },
                            React.createElement(SchemaField.String, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.label" }), "x-decorator": "FormItem", "x-disabled": !allowExtendOption, name: "label", "x-component": "Input" }),
                            React.createElement(SchemaField.String, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.value" }), "x-decorator": "FormItem", name: "value", "x-component": "ValueInput" }),
                            React.createElement(SchemaField.Void, { "x-component": "ArrayItems.Remove", "x-visible": allowExtendOption, "x-component-props": {
                                    style: {
                                        margin: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                } }))))))));
});
