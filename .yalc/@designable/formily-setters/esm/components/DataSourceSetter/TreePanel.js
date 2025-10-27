var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { Fragment } from 'react';
import { Tree, Button } from 'antd';
import { uid } from '@formily/shared';
import { observer } from '@formily/reactive-react';
import { usePrefix, TextWidget, IconWidget } from '@designable/react';
import { Title } from './Title';
import { Header } from './Header';
import { traverseTree } from './shared';
import './styles.less';
import { GlobalRegistry } from '@designable/core';
var limitTreeDrag = function (_a) {
    var dropPosition = _a.dropPosition;
    if (dropPosition === 0) {
        return false;
    }
    return true;
};
export var TreePanel = observer(function (props) {
    var prefix = usePrefix('data-source-setter');
    var dropHandler = function (info) {
        var _a, _b;
        var dropKey = (_a = info.node) === null || _a === void 0 ? void 0 : _a.key;
        var dragKey = (_b = info.dragNode) === null || _b === void 0 ? void 0 : _b.key;
        var dropPos = info.node.pos.split('-');
        var dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        var data = __spreadArray([], __read(props.treeDataSource.dataSource), false);
        // Find dragObject
        var dragObj;
        traverseTree(data, function (item, index, arr) {
            if (arr[index].key === dragKey) {
                arr.splice(index, 1);
                dragObj = item;
            }
        });
        if (!info.dropToGap) {
            traverseTree(data, function (item) {
                if (item.key === dropKey) {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                }
            });
        }
        else if ((info.node.children || []).length > 0 &&
            info.node.expanded &&
            dropPosition === 1) {
            traverseTree(data, function (item) {
                if (item.key === dropKey) {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                }
            });
        }
        else {
            var ar_1;
            var i_1;
            traverseTree(data, function (item, index, arr) {
                if (item.key === dropKey) {
                    ar_1 = arr;
                    i_1 = index;
                }
            });
            if (dropPosition === -1) {
                ar_1.splice(i_1, 0, dragObj);
            }
            else {
                ar_1.splice(i_1 + 1, 0, dragObj);
            }
        }
        props.treeDataSource.dataSource = data;
    };
    return (React.createElement(Fragment, null,
        React.createElement(Header, { title: React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.dataSourceTree" }), extra: React.createElement(Button, { type: "text", onClick: function () {
                    var _a;
                    var uuid = uid();
                    var dataSource = props.treeDataSource.dataSource;
                    var initialKeyValuePairs = ((_a = props.defaultOptionValue) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (__assign({}, item)); })) || [
                        {
                            label: 'label',
                            value: "".concat(GlobalRegistry.getDesignerMessage("SettingComponents.DataSourceSetter.item"), " ").concat(dataSource.length + 1),
                        },
                        { label: 'value', value: uuid },
                    ];
                    props.treeDataSource.dataSource = dataSource.concat({
                        key: uuid,
                        duplicateKey: uuid,
                        map: initialKeyValuePairs,
                        children: [],
                    });
                }, icon: React.createElement(IconWidget, { infer: "Add" }) },
                React.createElement(TextWidget, { token: "SettingComponents.DataSourceSetter.addNode" })) }),
        React.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
            React.createElement(Tree, { blockNode: true, draggable: true, allowDrop: props.allowTree ? function () { return true; } : limitTreeDrag, defaultExpandAll: true, defaultExpandParent: true, autoExpandParent: true, showLine: { showLeafIcon: false }, treeData: props.treeDataSource.dataSource, onDragEnter: function () { }, onDrop: dropHandler, titleRender: function (titleProps) {
                    return (React.createElement(Title, __assign({}, titleProps, { treeDataSource: props.treeDataSource })));
                }, onSelect: function (selectedKeys) {
                    if (selectedKeys[0]) {
                        props.treeDataSource.selectedKey = selectedKeys[0].toString();
                    }
                } }))));
});
