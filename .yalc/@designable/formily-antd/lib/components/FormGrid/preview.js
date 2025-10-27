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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormGrid = void 0;
var react_1 = __importDefault(require("react"));
var antd_1 = require("@formily/antd");
var core_1 = require("@designable/core");
var react_2 = require("@designable/react");
var reactive_react_1 = require("@formily/reactive-react");
var LoadTemplate_1 = require("../../common/LoadTemplate");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
require("./styles.less");
exports.FormGrid = reactive_react_1.observer(function (props) {
    var node = react_2.useTreeNode();
    var nodeId = react_2.useNodeIdProps();
    if (node.children.length === 0)
        return react_1.default.createElement(react_2.DroppableWidget, __assign({}, props));
    return (react_1.default.createElement("div", __assign({}, nodeId, { className: "dn-grid" }),
        react_1.default.createElement(antd_1.FormGrid, __assign({}, props), props.children),
        react_1.default.createElement(LoadTemplate_1.LoadTemplate, { actions: [
                {
                    title: node.getMessage('addGridColumn'),
                    icon: 'AddColumn',
                    onClick: function () {
                        var column = new core_1.TreeNode({
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
exports.FormGrid.GridColumn = reactive_react_1.observer(function (_a) {
    var gridSpan = _a.gridSpan, props = __rest(_a, ["gridSpan"]);
    return (react_1.default.createElement(react_2.DroppableWidget, __assign({}, props, { "data-grid-span": gridSpan }), props.children));
});
exports.FormGrid.Behavior = core_1.createBehavior({
    name: 'FormGrid',
    extends: ['Field'],
    selector: function (node) { return node.props['x-component'] === 'FormGrid'; },
    designerProps: {
        droppable: true,
        allowDrop: function (node) { return node.props['x-component'] !== 'FormGrid'; },
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.FormGrid),
    },
    designerLocales: locales_1.AllLocales.FormGrid,
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
        propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas.FormGrid.GridColumn),
    },
    designerLocales: locales_1.AllLocales.FormGridColumn,
});
exports.FormGrid.Resource = core_1.createResource({
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
