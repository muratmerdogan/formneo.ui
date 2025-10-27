"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslateEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var useTranslateEffect = function (engine) {
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        var _a, _b;
        var target = event.data.target;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[".concat(engine.props.nodeTranslateAttrName, "]"));
        if (!currentWorkspace)
            return;
        var helper = currentWorkspace.operation.transformHelper;
        if (handler) {
            var type = handler.getAttribute(engine.props.nodeTranslateAttrName);
            if (type) {
                var selectionElement = handler.closest("*[".concat(engine.props.nodeSelectionIdAttrName, "]"));
                if (selectionElement) {
                    var nodeId = selectionElement.getAttribute(engine.props.nodeSelectionIdAttrName);
                    if (nodeId) {
                        var node = engine.findNodeById(nodeId);
                        if (node) {
                            helper.dragStart({ dragNodes: [node], type: 'translate' });
                        }
                    }
                }
            }
        }
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        var _a, _b;
        if (engine.cursor.dragType !== models_1.CursorDragType.Translate)
            return;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        var helper = currentWorkspace === null || currentWorkspace === void 0 ? void 0 : currentWorkspace.operation.transformHelper;
        var dragNodes = helper.dragNodes;
        if (!dragNodes.length)
            return;
        helper.dragMove();
        dragNodes.forEach(function (node) {
            var element = node.getElement();
            helper.translate(node, function (translate) {
                element.style.position = 'absolute';
                element.style.left = '0px';
                element.style.top = '0px';
                element.style.transform = "translate3d(".concat(translate.x, "px,").concat(translate.y, "px,0)");
            });
        });
    });
    engine.subscribeTo(events_1.DragStopEvent, function (event) {
        var _a, _b;
        if (engine.cursor.dragType !== models_1.CursorDragType.Translate)
            return;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        var helper = currentWorkspace === null || currentWorkspace === void 0 ? void 0 : currentWorkspace.operation.transformHelper;
        if (helper) {
            helper.dragEnd();
        }
    });
};
exports.useTranslateEffect = useTranslateEffect;
