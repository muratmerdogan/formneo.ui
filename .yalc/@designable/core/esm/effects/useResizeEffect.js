import { CursorDragType } from '../models';
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events';
export var useResizeEffect = function (engine) {
    var findStartNodeHandler = function (target) {
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[".concat(engine.props.nodeResizeHandlerAttrName, "]"));
        if (handler) {
            var direction = handler.getAttribute(engine.props.nodeResizeHandlerAttrName);
            if (direction) {
                var element = handler.closest("*[".concat(engine.props.nodeSelectionIdAttrName, "]"));
                if (element) {
                    var nodeId = element.getAttribute(engine.props.nodeSelectionIdAttrName);
                    if (nodeId) {
                        var node = engine.findNodeById(nodeId);
                        if (node) {
                            return { direction: direction, node: node, element: element };
                        }
                    }
                }
            }
        }
        return;
    };
    engine.subscribeTo(DragStartEvent, function (event) {
        var _a, _b;
        var target = event.data.target;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        if (!currentWorkspace)
            return;
        var handler = findStartNodeHandler(target);
        var helper = currentWorkspace.operation.transformHelper;
        if (handler) {
            var selectionElement = handler.element.closest("*[".concat(engine.props.nodeSelectionIdAttrName, "]"));
            if (selectionElement) {
                var nodeId = selectionElement.getAttribute(engine.props.nodeSelectionIdAttrName);
                if (nodeId) {
                    var node = engine.findNodeById(nodeId);
                    if (node) {
                        helper.dragStart({
                            dragNodes: [node],
                            type: 'resize',
                            direction: handler.direction,
                        });
                    }
                }
            }
        }
    });
    engine.subscribeTo(DragMoveEvent, function (event) {
        var _a, _b;
        if (engine.cursor.dragType !== CursorDragType.Resize)
            return;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        var helper = currentWorkspace === null || currentWorkspace === void 0 ? void 0 : currentWorkspace.operation.transformHelper;
        var dragNodes = helper.dragNodes;
        if (!dragNodes.length)
            return;
        helper.dragMove();
        dragNodes.forEach(function (node) {
            var element = node.getElement();
            helper.resize(node, function (rect) {
                element.style.width = rect.width + 'px';
                element.style.height = rect.height + 'px';
                element.style.position = 'absolute';
                element.style.left = '0px';
                element.style.top = '0px';
                element.style.transform = "translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)");
            });
        });
    });
    engine.subscribeTo(DragStopEvent, function (event) {
        var _a, _b;
        if (engine.cursor.dragType !== CursorDragType.Resize)
            return;
        var currentWorkspace = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.workspace) !== null && _b !== void 0 ? _b : engine.workbench.activeWorkspace;
        var helper = currentWorkspace === null || currentWorkspace === void 0 ? void 0 : currentWorkspace.operation.transformHelper;
        if (helper) {
            helper.dragEnd();
        }
    });
};
