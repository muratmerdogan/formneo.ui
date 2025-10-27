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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import { FormGrid as FormilyGird } from '@formily/antd';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { useTreeNode, useNodeIdProps, DroppableWidget, } from '@designable/react';
import { observer } from '@formily/reactive-react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import './styles.less';
export var FormGrid = observer(function (props) {
    var node = useTreeNode();
    var nodeId = useNodeIdProps();
    if (node.children.length === 0)
        return React.createElement(DroppableWidget, __assign({}, props));
    return (React.createElement("div", __assign({}, nodeId, { className: "dn-grid" }),
        React.createElement(FormilyGird, __assign({}, props), props.children),
        React.createElement(LoadTemplate, { actions: [
                {
                    title: node.getMessage('addGridColumn'),
                    icon: 'AddColumn',
                    onClick: function () {
                        var column = new TreeNode({
                            componentName: 'Field',
                            props: {
                                type: 'void',
                                'x-component': 'FormGrid.GridColumn',
                            },
                        });
                        node.append(column);
                    },
                },
            ] })));
});
FormGrid.GridColumn = observer(function (_a) {
    var gridSpan = _a.gridSpan, props = __rest(_a, ["gridSpan"]);
    return (React.createElement(DroppableWidget, __assign({}, props, { "data-grid-span": gridSpan }), props.children));
});
FormGrid.Behavior = createBehavior({
    name: 'FormGrid',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormGrid'; },
    designerProps: {
        droppable: true,
        allowDrop: function (node) { return node.props['x-component'] !== 'FormGrid'; },
        propsSchema: createFieldSchema(AllSchemas.FormGrid),
    },
    designerLocales: AllLocales.FormGrid,
}, {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormGrid.GridColumn'; },
    designerProps: {
        droppable: true,
        resizable: {
            width: function (node) {
                var _a, _b;
                var span = Number((_b = (_a = node.props['x-component-props']) === null || _a === void 0 ? void 0 : _a.gridSpan) !== null && _b !== void 0 ? _b : 1);
                return {
                    plus: function () {
                        if (span + 1 > 12)
                            return;
                        node.props['x-component-props'] =
                            node.props['x-component-props'] || {};
                        node.props['x-component-props'].gridSpan = span + 1;
                    },
                    minus: function () {
                        if (span - 1 < 1)
                            return;
                        node.props['x-component-props'] =
                            node.props['x-component-props'] || {};
                        node.props['x-component-props'].gridSpan = span - 1;
                    },
                };
            },
        },
        resizeXPath: 'x-component-props.gridSpan',
        resizeStep: 1,
        resizeMin: 1,
        resizeMax: 12,
        allowDrop: function (node) { return node.props['x-component'] === 'FormGrid'; },
        propsSchema: createFieldSchema(AllSchemas.FormGrid.GridColumn),
    },
    designerLocales: AllLocales.FormGridColumn,
});
FormGrid.Resource = createResource({
    icon: 'GridSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'FormGrid',
            },
            children: [
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'FormGrid.GridColumn',
                    },
                },
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'FormGrid.GridColumn',
                    },
                },
                {
                    componentName: 'Field',
                    props: {
                        type: 'void',
                        'x-component': 'FormGrid.GridColumn',
                    },
                },
            ],
        },
    ],
});
