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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentTreeWidget = exports.TreeNodeWidget = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../../hooks");
var context_1 = require("../../context");
var core_1 = require("@designable/core");
var reactive_react_1 = require("@formily/reactive-react");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.TreeNodeWidget = (0, reactive_react_1.observer)(function (props) {
    var _a, _b;
    var designer = (0, hooks_1.useDesigner)((_b = (_a = props.node) === null || _a === void 0 ? void 0 : _a.designerProps) === null || _b === void 0 ? void 0 : _b.effects);
    var components = (0, hooks_1.useComponents)();
    var node = props.node;
    var renderChildren = function () {
        var _a, _b;
        if ((_a = node === null || node === void 0 ? void 0 : node.designerProps) === null || _a === void 0 ? void 0 : _a.selfRenderChildren)
            return [];
        return (_b = node === null || node === void 0 ? void 0 : node.children) === null || _b === void 0 ? void 0 : _b.map(function (child) {
            return react_1.default.createElement(exports.TreeNodeWidget, { key: child.id, node: child });
        });
    };
    var renderProps = function (extendsProps) {
        var _a, _b, _c;
        if (extendsProps === void 0) { extendsProps = {}; }
        var props = __assign(__assign(__assign(__assign({}, (_a = node.designerProps) === null || _a === void 0 ? void 0 : _a.defaultProps), extendsProps), node.props), (_c = (_b = node.designerProps) === null || _b === void 0 ? void 0 : _b.getComponentProps) === null || _c === void 0 ? void 0 : _c.call(_b, node));
        if (node.depth === 0) {
            delete props.style;
        }
        return props;
    };
    var renderComponent = function () {
        var _a, _b;
        var componentName = node.componentName;
        var Component = components[componentName];
        var dataId = {};
        if (Component) {
            if (designer) {
                dataId[(_a = designer === null || designer === void 0 ? void 0 : designer.props) === null || _a === void 0 ? void 0 : _a.nodeIdAttrName] = node.id;
            }
            return react_1.default.createElement.apply(react_1.default, __spreadArray([Component,
                renderProps(dataId)], __read(renderChildren()), false));
        }
        else {
            if ((_b = node === null || node === void 0 ? void 0 : node.children) === null || _b === void 0 ? void 0 : _b.length) {
                return react_1.default.createElement(react_1.Fragment, null, renderChildren());
            }
        }
    };
    if (!node)
        return null;
    if (node.hidden)
        return null;
    return react_1.default.createElement(context_1.TreeNodeContext.Provider, { value: node }, renderComponent());
});
exports.ComponentTreeWidget = (0, reactive_react_1.observer)(function (props) {
    var _a, _b;
    var tree = (0, hooks_1.useTree)();
    var prefix = (0, hooks_1.usePrefix)('component-tree');
    var designer = (0, hooks_1.useDesigner)();
    var dataId = {};
    if (designer && tree) {
        dataId[(_a = designer === null || designer === void 0 ? void 0 : designer.props) === null || _a === void 0 ? void 0 : _a.nodeIdAttrName] = tree.id;
    }
    (0, react_1.useEffect)(function () {
        core_1.GlobalRegistry.registerDesignerBehaviors(props.components);
    }, []);
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, props.style), (_b = tree === null || tree === void 0 ? void 0 : tree.props) === null || _b === void 0 ? void 0 : _b.style), className: (0, classnames_1.default)(prefix, props.className) }, dataId),
        react_1.default.createElement(context_1.DesignerComponentsContext.Provider, { value: props.components },
            react_1.default.createElement(exports.TreeNodeWidget, { node: tree }))));
});
exports.ComponentTreeWidget.displayName = 'ComponentTreeWidget';
