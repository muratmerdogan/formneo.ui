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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsSetter = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@formily/shared");
var core_1 = require("@formily/core");
var react_2 = require("@formily/react");
var core_2 = require("@designable/core");
var shared_2 = require("@designable/shared");
var react_3 = require("@designable/react");
var react_settings_form_1 = require("@designable/react-settings-form");
var antd_1 = require("@formily/antd");
var antd_2 = require("antd");
var PathSelector_1 = require("./PathSelector");
var FieldPropertySetter_1 = require("./FieldPropertySetter");
var helpers_1 = require("./helpers");
var declarations_1 = require("./declarations");
require("./styles.less");
var TypeView = function (_a) {
    var value = _a.value;
    var text = String(value);
    if (text.length <= 26)
        return react_1.default.createElement(antd_2.Tag, null, text);
    return (react_1.default.createElement(antd_2.Tag, null,
        react_1.default.createElement(antd_2.Tooltip, { title: react_1.default.createElement("div", { style: { fontSize: 12 } },
                react_1.default.createElement("code", null,
                    react_1.default.createElement("pre", { style: { whiteSpace: 'pre-wrap', padding: 0, margin: 0 } }, text))) },
            text.substring(0, 24),
            "...")));
};
var SchemaField = (0, react_2.createSchemaField)({
    components: {
        Card: antd_2.Card,
        FormCollapse: antd_1.FormCollapse,
        Input: antd_1.Input,
        TypeView: TypeView,
        Select: antd_1.Select,
        FormItem: antd_1.FormItem,
        PathSelector: PathSelector_1.PathSelector,
        FieldPropertySetter: FieldPropertySetter_1.FieldPropertySetter,
        ArrayTable: antd_1.ArrayTable,
        MonacoInput: react_settings_form_1.MonacoInput,
    },
});
var FieldStateProperties = [
    'value',
    'initialValue',
    'inputValue',
    'inputValues',
    'modified',
    'initialized',
    'title',
    'description',
    'mounted',
    'unmounted',
    'active',
    'visited',
    'loading',
    'errors',
    'warnings',
    'successes',
    'feedbacks',
    'valid',
    'invalid',
    'pattern',
    'display',
    'disabled',
    'readOnly',
    'readPretty',
    'visible',
    'hidden',
    'editable',
    'validateStatus',
    'validating',
];
var FieldStateValueTypes = {
    modified: 'boolean',
    initialized: 'boolean',
    title: 'string',
    description: 'string',
    mounted: 'boolean',
    unmounted: 'boolean',
    active: 'boolean',
    visited: 'boolean',
    loading: 'boolean',
    errors: 'string[]',
    warnings: 'string[]',
    successes: 'string[]',
    feedbacks: "Array<\n  triggerType?: 'onInput' | 'onFocus' | 'onBlur'\n  type?: 'error' | 'success' | 'warning'\n  code?:\n    | 'ValidateError'\n    | 'ValidateSuccess'\n    | 'ValidateWarning'\n    | 'EffectError'\n    | 'EffectSuccess'\n    | 'EffectWarning'\n  messages?: string[]\n>\n",
    valid: 'boolean',
    invalid: 'boolean',
    pattern: "'editable' | 'disabled' | 'readOnly' | 'readPretty'",
    display: "'visible' | 'hidden' | 'none'",
    disabled: 'boolean',
    readOnly: 'boolean',
    readPretty: 'boolean',
    visible: 'boolean',
    hidden: 'boolean',
    editable: 'boolean',
    validateStatus: "'error' | 'warning' | 'success' | 'validating'",
    validating: 'boolean',
};
var ReactionsSetter = function (props) {
    var _a = __read((0, react_1.useState)(false), 2), modalVisible = _a[0], setModalVisible = _a[1];
    var _b = __read((0, react_1.useState)(false), 2), innerVisible = _b[0], setInnerVisible = _b[1];
    var prefix = (0, react_3.usePrefix)('reactions-setter');
    var form = (0, react_1.useMemo)(function () {
        return (0, core_1.createForm)({
            values: (0, shared_1.clone)(props.value),
        });
    }, [modalVisible, props.value]);
    var formCollapse = (0, react_1.useMemo)(function () { return antd_1.FormCollapse.createFormCollapse(['deps', 'state']); }, [modalVisible]);
    var openModal = function () { return setModalVisible(true); };
    var closeModal = function () { return setModalVisible(false); };
    (0, react_1.useEffect)(function () {
        if (modalVisible) {
            (0, shared_2.requestIdle)(function () {
                (0, declarations_1.initDeclaration)().then(function () {
                    setInnerVisible(true);
                });
            }, {
                timeout: 400,
            });
        }
        else {
            setInnerVisible(false);
        }
    }, [modalVisible]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(antd_2.Button, { block: true, onClick: openModal },
            react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.ReactionsSetter.configureReactions" })),
        react_1.default.createElement(antd_2.Modal, { title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.configureReactions'), width: "70%", centered: true, bodyStyle: { padding: 10 }, transitionName: "", maskTransitionName: "", visible: modalVisible, onCancel: closeModal, destroyOnClose: true, onOk: function () {
                form.submit(function (values) {
                    var _a;
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, values);
                });
                closeModal();
            } },
            react_1.default.createElement("div", { className: prefix }, innerVisible && (react_1.default.createElement(antd_1.Form, { form: form },
                react_1.default.createElement(SchemaField, null,
                    react_1.default.createElement(SchemaField.Void, { "x-component": "FormCollapse", "x-component-props": {
                            formCollapse: formCollapse,
                            defaultActiveKey: ['deps', 'state'],
                            style: { marginBottom: 10 },
                        } },
                        react_1.default.createElement(SchemaField.Void, { "x-component": "FormCollapse.CollapsePanel", "x-component-props": {
                                key: 'deps',
                                header: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.relationsFields'),
                            } },
                            react_1.default.createElement(SchemaField.Array, { name: "dependencies", default: [{}], "x-component": "ArrayTable" },
                                react_1.default.createElement(SchemaField.Object, null,
                                    react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayTable.Column", "x-component-props": {
                                            title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.sourceField'),
                                            width: 240,
                                        } },
                                        react_1.default.createElement(SchemaField.String, { name: "source", "x-decorator": "FormItem", "x-component": "PathSelector", "x-component-props": {
                                                placeholder: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.pleaseSelect'),
                                            } })),
                                    react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayTable.Column", "x-component-props": {
                                            title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.sourceProperty'),
                                            width: 200,
                                        } },
                                        react_1.default.createElement(SchemaField.String, { name: "property", default: "value", "x-decorator": "FormItem", "x-component": "Select", "x-component-props": { showSearch: true }, enum: FieldStateProperties })),
                                    react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayTable.Column", "x-component-props": {
                                            title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.variableName'),
                                            width: 200,
                                        } },
                                        react_1.default.createElement(SchemaField.String, { name: "name", "x-decorator": "FormItem", "x-validator": {
                                                pattern: /^[$_a-zA-Z]+[$_a-zA-Z0-9]*$/,
                                                message: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.variableNameValidateMessage'),
                                            }, "x-component": "Input", "x-component-props": {
                                                addonBefore: '$deps.',
                                                placeholder: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.pleaseInput'),
                                            }, "x-reactions": function (field) {
                                                if ((0, core_1.isVoidField)(field))
                                                    return;
                                                field.query('.source').take(function (source) {
                                                    var _a, _b;
                                                    if ((0, core_1.isVoidField)(source))
                                                        return;
                                                    if (source.value &&
                                                        !field.value &&
                                                        !field.modified) {
                                                        field.value =
                                                            ((_b = (_a = source.inputValues[1]) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.name) ||
                                                                "v_".concat((0, shared_1.uid)());
                                                    }
                                                });
                                            } })),
                                    react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayTable.Column", "x-component-props": {
                                            title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.variableType'),
                                            ellipsis: {
                                                showTitle: false,
                                            },
                                            width: 200,
                                            align: 'center',
                                        } },
                                        react_1.default.createElement(SchemaField.String, { name: "type", default: "any", "x-decorator": "FormItem", "x-component": "TypeView", "x-reactions": function (field) {
                                                if ((0, core_1.isVoidField)(field))
                                                    return;
                                                var property = field
                                                    .query('.property')
                                                    .get('inputValues');
                                                if (!property)
                                                    return;
                                                property[0] = property[0] || 'value';
                                                field.query('.source').take(function (source) {
                                                    var _a, _b;
                                                    if ((0, core_1.isVoidField)(source))
                                                        return;
                                                    if (source.value) {
                                                        if (property[0] === 'value' ||
                                                            property[0] === 'initialValue' ||
                                                            property[0] === 'inputValue') {
                                                            field.value =
                                                                ((_b = (_a = source.inputValues[1]) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.type) ||
                                                                    'any';
                                                        }
                                                        else if (property[0] === 'inputValues') {
                                                            field.value = "any[]";
                                                        }
                                                        else if (property[0]) {
                                                            field.value =
                                                                FieldStateValueTypes[property[0]];
                                                        }
                                                        else {
                                                            field.value = 'any';
                                                        }
                                                    }
                                                });
                                            } })),
                                    react_1.default.createElement(SchemaField.Void, { "x-component": "ArrayTable.Column", "x-component-props": {
                                            title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.operations'),
                                            align: 'center',
                                            width: 80,
                                        } },
                                        react_1.default.createElement(SchemaField.Markup, { type: "void", "x-component": "ArrayTable.Remove" }))),
                                react_1.default.createElement(SchemaField.Void, { title: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.addRelationField'), "x-component": "ArrayTable.Addition", "x-component-props": { style: { marginTop: 8 } } }))),
                        react_1.default.createElement(SchemaField.Void, { "x-component": "FormCollapse.CollapsePanel", "x-component-props": {
                                header: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.propertyReactions'),
                                key: 'state',
                                className: 'reaction-state',
                            } },
                            react_1.default.createElement(SchemaField.Markup, { name: "fulfill.state", "x-component": "FieldPropertySetter" })),
                        react_1.default.createElement(SchemaField.Void, { "x-component": "FormCollapse.CollapsePanel", "x-component-props": {
                                key: 'run',
                                header: core_2.GlobalRegistry.getDesignerMessage('SettingComponents.ReactionsSetter.actionReactions'),
                                className: 'reaction-runner',
                            } },
                            react_1.default.createElement(SchemaField.String, { name: "fulfill.run", "x-component": "MonacoInput", "x-component-props": {
                                    width: '100%',
                                    height: 400,
                                    language: 'typescript',
                                    helpCode: helpers_1.FulfillRunHelper,
                                    options: {
                                        minimap: {
                                            enabled: false,
                                        },
                                    },
                                }, "x-reactions": function (field) {
                                    var deps = field.query('dependencies').value();
                                    if (Array.isArray(deps)) {
                                        field.componentProps.extraLib = "\n                          declare var $deps : {\n                            ".concat(deps.map(function (_a) {
                                            var name = _a.name, type = _a.type;
                                            if (!name)
                                                return '';
                                            return "".concat(name, "?:").concat(type || 'any', ",");
                                        }), "\n                          }\n                          ");
                                    }
                                } }))))))))));
};
exports.ReactionsSetter = ReactionsSetter;
