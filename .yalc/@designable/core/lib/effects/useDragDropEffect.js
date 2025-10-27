"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragDropEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useDragDropEffect = function (engine) {
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Normal)
            return;
        var target = event.data.target;
        var el = target === null || target === void 0 ? void 0 : target.closest("\n       *[".concat(engine.props.nodeIdAttrName, "],\n       *[").concat(engine.props.sourceIdAttrName, "],\n       *[").concat(engine.props.outlineNodeIdAttrName, "]\n      "));
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[".concat(engine.props.nodeDragHandlerAttrName, "]"));
        var helper = handler === null || handler === void 0 ? void 0 : handler.closest("*[".concat(engine.props.nodeSelectionIdAttrName, "]"));
        if (!(el === null || el === void 0 ? void 0 : el.getAttribute) && !handler)
            return;
        var sourceId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.sourceIdAttrName);
        var outlineId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.outlineNodeIdAttrName);
        var handlerId = helper === null || helper === void 0 ? void 0 : helper.getAttribute(engine.props.nodeSelectionIdAttrName);
        var nodeId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.nodeIdAttrName);
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            var moveHelper = operation.moveHelper;
            if (nodeId || outlineId || handlerId) {
                var node_1 = engine.findNodeById(outlineId || nodeId || handlerId);
                if (node_1) {
                    if (!node_1.allowDrag())
                        return;
                    if (node_1 === node_1.root)
                        return;
                    var validSelected = engine
                        .getAllSelectedNodes()
                        .filter(function (node) { return node.allowDrag(); });
                    if (validSelected.some(function (selectNode) { return selectNode === node_1; })) {
                        moveHelper.dragStart({ dragNodes: models_1.TreeNode.sort(validSelected) });
                    }
                    else {
                        moveHelper.dragStart({ dragNodes: [node_1] });
                    }
                }
            }
            else if (sourceId) {
                var sourceNode = engine.findNodeById(sourceId);
                if (sourceNode) {
                    moveHelper.dragStart({ dragNodes: [sourceNode] });
                }
            }
        });
        engine.cursor.setStyle('move');
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Normal)
            return;
        if (engine.cursor.dragType !== models_1.CursorDragType.Move)
            return;
        var target = event.data.target;
        var el = target === null || target === void 0 ? void 0 : target.closest("\n      *[".concat(engine.props.nodeIdAttrName, "],\n      *[").concat(engine.props.outlineNodeIdAttrName, "]\n    "));
        var point = new shared_1.Point(event.data.topClientX, event.data.topClientY);
        var nodeId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.nodeIdAttrName);
        var outlineId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.outlineNodeIdAttrName);
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            var moveHelper = operation.moveHelper;
            var dragNodes = moveHelper.dragNodes;
            var tree = operation.tree;
            if (!dragNodes.length)
                return;
            var touchNode = tree.findById(outlineId || nodeId);
            moveHelper.dragMove({
                point: point,
                touchNode: touchNode,
            });
        });
    });
    engine.subscribeTo(events_1.ViewportScrollEvent, function (event) {
        var _a, _b;
        if (engine.cursor.type !== models_1.CursorType.Normal)
            return;
        if (engine.cursor.dragType !== models_1.CursorDragType.Move)
            return;
        var point = new shared_1.Point(engine.cursor.position.topClientX, engine.cursor.position.topClientY);
        var currentWorkspace = (_b = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        if (!currentWorkspace)
            return;
        var operation = currentWorkspace.operation;
        var moveHelper = operation.moveHelper;
        if (!moveHelper.dragNodes.length)
            return;
        var tree = operation.tree;
        var viewport = currentWorkspace.viewport;
        var outline = currentWorkspace.outline;
        var viewportTarget = viewport.elementFromPoint(point);
        var outlineTarget = outline.elementFromPoint(point);
        var viewportNodeElement = viewportTarget === null || viewportTarget === void 0 ? void 0 : viewportTarget.closest("\n      *[".concat(engine.props.nodeIdAttrName, "],\n      *[").concat(engine.props.outlineNodeIdAttrName, "]\n    "));
        var outlineNodeElement = outlineTarget === null || outlineTarget === void 0 ? void 0 : outlineTarget.closest("\n    *[".concat(engine.props.nodeIdAttrName, "],\n    *[").concat(engine.props.outlineNodeIdAttrName, "]\n  "));
        var nodeId = viewportNodeElement === null || viewportNodeElement === void 0 ? void 0 : viewportNodeElement.getAttribute(engine.props.nodeIdAttrName);
        var outlineNodeId = outlineNodeElement === null || outlineNodeElement === void 0 ? void 0 : outlineNodeElement.getAttribute(engine.props.outlineNodeIdAttrName);
        var touchNode = tree.findById(outlineNodeId || nodeId);
        moveHelper.dragMove({ point: point, touchNode: touchNode });
    });
    engine.subscribeTo(events_1.DragStopEvent, function () {
        if (engine.cursor.type !== models_1.CursorType.Normal)
            return;
        if (engine.cursor.dragType !== models_1.CursorDragType.Move)
            return;
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            var moveHelper = operation.moveHelper;
            var dragNodes = moveHelper.dragNodes;
            var closestNode = moveHelper.closestNode;
            var closestDirection = moveHelper.closestDirection;
            var selection = operation.selection;
            if (!dragNodes.length)
                return;
            if (dragNodes.length && closestNode && closestDirection) {
                if (closestDirection === models_1.ClosestPosition.After ||
                    closestDirection === models_1.ClosestPosition.Under) {
                    if (closestNode.allowSibling(dragNodes)) {
                        selection.batchSafeSelect(closestNode.insertAfter.apply(closestNode, __spreadArray([], __read(models_1.TreeNode.filterDroppable(dragNodes, closestNode.parent)), false)));
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.Before ||
                    closestDirection === models_1.ClosestPosition.Upper) {
                    if (closestNode.allowSibling(dragNodes)) {
                        selection.batchSafeSelect(closestNode.insertBefore.apply(closestNode, __spreadArray([], __read(models_1.TreeNode.filterDroppable(dragNodes, closestNode.parent)), false)));
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.Inner ||
                    closestDirection === models_1.ClosestPosition.InnerAfter) {
                    if (closestNode.allowAppend(dragNodes)) {
                        selection.batchSafeSelect(closestNode.append.apply(closestNode, __spreadArray([], __read(models_1.TreeNode.filterDroppable(dragNodes, closestNode)), false)));
                        moveHelper.dragDrop({ dropNode: closestNode });
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.InnerBefore) {
                    if (closestNode.allowAppend(dragNodes)) {
                        selection.batchSafeSelect(closestNode.prepend.apply(closestNode, __spreadArray([], __read(models_1.TreeNode.filterDroppable(dragNodes, closestNode)), false)));
                        moveHelper.dragDrop({ dropNode: closestNode });
                    }
                }
            }
            moveHelper.dragEnd();
        });
        engine.cursor.setStyle('');
    });
};
exports.useDragDropEffect = useDragDropEffect;
