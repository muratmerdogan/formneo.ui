import React, { useRef, useContext, useEffect } from 'react';
import { ClosestPosition, CursorStatus, DragMoveEvent, } from '@designable/core';
import { isFn } from '@designable/shared';
import { autorun } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { usePrefix, useCursor, useSelection, useMoveHelper, useDesigner, } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { NodeTitleWidget } from '../NodeTitleWidget';
import { NodeContext } from './context';
import cls from 'classnames';
import './styles.less';
export var OutlineTreeNode = observer(function (_a) {
    var _b, _c;
    var node = _a.node, className = _a.className, style = _a.style, workspaceId = _a.workspaceId;
    var prefix = usePrefix('outline-tree-node');
    var engine = useDesigner();
    var ref = useRef();
    var ctx = useContext(NodeContext);
    var request = useRef(null);
    var cursor = useCursor();
    var selection = useSelection(workspaceId);
    var moveHelper = useMoveHelper(workspaceId);
    useEffect(function () {
        return engine.subscribeTo(DragMoveEvent, function () {
            var _a;
            var closestNodeId = (_a = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.closestNode) === null || _a === void 0 ? void 0 : _a.id;
            var closestDirection = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.outlineClosestDirection;
            var id = node.id;
            if (!ref.current)
                return;
            if (closestNodeId === id &&
                closestDirection === ClosestPosition.Inner) {
                if (!ref.current.classList.contains('droppable')) {
                    ref.current.classList.add('droppable');
                }
                if (!ref.current.classList.contains('expanded')) {
                    if (request.current) {
                        clearTimeout(request.current);
                        request.current = null;
                    }
                    request.current = setTimeout(function () {
                        ref.current.classList.add('expanded');
                    }, 600);
                }
            }
            else {
                if (request.current) {
                    clearTimeout(request.current);
                    request.current = null;
                }
                if (ref.current.classList.contains('droppable')) {
                    ref.current.classList.remove('droppable');
                }
            }
        });
    }, [node, moveHelper, cursor]);
    useEffect(function () {
        return autorun(function () {
            var _a;
            var selectedIds = (selection === null || selection === void 0 ? void 0 : selection.selected) || [];
            var id = node.id;
            if (!ref.current)
                return;
            if (selectedIds.includes(id)) {
                if (!ref.current.classList.contains('selected')) {
                    ref.current.classList.add('selected');
                }
            }
            else {
                if (ref.current.classList.contains('selected')) {
                    ref.current.classList.remove('selected');
                }
            }
            if (cursor.status === CursorStatus.Dragging &&
                ((_a = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.dragNodes) === null || _a === void 0 ? void 0 : _a.length)) {
                if (ref.current.classList.contains('selected')) {
                    ref.current.classList.remove('selected');
                }
            }
        });
    }, [node, selection, moveHelper]);
    if (!node)
        return null;
    var renderIcon = function (node) {
        var _a;
        var icon = node.designerProps.icon;
        if (icon) {
            return React.createElement(IconWidget, { infer: icon, size: 12 });
        }
        if (node === (node === null || node === void 0 ? void 0 : node.root)) {
            return React.createElement(IconWidget, { infer: "Page", size: 12 });
        }
        else if ((_a = node.designerProps) === null || _a === void 0 ? void 0 : _a.droppable) {
            return React.createElement(IconWidget, { infer: "Container", size: 12 });
        }
        return React.createElement(IconWidget, { infer: "Component", size: 12 });
    };
    var renderTitle = function (node) {
        if (isFn(ctx.renderTitle))
            return ctx.renderTitle(node);
        return (React.createElement("span", null,
            React.createElement(NodeTitleWidget, { node: node })));
    };
    var renderActions = function (node) {
        if (isFn(ctx.renderActions))
            return ctx.renderActions(node);
    };
    return (React.createElement("div", { style: style, ref: ref, className: cls(prefix, className, 'expanded'), "data-designer-outline-node-id": node.id },
        React.createElement("div", { className: prefix + '-header' },
            React.createElement("div", { className: prefix + '-header-head', style: {
                    left: -node.depth * 16,
                    width: node.depth * 16,
                } }),
            React.createElement("div", { className: prefix + '-header-content' },
                React.createElement("div", { className: prefix + '-header-base' },
                    (((_b = node === null || node === void 0 ? void 0 : node.children) === null || _b === void 0 ? void 0 : _b.length) > 0 || node === node.root) && (React.createElement("div", { className: prefix + '-expand', onClick: function (e) {
                            var _a, _b, _c, _d;
                            e.preventDefault();
                            e.stopPropagation();
                            if ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains('expanded')) {
                                (_c = ref.current) === null || _c === void 0 ? void 0 : _c.classList.remove('expanded');
                            }
                            else {
                                (_d = ref.current) === null || _d === void 0 ? void 0 : _d.classList.add('expanded');
                            }
                        } },
                        React.createElement(IconWidget, { infer: "Expand", size: 10 }))),
                    React.createElement("div", { className: prefix + '-icon' }, renderIcon(node)),
                    React.createElement("div", { className: prefix + '-title' }, renderTitle(node))),
                React.createElement("div", { className: prefix + '-header-actions', "data-click-stop-propagation": true },
                    renderActions(node),
                    node !== node.root && (React.createElement(IconWidget, { className: cls(prefix + '-hidden-icon', {
                            hidden: node.hidden,
                        }), infer: node.hidden ? 'EyeClose' : 'Eye', size: 14, onClick: function () {
                            node.hidden = !node.hidden;
                        } }))))),
        React.createElement("div", { className: prefix + '-children' }, (_c = node.children) === null || _c === void 0 ? void 0 : _c.map(function (child) {
            return (React.createElement(OutlineTreeNode, { node: child, key: child.id, workspaceId: workspaceId }));
        }))));
});
