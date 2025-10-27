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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayTable = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var react_2 = require("@designable/react");
var antd_2 = require("@formily/antd");
var react_3 = require("@formily/react");
var LoadTemplate_1 = require("../../common/LoadTemplate");
var classnames_1 = __importDefault(require("classnames"));
var shared_1 = require("../../shared");
var hooks_1 = require("../../hooks");
var ArrayBase_1 = require("../ArrayBase");
require("./styles.less");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
var ensureObjectItemsNode = shared_1.createEnsureTypeItemsNode('object');
var HeaderCell = function (props) {
    var _a;
    return (react_1.default.createElement("th", __assign({}, props, { "data-designer-node-id": (_a = props.className.match(/data-id\:([^\s]+)/)) === null || _a === void 0 ? void 0 : _a[1] }), props.children));
};
var BodyCell = function (props) {
    var _a;
    return (react_1.default.createElement("td", __assign({}, props, { "data-designer-node-id": (_a = props.className.match(/data-id\:([^\s]+)/)) === null || _a === void 0 ? void 0 : _a[1] }), props.children));
};
exports.ArrayTable = react_3.observer(function (props) {
    var node = react_2.useTreeNode();
    var nodeId = react_2.useNodeIdProps();
    hooks_1.useDropTemplate('ArrayTable', function (source) {
        var sortHandleNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                    title: "Title",
                },
            },
            children: [
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'ArrayTable.SortHandle',
                    },
                },
            ],
        });
        var indexNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                    title: "Title",
                },
            },
            children: [
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Index',
                    },
                },
            ],
        });
        var columnNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                    title: "Title",
                },
            },
            children: source.map(function (node) {
                node.props.title = undefined;
                return node;
            }),
        });
        var operationNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                    title: "Title",
                },
            },
            children: [
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                    },
                },
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'ArrayTable.MoveDown',
                    },
                },
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'ArrayTable.MoveUp',
                    },
                },
            ],
        });
        var objectNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'object',
            },
            children: [sortHandleNode, indexNode, columnNode, operationNode],
        });
        var additionNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayTable.Addition',
            },
        });
        return [objectNode, additionNode];
    });
    var columns = shared_1.queryNodesByComponentPath(node, [
        'ArrayTable',
        '*',
        'ArrayTable.Column',
    ]);
    var additions = shared_1.queryNodesByComponentPath(node, [
        'ArrayTable',
        'ArrayTable.Addition',
    ]);
    var defaultRowKey = function () {
        return node.id;
    };
    var renderTable = function () {
        if (node.children.length === 0)
            return react_1.default.createElement(react_2.DroppableWidget, null);
        return (react_1.default.createElement(antd_2.ArrayBase, { disabled: true },
            react_1.default.createElement(antd_1.Table, __assign({ size: "small", bordered: true }, props, { scroll: { x: '100%' }, className: classnames_1.default('ant-formily-array-table', props.className), style: __assign({ marginBottom: 10 }, props.style), rowKey: defaultRowKey, dataSource: [{ id: '1' }], pagination: false, components: {
                    header: {
                        cell: HeaderCell,
                    },
                    body: {
                        cell: BodyCell,
                    },
                } }),
                columns.map(function (node) {
                    var children = node.children.map(function (child) {
                        return react_1.default.createElement(react_2.TreeNodeWidget, { node: child, key: child.id });
                    });
                    var props = node.props['x-component-props'];
                    return (react_1.default.createElement(antd_1.Table.Column, __assign({}, props, { title: react_1.default.createElement("div", { "data-content-editable": "x-component-props.title" }, props.title), dataIndex: node.id, className: "data-id:" + node.id, key: node.id, render: function (value, record, key) {
                            return (react_1.default.createElement(antd_2.ArrayBase.Item, { key: key, index: key, record: null }, children.length > 0 ? children : 'Droppable'));
                        } })));
                }),
                columns.length === 0 && (react_1.default.createElement(antd_1.Table.Column, { render: function () { return react_1.default.createElement(react_2.DroppableWidget, null); } }))),
            additions.map(function (child) {
                return react_1.default.createElement(react_2.TreeNodeWidget, { node: child, key: child.id });
            })));
    };
    hooks_1.useDropTemplate('ArrayTable.Column', function (source) {
        return source.map(function (node) {
            node.props.title = undefined;
            return node;
        });
    });
    return (react_1.default.createElement("div", __assign({}, nodeId, { className: "dn-array-table" }),
        renderTable(),
        react_1.default.createElement(LoadTemplate_1.LoadTemplate, { actions: [
                {
                    title: node.getMessage('addSortHandle'),
                    icon: 'AddSort',
                    onClick: function () {
                        if (shared_1.hasNodeByComponentPath(node, [
                            'ArrayTable',
                            '*',
                            'ArrayTable.Column',
                            'ArrayTable.SortHandle',
                        ]))
                            return;
                        var tableColumn = new core_1.TreeNode({
                            componentName: 'Field',
                            props: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': {
                                    title: "Title",
                                },
                            },
                            children: [
                                {
                                    componentName: 'Field',
                                    props: {
                                        type: 'void',
                                        'x-component': 'ArrayTable.SortHandle',
                                    },
                                },
                            ],
                        });
                        ensureObjectItemsNode(node).prepend(tableColumn);
                    },
                },
                {
                    title: node.getMessage('addIndex'),
                    icon: 'AddIndex',
                    onClick: function () {
                        if (shared_1.hasNodeByComponentPath(node, [
                            'ArrayTable',
                            '*',
                            'ArrayTable.Column',
                            'ArrayTable.Index',
                        ]))
                            return;
                        var tableColumn = new core_1.TreeNode({
                            componentName: 'Field',
                            props: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': {
                                    title: "Title",
                                },
                            },
                            children: [
                                {
                                    componentName: 'Field',
                                    props: {
                                        type: 'void',
                                        'x-component': 'ArrayTable.Index',
                                    },
                                },
                            ],
                        });
                        var sortNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayTable',
                            '*',
                            'ArrayTable.Column',
                            'ArrayTable.SortHandle',
                        ]);
                        if (sortNode) {
                            sortNode.parent.insertAfter(tableColumn);
                        }
                        else {
                            ensureObjectItemsNode(node).prepend(tableColumn);
                        }
                    },
                },
                {
                    title: node.getMessage('addColumn'),
                    icon: 'AddColumn',
                    onClick: function () {
                        var operationNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayTable',
                            '*',
                            'ArrayTable.Column',
                            function (name) {
                                return (name === 'ArrayTable.Remove' ||
                                    name === 'ArrayTable.MoveDown' ||
                                    name === 'ArrayTable.MoveUp');
                            },
                        ]);
                        var tableColumn = new core_1.TreeNode({
                            componentName: 'Field',
                            props: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': {
                                    title: "Title",
                                },
                            },
                        });
                        if (operationNode) {
                            operationNode.parent.insertBefore(tableColumn);
                        }
                        else {
                            ensureObjectItemsNode(node).append(tableColumn);
                        }
                    },
                },
                {
                    title: node.getMessage('addOperation'),
                    icon: 'AddOperation',
                    onClick: function () {
                        var oldOperationNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayTable',
                            '*',
                            'ArrayTable.Column',
                            function (name) {
                                return (name === 'ArrayTable.Remove' ||
                                    name === 'ArrayTable.MoveDown' ||
                                    name === 'ArrayTable.MoveUp');
                            },
                        ]);
                        var oldAdditionNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayTable',
                            'ArrayTable.Addition',
                        ]);
                        if (!oldOperationNode) {
                            var operationNode = new core_1.TreeNode({
                                componentName: 'Field',
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayTable.Column',
                                    'x-component-props': {
                                        title: "Title",
                                    },
                                },
                                children: [
                                    {
                                        componentName: 'Field',
                                        props: {
                                            type: 'void',
                                            'x-component': 'ArrayTable.Remove',
                                        },
                                    },
                                    {
                                        componentName: 'Field',
                                        props: {
                                            type: 'void',
                                            'x-component': 'ArrayTable.MoveDown',
                                        },
                                    },
                                    {
                                        componentName: 'Field',
                                        props: {
                                            type: 'void',
                                            'x-component': 'ArrayTable.MoveUp',
                                        },
                                    },
                                ],
                            });
                            ensureObjectItemsNode(node).append(operationNode);
                        }
                        if (!oldAdditionNode) {
                            var additionNode = new core_1.TreeNode({
                                componentName: 'Field',
                                props: {
                                    type: 'void',
                                    title: 'Addition',
                                    'x-component': 'ArrayTable.Addition',
                                },
                            });
                            ensureObjectItemsNode(node).insertAfter(additionNode);
                        }
                    },
                },
            ] })));
});
antd_2.ArrayBase.mixin(exports.ArrayTable);
exports.ArrayTable.Behavior = core_1.createBehavior(ArrayBase_1.createArrayBehavior('ArrayTable'), {
    name: 'ArrayTable.Column',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'ArrayTable.Column'; },
    designerProps: {
        droppable: true,
        allowDrop: function (node) {
            var _a, _b;
            return node.props['type'] === 'object' &&
                ((_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b['x-component']) === 'ArrayTable';
        },
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.ArrayTable.Column),
    },
    designerLocales: locales_1.AllLocales.ArrayTableColumn,
});
exports.ArrayTable.Resource = core_1.createResource({
    icon: 'ArrayTableSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
            },
        },
    ],
});
