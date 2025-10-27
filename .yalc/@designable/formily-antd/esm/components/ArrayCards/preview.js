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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React, { Fragment } from 'react';
import { Card } from 'antd';
import { TreeNode, createResource } from '@designable/core';
import { useTreeNode, TreeNodeWidget, DroppableWidget, useNodeIdProps, } from '@designable/react';
import { ArrayBase } from '@formily/antd';
import { observer } from '@formily/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { hasNodeByComponentPath, queryNodesByComponentPath, createEnsureTypeItemsNode, findNodeByComponentPath, createNodeId, } from '../../shared';
import { createArrayBehavior } from '../ArrayBase';
import cls from 'classnames';
import './styles.less';
var ensureObjectItemsNode = createEnsureTypeItemsNode('object');
var isArrayCardsOperation = function (name) {
    return name === 'ArrayCards.Remove' ||
        name === 'ArrayCards.MoveDown' ||
        name === 'ArrayCards.MoveUp';
};
export var ArrayCards = observer(function (props) {
    var node = useTreeNode();
    var nodeId = useNodeIdProps();
    var designer = useDropTemplate('ArrayCards', function (source) {
        var indexNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                'x-component': 'ArrayCards.Index',
            },
        });
        var additionNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.Addition',
            },
        });
        var removeNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.Remove',
            },
        });
        var moveDownNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.MoveDown',
            },
        });
        var moveUpNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.MoveUp',
            },
        });
        var objectNode = new TreeNode({
            componentName: node.componentName,
            props: {
                type: 'object',
            },
            children: __spread([indexNode], source, [removeNode, moveDownNode, moveUpNode]),
        });
        return [objectNode, additionNode];
    });
    var renderCard = function () {
        if (node.children.length === 0)
            return React.createElement(DroppableWidget, null);
        var additions = queryNodesByComponentPath(node, [
            'ArrayCards',
            'ArrayCards.Addition',
        ]);
        var indexes = queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            'ArrayCards.Index',
        ]);
        var operations = queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            isArrayCardsOperation,
        ]);
        var children = queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            function (name) { return name.indexOf('ArrayCards.') === -1; },
        ]);
        return (React.createElement(ArrayBase, { disabled: true },
            React.createElement(ArrayBase.Item, { index: 0, record: null },
                React.createElement(Card, __assign({}, props, { title: React.createElement(Fragment, null,
                        indexes.map(function (node, key) { return (React.createElement(TreeNodeWidget, { key: key, node: node })); }),
                        React.createElement("span", { "data-content-editable": "x-component-props.title" }, props.title)), className: cls('ant-formily-array-cards-item', props.className), extra: React.createElement(Fragment, null,
                        operations.map(function (node) { return (React.createElement(TreeNodeWidget, { key: node.id, node: node })); }),
                        props.extra) }),
                    React.createElement("div", __assign({}, createNodeId(designer, ensureObjectItemsNode(node).id)), children.length ? (children.map(function (node) { return (React.createElement(TreeNodeWidget, { key: node.id, node: node })); })) : (React.createElement(DroppableWidget, { hasChildren: false }))))),
            additions.map(function (node) { return (React.createElement(TreeNodeWidget, { key: node.id, node: node })); })));
    };
    return (React.createElement("div", __assign({}, nodeId, { className: "dn-array-cards" }),
        renderCard(),
        React.createElement(LoadTemplate, { actions: [
                {
                    title: node.getMessage('addIndex'),
                    icon: 'AddIndex',
                    onClick: function () {
                        if (hasNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.Index',
                        ]))
                            return;
                        var indexNode = new TreeNode({
                            componentName: node.componentName,
                            props: {
                                type: 'void',
                                'x-component': 'ArrayCards.Index',
                            },
                        });
                        ensureObjectItemsNode(node).append(indexNode);
                    },
                },
                {
                    title: node.getMessage('addOperation'),
                    icon: 'AddOperation',
                    onClick: function () {
                        var oldAdditionNode = findNodeByComponentPath(node, [
                            'ArrayCards',
                            'ArrayCards.Addition',
                        ]);
                        if (!oldAdditionNode) {
                            var additionNode = new TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    title: 'Addition',
                                    'x-component': 'ArrayCards.Addition',
                                },
                            });
                            ensureObjectItemsNode(node).insertAfter(additionNode);
                        }
                        var oldRemoveNode = findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.Remove',
                        ]);
                        var oldMoveDownNode = findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.MoveDown',
                        ]);
                        var oldMoveUpNode = findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.MoveUp',
                        ]);
                        if (!oldRemoveNode) {
                            ensureObjectItemsNode(node).append(new TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayCards.Remove',
                                },
                            }));
                        }
                        if (!oldMoveDownNode) {
                            ensureObjectItemsNode(node).append(new TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayCards.MoveDown',
                                },
                            }));
                        }
                        if (!oldMoveUpNode) {
                            ensureObjectItemsNode(node).append(new TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayCards.MoveUp',
                                },
                            }));
                        }
                    },
                },
            ] })));
});
ArrayBase.mixin(ArrayCards);
ArrayCards.Behavior = createArrayBehavior('ArrayCards');
ArrayCards.Resource = createResource({
    icon: 'ArrayCardsSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayCards',
                'x-component-props': {
                    title: "Title",
                },
            },
        },
    ],
});
