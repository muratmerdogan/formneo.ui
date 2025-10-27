"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectionEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useSelectionEffect = function (engine) {
    engine.subscribeTo(events_1.MouseClickEvent, function (event) {
        var _a, _b, _c, _d;
        if (engine.cursor.status !== models_1.CursorStatus.Normal)
            return;
        var target = event.data.target;
        var el = (_a = target === null || target === void 0 ? void 0 : target.closest) === null || _a === void 0 ? void 0 : _a.call(target, "\n      *[".concat(engine.props.nodeIdAttrName, "],\n      *[").concat(engine.props.outlineNodeIdAttrName, "]\n    "));
        var isHelpers = (_b = target === null || target === void 0 ? void 0 : target.closest) === null || _b === void 0 ? void 0 : _b.call(target, "*[".concat(engine.props.nodeSelectionIdAttrName, "]"));
        var currentWorkspace = (_d = (_c = event.context) === null || _c === void 0 ? void 0 : _c.workspace) !== null && _d !== void 0 ? _d : engine.workbench.activeWorkspace;
        if (!currentWorkspace)
            return;
        if (!(el === null || el === void 0 ? void 0 : el.getAttribute)) {
            var point = new shared_1.Point(event.data.topClientX, event.data.topClientY);
            var operation_1 = currentWorkspace.operation;
            var viewport = currentWorkspace.viewport;
            var outline = currentWorkspace.outline;
            var isInViewport = viewport.isPointInViewport(point, false);
            var isInOutline = outline.isPointInViewport(point, false);
            if (isHelpers)
                return;
            if (isInViewport || isInOutline) {
                var selection_1 = operation_1.selection;
                var tree_1 = operation_1.tree;
                selection_1.select(tree_1);
            }
            return;
        }
        var nodeId = el.getAttribute(engine.props.nodeIdAttrName);
        var structNodeId = el.getAttribute(engine.props.outlineNodeIdAttrName);
        var operation = currentWorkspace.operation;
        var selection = operation.selection;
        var tree = operation.tree;
        var node = tree.findById(nodeId || structNodeId);
        if (node) {
            engine.keyboard.requestClean();
            if (engine.keyboard.isKeyDown(shared_1.KeyCode.Meta) ||
                engine.keyboard.isKeyDown(shared_1.KeyCode.Control)) {
                if (selection.has(node)) {
                    if (selection.selected.length > 1) {
                        selection.remove(node);
                    }
                }
                else {
                    selection.add(node);
                }
            }
            else if (engine.keyboard.isKeyDown(shared_1.KeyCode.Shift)) {
                if (selection.has(node)) {
                    if (selection.selected.length > 1) {
                        selection.remove(node);
                    }
                }
                else {
                    selection.crossAddTo(node);
                }
            }
            else {
                selection.select(node);
            }
        }
        else {
            selection.select(tree);
        }
    });
};
exports.useSelectionEffect = useSelectionEffect;
