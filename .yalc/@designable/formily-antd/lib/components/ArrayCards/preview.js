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
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCards = void 0;
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var react_2 = require("@designable/react");
var antd_2 = require("@formily/antd");
var react_3 = require("@formily/react");
var LoadTemplate_1 = require("../../common/LoadTemplate");
var hooks_1 = require("../../hooks");
var shared_1 = require("../../shared");
var ArrayBase_1 = require("../ArrayBase");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var ensureObjectItemsNode = shared_1.createEnsureTypeItemsNode('object');
var isArrayCardsOperation = function (name) {
    return name === 'ArrayCards.Remove' ||
        name === 'ArrayCards.MoveDown' ||
        name === 'ArrayCards.MoveUp';
};
exports.ArrayCards = react_3.observer(function (props) {
    var node = react_2.useTreeNode();
    var nodeId = react_2.useNodeIdProps();
    var designer = hooks_1.useDropTemplate('ArrayCards', function (source) {
        var indexNode = new core_1.TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                'x-component': 'ArrayCards.Index',
            },
        });
        var additionNode = new core_1.TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.Addition',
            },
        });
        var removeNode = new core_1.TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.Remove',
            },
        });
        var moveDownNode = new core_1.TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.MoveDown',
            },
        });
        var moveUpNode = new core_1.TreeNode({
            componentName: node.componentName,
            props: {
                type: 'void',
                title: 'Addition',
                'x-component': 'ArrayCards.MoveUp',
            },
        });
        var objectNode = new core_1.TreeNode({
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
            return react_1.default.createElement(react_2.DroppableWidget, null);
        var additions = shared_1.queryNodesByComponentPath(node, [
            'ArrayCards',
            'ArrayCards.Addition',
        ]);
        var indexes = shared_1.queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            'ArrayCards.Index',
        ]);
        var operations = shared_1.queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            isArrayCardsOperation,
        ]);
        var children = shared_1.queryNodesByComponentPath(node, [
            'ArrayCards',
            '*',
            function (name) { return name.indexOf('ArrayCards.') === -1; },
        ]);
        return (react_1.default.createElement(antd_2.ArrayBase, { disabled: true },
            react_1.default.createElement(antd_2.ArrayBase.Item, { index: 0, record: null },
                react_1.default.createElement(antd_1.Card, __assign({}, props, { title: react_1.default.createElement(react_1.Fragment, null,
                        indexes.map(function (node, key) { return (react_1.default.createElement(react_2.TreeNodeWidget, { key: key, node: node })); }),
                        react_1.default.createElement("span", { "data-content-editable": "x-component-props.title" }, props.title)), className: classnames_1.default('ant-formily-array-cards-item', props.className), extra: react_1.default.createElement(react_1.Fragment, null,
                        operations.map(function (node) { return (react_1.default.createElement(react_2.TreeNodeWidget, { key: node.id, node: node })); }),
                        props.extra) }),
                    react_1.default.createElement("div", __assign({}, shared_1.createNodeId(designer, ensureObjectItemsNode(node).id)), children.length ? (children.map(function (node) { return (react_1.default.createElement(react_2.TreeNodeWidget, { key: node.id, node: node })); })) : (react_1.default.createElement(react_2.DroppableWidget, { hasChildren: false }))))),
            additions.map(function (node) { return (react_1.default.createElement(react_2.TreeNodeWidget, { key: node.id, node: node })); })));
    };
    return (react_1.default.createElement("div", __assign({}, nodeId, { className: "dn-array-cards" }),
        renderCard(),
        react_1.default.createElement(LoadTemplate_1.LoadTemplate, { actions: [
                {
                    title: node.getMessage('addIndex'),
                    icon: 'AddIndex',
                    onClick: function () {
                        if (shared_1.hasNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.Index',
                        ]))
                            return;
                        var indexNode = new core_1.TreeNode({
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
                        var oldAdditionNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayCards',
                            'ArrayCards.Addition',
                        ]);
                        if (!oldAdditionNode) {
                            var additionNode = new core_1.TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    title: 'Addition',
                                    'x-component': 'ArrayCards.Addition',
                                },
                            });
                            ensureObjectItemsNode(node).insertAfter(additionNode);
                        }
                        var oldRemoveNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.Remove',
                        ]);
                        var oldMoveDownNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.MoveDown',
                        ]);
                        var oldMoveUpNode = shared_1.findNodeByComponentPath(node, [
                            'ArrayCards',
                            '*',
                            'ArrayCards.MoveUp',
                        ]);
                        if (!oldRemoveNode) {
                            ensureObjectItemsNode(node).append(new core_1.TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayCards.Remove',
                                },
                            }));
                        }
                        if (!oldMoveDownNode) {
                            ensureObjectItemsNode(node).append(new core_1.TreeNode({
                                componentName: node.componentName,
                                props: {
                                    type: 'void',
                                    'x-component': 'ArrayCards.MoveDown',
                                },
                            }));
                        }
                        if (!oldMoveUpNode) {
                            ensureObjectItemsNode(node).append(new core_1.TreeNode({
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
antd_2.ArrayBase.mixin(exports.ArrayCards);
exports.ArrayCards.Behavior = ArrayBase_1.createArrayBehavior('ArrayCards');
exports.ArrayCards.Resource = core_1.createResource({
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
