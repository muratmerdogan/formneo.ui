"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSettingPanel = void 0;
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var antd_2 = require("@formily/antd");
var core_1 = require("@formily/core");
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@formily/react");
var react_settings_form_1 = require("@designable/react-settings-form");
var react_3 = require("@designable/react");
var Header_1 = require("./Header");
var shared_1 = require("./shared");
require("./styles.less");
var SchemaField = (0, react_2.createSchemaField)({
    components: {
        FormItem: antd_2.FormItem,
        Input: antd_2.Input,
        ArrayItems: antd_2.ArrayItems,
        ValueInput: react_settings_form_1.ValueInput,
    },
});
exports.DataSettingPanel = (0, reactive_react_1.observer)(function (props) {
    var allowExtendOption = props.allowExtendOption, effects = props.effects;
    var prefix = (0, react_3.usePrefix)('data-source-setter');
    var form = (0, react_1.useMemo)(function () {
        var values;
        (0, shared_1.traverseTree)(props.treeDataSource.dataSource, function (dataItem) {
            if (dataItem.key === props.treeDataSource.selectedKey) {
                values = dataItem;
            }
        });
        return (0, core_1.createForm)({
            values: values,
            effects: effects,
        });
    }, [
        props.treeDataSource.selectedKey,
        props.treeDataSource.dataSource.length,
    ]);
    if (!props.treeDataSource.selectedKey)
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(Header_1.Header, { title: react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.nodeProperty" }), extra: null }),
            react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
                react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.pleaseSelectNode" }))));
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Header_1.Header, { title: react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.nodeProperty" }), extra: allowExtendOption ? (react_1.default.createElement(antd_1.Button, { type: "text", onClick: function () {
                    form.setFieldState('map', function (state) {
                        state.value.push({});
                    });
                }, icon: react_1.default.createElement(icons_1.PlusOutlined, null) },
                react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.addKeyValuePair" }))) : null }),
        react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
            react_1.default.createElement(antd_2.Form, { form: form, labelWidth: 60, wrapperWidth: 160 },
                react_1.default.createElement(SchemaField, null,
                    react_1.default.createElement(SchemaField.Array, { name: "map", "x-component": "ArrayItems" },
                        react_1.default.createElement(SchemaField.Object, { "x-decorator": "ArrayItems.Item", "x-decorator-props": { type: 'divide' } },
                            react_1.default.createElement(SchemaField.String, { title: react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.label" }), "x-decorator": "FormItem", "x-disabled": !allowExtendOption, name: "label", "x-component": "Input" }),
                            react_1.default.createElement(SchemaField.String, { title: react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.DataSourceSetter.value" }), "x-decorator": "FormItem", name: "value", "x-component": "ValueInput" }),
                            react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayItems.Remove", "x-visible": allowExtendOption, "x-component-props": {
                                    style: {
                                        margin: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                } }))))))));
});
