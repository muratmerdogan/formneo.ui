"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCursorEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useCursorEffect = function (engine) {
    engine.subscribeTo(events_1.MouseMoveEvent, function (event) {
        engine.cursor.setStatus(engine.cursor.status === models_1.CursorStatus.Dragging ||
            engine.cursor.status === models_1.CursorStatus.DragStart
            ? engine.cursor.status
            : models_1.CursorStatus.Normal);
        if (engine.cursor.status === models_1.CursorStatus.Dragging)
            return;
        engine.cursor.setPosition(event.data);
    });
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        engine.cursor.setStatus(models_1.CursorStatus.DragStart);
        engine.cursor.setDragStartPosition(event.data);
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        engine.cursor.setStatus(models_1.CursorStatus.Dragging);
        engine.cursor.setPosition(event.data);
    });
    engine.subscribeTo(events_1.DragStopEvent, function (event) {
        engine.cursor.setStatus(models_1.CursorStatus.DragStop);
        engine.cursor.setDragEndPosition(event.data);
        engine.cursor.setDragStartPosition(null);
        (0, shared_1.requestIdle)(function () {
            engine.cursor.setStatus(models_1.CursorStatus.Normal);
        });
    });
    engine.subscribeTo(events_1.MouseMoveEvent, function (event) {
        var _a, _b;
        var currentWorkspace = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace;
        if (!currentWorkspace)
            return;
        var operation = currentWorkspace.operation;
        if (engine.cursor.status !== models_1.CursorStatus.Normal) {
            operation.hover.clear();
            return;
        }
        var target = event.data.target;
        var el = (_b = target === null || target === void 0 ? void 0 : target.closest) === null || _b === void 0 ? void 0 : _b.call(target, "\n      *[".concat(engine.props.nodeIdAttrName, "],\n      *[").concat(engine.props.outlineNodeIdAttrName, "]\n    "));
        if (!(el === null || el === void 0 ? void 0 : el.getAttribute)) {
            return;
        }
        var nodeId = el.getAttribute(engine.props.nodeIdAttrName);
        var outlineNodeId = el.getAttribute(engine.props.outlineNodeIdAttrName);
        var node = operation.tree.findById(nodeId || outlineNodeId);
        if (node) {
            operation.hover.setHover(node);
        }
        else {
            operation.hover.clear();
        }
    });
};
exports.useCursorEffect = useCursorEffect;
