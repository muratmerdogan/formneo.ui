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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceSetter = void 0;
var react_1 = __importStar(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var antd_1 = require("antd");
var reactive_1 = require("@formily/reactive");
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@designable/react");
var DataSettingPanel_1 = require("./DataSettingPanel");
var TreePanel_1 = require("./TreePanel");
var shared_1 = require("./shared");
require("./styles.less");
exports.DataSourceSetter = (0, reactive_react_1.observer)(function (props) {
    var className = props.className, _a = props.value, value = _a === void 0 ? [] : _a, onChange = props.onChange, _b = props.allowTree, allowTree = _b === void 0 ? true : _b, _c = props.allowExtendOption, allowExtendOption = _c === void 0 ? true : _c, defaultOptionValue = props.defaultOptionValue, _d = props.effects, effects = _d === void 0 ? function () { } : _d;
    var theme = (0, react_2.useTheme)();
    var prefix = (0, react_2.usePrefix)('data-source-setter');
    var _e = __read((0, react_1.useState)(false), 2), modalVisible = _e[0], setModalVisible = _e[1];
    var treeDataSource = (0, react_1.useMemo)(function () {
        return (0, reactive_1.observable)({
            dataSource: (0, shared_1.transformValueToData)(value),
            selectedKey: '',
        });
    }, [value, modalVisible]);
    var openModal = function () { return setModalVisible(true); };
    var closeModal = function () { return setModalVisible(false); };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(antd_1.Button, { block: true, onClick: openModal },
            react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.DataSourceSetter.configureDataSource" })),
        react_1.default.createElement(antd_1.Modal, { title: react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.DataSourceSetter.configureDataSource" }), width: "65%", bodyStyle: { padding: 10 }, transitionName: "", maskTransitionName: "", visible: modalVisible, onCancel: closeModal, onOk: function () {
                onChange((0, shared_1.transformDataToValue)(treeDataSource.dataSource));
                closeModal();
            } },
            react_1.default.createElement("div", { className: "".concat((0, classnames_1.default)(prefix, className), " ").concat(prefix + '-' + theme, " ").concat(prefix + '-layout') },
                react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item left') },
                    react_1.default.createElement(TreePanel_1.TreePanel, { defaultOptionValue: defaultOptionValue, allowTree: allowTree, treeDataSource: treeDataSource })),
                react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item right') },
                    react_1.default.createElement(DataSettingPanel_1.DataSettingPanel, { allowExtendOption: allowExtendOption, treeDataSource: treeDataSource, effects: effects }))))));
});
