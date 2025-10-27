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
exports.OutlineTreeWidget = void 0;
var react_1 = __importStar(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
var OutlineNode_1 = require("./OutlineNode");
var Insertion_1 = require("./Insertion");
var context_1 = require("./context");
var shared_1 = require("@designable/shared");
exports.OutlineTreeWidget = (0, reactive_react_1.observer)(function (_a) {
    var onClose = _a.onClose, style = _a.style, renderActions = _a.renderActions, renderTitle = _a.renderTitle, className = _a.className, props = __rest(_a, ["onClose", "style", "renderActions", "renderTitle", "className"]);
    var ref = (0, react_1.useRef)();
    var prefix = (0, hooks_1.usePrefix)('outline-tree');
    var workbench = (0, hooks_1.useWorkbench)();
    var current = (workbench === null || workbench === void 0 ? void 0 : workbench.activeWorkspace) || (workbench === null || workbench === void 0 ? void 0 : workbench.currentWorkspace);
    var workspaceId = current === null || current === void 0 ? void 0 : current.id;
    var tree = (0, hooks_1.useTree)(workspaceId);
    var outline = (0, hooks_1.useOutline)(workspaceId);
    var outlineRef = (0, react_1.useRef)();
    (0, react_1.useLayoutEffect)(function () {
        if (!workspaceId)
            return;
        if (outlineRef.current && outlineRef.current !== outline) {
            outlineRef.current.onUnmount();
        }
        if (ref.current && outline) {
            outline.onMount(ref.current, shared_1.globalThisPolyfill);
        }
        outlineRef.current = outline;
        return function () {
            outline.onUnmount();
        };
    }, [workspaceId, outline]);
    if (!outline || !workspaceId)
        return null;
    return (react_1.default.createElement(context_1.NodeContext.Provider, { value: { renderActions: renderActions, renderTitle: renderTitle } },
        react_1.default.createElement("div", __assign({}, props, { className: (0, classnames_1.default)(prefix + '-container', className), style: style }),
            react_1.default.createElement("div", { className: prefix + '-content', ref: ref },
                react_1.default.createElement(OutlineNode_1.OutlineTreeNode, { node: tree, workspaceId: workspaceId }),
                react_1.default.createElement("div", { className: prefix + '-aux', style: {
                        pointerEvents: 'none',
                    } },
                    react_1.default.createElement(Insertion_1.Insertion, { workspaceId: workspaceId }))))));
});
