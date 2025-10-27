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
import React, { useRef, useLayoutEffect } from 'react';
import cls from 'classnames';
import { useTree, usePrefix, useOutline, useWorkbench } from '../../hooks';
import { observer } from '@formily/reactive-react';
import { OutlineTreeNode } from './OutlineNode';
import { Insertion } from './Insertion';
import { NodeContext } from './context';
import { globalThisPolyfill } from '@designable/shared';
export var OutlineTreeWidget = observer(function (_a) {
    var onClose = _a.onClose, style = _a.style, renderActions = _a.renderActions, renderTitle = _a.renderTitle, className = _a.className, props = __rest(_a, ["onClose", "style", "renderActions", "renderTitle", "className"]);
    var ref = useRef();
    var prefix = usePrefix('outline-tree');
    var workbench = useWorkbench();
    var current = (workbench === null || workbench === void 0 ? void 0 : workbench.activeWorkspace) || (workbench === null || workbench === void 0 ? void 0 : workbench.currentWorkspace);
    var workspaceId = current === null || current === void 0 ? void 0 : current.id;
    var tree = useTree(workspaceId);
    var outline = useOutline(workspaceId);
    var outlineRef = useRef();
    useLayoutEffect(function () {
        if (!workspaceId)
            return;
        if (outlineRef.current && outlineRef.current !== outline) {
            outlineRef.current.onUnmount();
        }
        if (ref.current && outline) {
            outline.onMount(ref.current, globalThisPolyfill);
        }
        outlineRef.current = outline;
        return function () {
            outline.onUnmount();
        };
    }, [workspaceId, outline]);
    if (!outline || !workspaceId)
        return null;
    return (React.createElement(NodeContext.Provider, { value: { renderActions: renderActions, renderTitle: renderTitle } },
        React.createElement("div", __assign({}, props, { className: cls(prefix + '-container', className), style: style }),
            React.createElement("div", { className: prefix + '-content', ref: ref },
                React.createElement(OutlineTreeNode, { node: tree, workspaceId: workspaceId }),
                React.createElement("div", { className: prefix + '-aux', style: {
                        pointerEvents: 'none',
                    } },
                    React.createElement(Insertion, { workspaceId: workspaceId }))))));
});
