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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormCollapse = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@formily/react");
var antd_1 = require("antd");
var core_1 = require("@designable/core");
var react_3 = require("@designable/react");
var shared_1 = require("@formily/shared");
var LoadTemplate_1 = require("../../common/LoadTemplate");
var hooks_1 = require("../../hooks");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
var shared_2 = require("../../shared");
var parseCollapse = function (parent) {
    var tabs = [];
    parent.children.forEach(function (node) {
        if (shared_2.matchComponent(node, 'FormCollapse.CollapsePanel')) {
            tabs.push(node);
        }
    });
    return tabs;
};
exports.FormCollapse = react_2.observer(function (props) {
    var _a = __read(react_1.useState([]), 2), activeKey = _a[0], setActiveKey = _a[1];
    var node = react_3.useTreeNode();
    var nodeId = react_3.useNodeIdProps();
    var designer = hooks_1.useDropTemplate('FormCollapse', function (source) {
        var panelNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'FormCollapse.CollapsePanel',
                'x-component-props': {
                    header: "Unnamed Title",
                },
            },
            children: source,
        });
        setActiveKey(shared_1.toArr(activeKey).concat(panelNode.id));
        return [panelNode];
    });
    var panels = parseCollapse(node);
    var renderCollapse = function () {
        var _a;
        if (!((_a = node.children) === null || _a === void 0 ? void 0 : _a.length))
            return react_1.default.createElement(react_3.DroppableWidget, null);
        return (react_1.default.createElement(antd_1.Collapse, __assign({}, props, { activeKey: panels.map(function (tab) { return tab.id; }) }), panels.map(function (panel) {
            var _a;
            var props = panel.props['x-component-props'] || {};
            return (react_1.default.createElement(antd_1.Collapse.Panel, __assign({}, props, { style: __assign({}, props.style), header: react_1.default.createElement("span", { "data-content-editable": "x-component-props.header", "data-content-editable-node-id": panel.id }, props.header), key: panel.id }), react_1.default.createElement('div', (_a = {},
                _a[designer.props.nodeIdAttrName] = panel.id,
                _a.style = {
                    padding: '20px 0',
                },
                _a), panel.children.length ? (react_1.default.createElement(react_3.TreeNodeWidget, { node: panel })) : (react_1.default.createElement(react_3.DroppableWidget, null)))));
        })));
    };
    return (react_1.default.createElement("div", __assign({}, nodeId),
        renderCollapse(),
        react_1.default.createElement(LoadTemplate_1.LoadTemplate, { actions: [
                {
                    title: node.getMessage('addCollapsePanel'),
                    icon: 'AddPanel',
                    onClick: function () {
                        var tabPane = new core_1.TreeNode({
                            componentName: 'Field',
                            props: {
                                type: 'void',
                                'x-component': 'FormCollapse.CollapsePanel',
                                'x-component-props': {
                                    header: "Unnamed Title",
                                },
                            },
                        });
                        node.append(tabPane);
                        var keys = shared_1.toArr(activeKey);
                        setActiveKey(keys.concat(tabPane.id));
                    },
                },
            ] })));
});
exports.FormCollapse.CollapsePanel = function (props) {
    return react_1.default.createElement(react_1.Fragment, null, props.children);
};
exports.FormCollapse.Behavior = core_1.createBehavior({
    name: 'FormCollapse',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormCollapse'; },
    designerProps: {
        droppable: true,
        allowAppend: function (target, source) {
            return target.children.length === 0 ||
                source.every(function (node) { return node.props['x-component'] === 'FormCollapse.CollapsePanel'; });
        },
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.FormCollapse),
    },
    designerLocales: locales_1.AllLocales.FormCollapse,
}, {
    name: 'FormCollapse.CollapsePanel',
    extends: ['Field'],
    selector: function (node) {
        return node.props['x-component'] === 'FormCollapse.CollapsePanel';
    },
    designerProps: {
        droppable: true,
        allowDrop: function (node) { return node.props['x-component'] === 'FormCollapse'; },
        propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas.FormCollapse.CollapsePanel),
    },
    designerLocales: locales_1.AllLocales.FormCollapsePanel,
});
exports.FormCollapse.Resource = core_1.createResource({
    icon: 'CollapseSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'FormCollapse',
            },
        },
    ],
});
