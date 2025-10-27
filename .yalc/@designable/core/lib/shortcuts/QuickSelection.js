"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectNextNode = exports.SelectPrevNode = void 0;
var models_1 = require("../models");
var findBottomLastChild = function (node) {
    if (!node)
        return node;
    if (node.lastChild) {
        return findBottomLastChild(node.lastChild);
    }
    return node;
};
var findTopParentNext = function (node) {
    var _a;
    if (!node.parent)
        return node;
    if ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.next)
        return node.parent.next;
    return findTopParentNext(node.parent);
};
exports.SelectPrevNode = new models_1.Shortcut({
    codes: [
        [models_1.KeyCode.Up],
        [models_1.KeyCode.PageUp],
        [models_1.KeyCode.ArrowUp],
        [models_1.KeyCode.Left],
        [models_1.KeyCode.LeftWindowKey],
        [models_1.KeyCode.ArrowLeft],
    ],
    handler: function (context) {
        var operation = context === null || context === void 0 ? void 0 : context.workspace.operation;
        if (operation) {
            var tree = operation.tree;
            var selection = operation.selection;
            var selectedNode = tree.findById(selection.last);
            if (selectedNode) {
                var previousNode = selectedNode.previous;
                if (previousNode) {
                    var bottom = findBottomLastChild(previousNode);
                    if (bottom) {
                        selection.select(bottom);
                    }
                    else {
                        selection.select(previousNode);
                    }
                }
                else if (selectedNode.parent) {
                    selection.select(selectedNode.parent);
                }
                else {
                    var bottom = findBottomLastChild(selectedNode.lastChild);
                    if (bottom) {
                        selection.select(bottom);
                    }
                }
            }
        }
    },
});
exports.SelectNextNode = new models_1.Shortcut({
    codes: [
        [models_1.KeyCode.Down],
        [models_1.KeyCode.PageDown],
        [models_1.KeyCode.ArrowDown],
        [models_1.KeyCode.Right],
        [models_1.KeyCode.RightWindowKey],
        [models_1.KeyCode.ArrowRight],
    ],
    handler: function (context) {
        var operation = context === null || context === void 0 ? void 0 : context.workspace.operation;
        if (operation) {
            var tree = operation.tree;
            var selection = operation.selection;
            var selectedNode = tree.findById(selection.last);
            if (selectedNode) {
                var nextNode = selectedNode.firstChild
                    ? selectedNode.firstChild
                    : selectedNode.next;
                if (nextNode) {
                    selection.select(nextNode);
                }
                else {
                    selection.select(findTopParentNext(selectedNode));
                }
            }
        }
    },
});
