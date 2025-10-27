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
import React, { Fragment, useState } from 'react';
import { observer } from '@formily/react';
import { Collapse } from 'antd';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { useTreeNode, useNodeIdProps, DroppableWidget, TreeNodeWidget, } from '@designable/react';
import { toArr } from '@formily/shared';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';
var parseCollapse = function (parent) {
    var tabs = [];
    parent.children.forEach(function (node) {
        if (matchComponent(node, 'FormCollapse.CollapsePanel')) {
            tabs.push(node);
        }
    });
    return tabs;
};
export var FormCollapse = observer(function (props) {
    var _a = __read(useState([]), 2), activeKey = _a[0], setActiveKey = _a[1];
    var node = useTreeNode();
    var nodeId = useNodeIdProps();
    var designer = useDropTemplate('FormCollapse', function (source) {
        var panelNode = new TreeNode({
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
        setActiveKey(toArr(activeKey).concat(panelNode.id));
        return [panelNode];
    });
    var panels = parseCollapse(node);
    var renderCollapse = function () {
        var _a;
        if (!((_a = node.children) === null || _a === void 0 ? void 0 : _a.length))
            return React.createElement(DroppableWidget, null);
        return (React.createElement(Collapse, __assign({}, props, { activeKey: panels.map(function (tab) { return tab.id; }) }), panels.map(function (panel) {
            var _a;
            var props = panel.props['x-component-props'] || {};
            return (React.createElement(Collapse.Panel, __assign({}, props, { style: __assign({}, props.style), header: React.createElement("span", { "data-content-editable": "x-component-props.header", "data-content-editable-node-id": panel.id }, props.header), key: panel.id }), React.createElement('div', (_a = {},
                _a[designer.props.nodeIdAttrName] = panel.id,
                _a.style = {
                    padding: '20px 0',
                },
                _a), panel.children.length ? (React.createElement(TreeNodeWidget, { node: panel })) : (React.createElement(DroppableWidget, null)))));
        })));
    };
    return (React.createElement("div", __assign({}, nodeId),
        renderCollapse(),
        React.createElement(LoadTemplate, { actions: [
                {
                    title: node.getMessage('addCollapsePanel'),
                    icon: 'AddPanel',
                    onClick: function () {
                        var tabPane = new TreeNode({
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
                        var keys = toArr(activeKey);
                        setActiveKey(keys.concat(tabPane.id));
                    },
                },
            ] })));
});
FormCollapse.CollapsePanel = function (props) {
    return React.createElement(Fragment, null, props.children);
};
FormCollapse.Behavior = createBehavior({
    name: 'FormCollapse',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormCollapse'; },
    designerProps: {
        droppable: true,
        allowAppend: function (target, source) {
            return target.children.length === 0 ||
                source.every(function (node) { return node.props['x-component'] === 'FormCollapse.CollapsePanel'; });
        },
        propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse),
    },
    designerLocales: AllLocales.FormCollapse,
}, {
    name: 'FormCollapse.CollapsePanel',
    extends: ['Field'],
    selector: function (node) {
        return node.props['x-component'] === 'FormCollapse.CollapsePanel';
    },
    designerProps: {
        droppable: true,
        allowDrop: function (node) { return node.props['x-component'] === 'FormCollapse'; },
        propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse.CollapsePanel),
    },
    designerLocales: AllLocales.FormCollapsePanel,
});
FormCollapse.Resource = createResource({
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
