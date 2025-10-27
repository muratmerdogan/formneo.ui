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
import React, { Fragment, useMemo, useState } from 'react';
import cls from 'classnames';
import { Modal, Button } from 'antd';
import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { usePrefix, useTheme, TextWidget } from '@designable/react';
import { DataSettingPanel } from './DataSettingPanel';
import { TreePanel } from './TreePanel';
import { transformDataToValue, transformValueToData } from './shared';
import './styles.less';
export var DataSourceSetter = observer(function (props) {
    var className = props.className, _a = props.value, value = _a === void 0 ? [] : _a, onChange = props.onChange, _b = props.allowTree, allowTree = _b === void 0 ? true : _b, _c = props.allowExtendOption, allowExtendOption = _c === void 0 ? true : _c, defaultOptionValue = props.defaultOptionValue, _d = props.effects, effects = _d === void 0 ? function () { } : _d;
    var theme = useTheme();
    var prefix = usePrefix('data-source-setter');
    var _e = __read(useState(false), 2), modalVisible = _e[0], setModalVisible = _e[1];
    var treeDataSource = useMemo(function () {
        return observable({
            dataSource: transformValueToData(value),
            selectedKey: '',
        });
    }, [value, modalVisible]);
    var openModal = function () { return setModalVisible(true); };
    var closeModal = function () { return setModalVisible(false); };
    return (React.createElement(Fragment, null,
        React.createElement(Button, { block: true, onClick: openModal },
            React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.configureDataSource" })),
        React.createElement(Modal, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.configureDataSource" }), width: "65%", bodyStyle: { padding: 10 }, transitionName: "", maskTransitionName: "", visible: modalVisible, onCancel: closeModal, onOk: function () {
                onChange(transformDataToValue(treeDataSource.dataSource));
                closeModal();
            } },
            React.createElement("div", { className: "".concat(cls(prefix, className), " ").concat(prefix + '-' + theme, " ").concat(prefix + '-layout') },
                React.createElement("div", { className: "".concat(prefix + '-layout-item left') },
                    React.createElement(TreePanel, { defaultOptionValue: defaultOptionValue, allowTree: allowTree, treeDataSource: treeDataSource })),
                React.createElement("div", { className: "".concat(prefix + '-layout-item right') },
                    React.createElement(DataSettingPanel, { allowExtendOption: allowExtendOption, treeDataSource: treeDataSource, effects: effects }))))));
});
