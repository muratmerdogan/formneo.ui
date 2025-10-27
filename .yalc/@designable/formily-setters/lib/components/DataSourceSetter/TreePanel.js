"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreePanel = void 0;
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var shared_1 = require("@formily/shared");
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@designable/react");
var Title_1 = require("./Title");
var Header_1 = require("./Header");
var shared_2 = require("./shared");
require("./styles.less");
var core_1 = require("@designable/core");
var limitTreeDrag = function (_a) {
    var dropPosition = _a.dropPosition;
    if (dropPosition === 0) {
        return false;
    }
    return true;
};
exports.TreePanel = (0, reactive_react_1.observer)(function (props) {
    var prefix = (0, react_2.usePrefix)('data-source-setter');
    var dropHandler = function (info) {
        var _a, _b;
        var dropKey = (_a = info.node) === null || _a === void 0 ? void 0 : _a.key;
        var dragKey = (_b = info.dragNode) === null || _b === void 0 ? void 0 : _b.key;
        var dropPos = info.node.pos.split('-');
        var dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        var data = __spreadArray([], __read(props.treeDataSource.dataSource), false);
        // Find dragObject
        var dragObj;
        (0, shared_2.traverseTree)(data, function (item, index, arr) {
            if (arr[index].key === dragKey) {
                arr.splice(index, 1);
                dragObj = item;
            }
        });
        if (!info.dropToGap) {
            (0, shared_2.traverseTree)(data, function (item) {
                if (item.key === dropKey) {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                }
            });
        }
        else if ((info.node.children || []).length > 0 &&
            info.node.expanded &&
            dropPosition === 1) {
            (0, shared_2.traverseTree)(data, function (item) {
                if (item.key === dropKey) {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                }
            });
        }
        else {
            var ar_1;
            var i_1;
            (0, shared_2.traverseTree)(data, function (item, index, arr) {
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
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Header_1.Header, { title: react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.DataSourceSetter.dataSourceTree" }), extra: react_1.default.createElement(antd_1.Button, { type: "text", onClick: function () {
                    var _a;
                    var uuid = (0, shared_1.uid)();
                    var dataSource = props.treeDataSource.dataSource;
                    var initialKeyValuePairs = ((_a = props.defaultOptionValue) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (__assign({}, item)); })) || [
                        {
                            label: 'label',
                            value: "".concat(core_1.GlobalRegistry.getDesignerMessage("SettingComponents.DataSourceSetter.item"), " ").concat(dataSource.length + 1),
                        },
                        { label: 'value', value: uuid },
                    ];
                    props.treeDataSource.dataSource = dataSource.concat({
                        key: uuid,
                        duplicateKey: uuid,
                        map: initialKeyValuePairs,
                        children: [],
                    });
                }, icon: react_1.default.createElement(react_2.IconWidget, { infer: "Add" }) },
                react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.DataSourceSetter.addNode" })) }),
        react_1.default.createElement("div", { className: "".concat(prefix + '-layout-item-content') },
            react_1.default.createElement(antd_1.Tree, { blockNode: true, draggable: true, allowDrop: props.allowTree ? function () { return true; } : limitTreeDrag, defaultExpandAll: true, defaultExpandParent: true, autoExpandParent: true, showLine: { showLeafIcon: false }, treeData: props.treeDataSource.dataSource, onDragEnter: function () { }, onDrop: dropHandler, titleRender: function (titleProps) {
                    return (react_1.default.createElement(Title_1.Title, __assign({}, titleProps, { treeDataSource: props.treeDataSource })));
                }, onSelect: function (selectedKeys) {
                    if (selectedKeys[0]) {
                        props.treeDataSource.selectedKey = selectedKeys[0].toString();
                    }
                } }))));
});
