"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContentEditableEffect = void 0;
var path_1 = require("@formily/path");
var shared_1 = require("@designable/shared");
var events_1 = require("../events");
function getAllRanges(sel) {
    var ranges = [];
    for (var i = 0; i < sel.rangeCount; i++) {
        var range = sel.getRangeAt(i);
        ranges[i] = {
            collapsed: range.collapsed,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
        };
    }
    return ranges;
}
function setEndOfContenteditable(contentEditableElement) {
    var range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    var selection = shared_1.globalThisPolyfill.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
function createCaretCache(el) {
    var currentSelection = shared_1.globalThisPolyfill.getSelection();
    if (currentSelection.containsNode(el))
        return;
    var ranges = getAllRanges(currentSelection);
    return function (offset) {
        if (offset === void 0) { offset = 0; }
        var sel = shared_1.globalThisPolyfill.getSelection();
        var firstNode = el.childNodes[0];
        if (!firstNode)
            return;
        sel.removeAllRanges();
        ranges.forEach(function (item) {
            var range = document.createRange();
            range.collapse(item.collapsed);
            range.setStart(firstNode, item.startOffset + offset);
            range.setEnd(firstNode, item.endOffset + offset);
            sel.addRange(range);
        });
    };
}
var useContentEditableEffect = function (engine) {
    var globalState = {
        activeElements: new Map(),
        queue: [],
        requestTimer: null,
        isComposition: false,
    };
    function onKeyDownHandler(event) {
        if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    function onInputHandler(event) {
        var _this = this;
        var node = globalState.activeElements.get(this);
        event.stopPropagation();
        event.preventDefault();
        if (node) {
            var target_1 = event.target;
            var handler = function () {
                globalState.queue.length = 0;
                if (globalState.isComposition)
                    return;
                var restore = createCaretCache(target_1);
                path_1.Path.setIn(node.props, _this.getAttribute(engine.props.contentEditableAttrName), target_1 === null || target_1 === void 0 ? void 0 : target_1.textContent);
                (0, shared_1.requestIdle)(function () {
                    node.takeSnapshot('update:node:props');
                    restore();
                });
            };
            globalState.queue.push(handler);
            clearTimeout(globalState.requestTimer);
            globalState.requestTimer = setTimeout(handler, 600);
        }
    }
    function onSelectionChangeHandler() {
        clearTimeout(globalState.requestTimer);
        globalState.requestTimer = setTimeout(globalState.queue[globalState.queue.length - 1], 600);
    }
    function onCompositionHandler(event) {
        if (event.type === 'compositionend') {
            globalState.isComposition = false;
            onInputHandler(event);
        }
        else {
            clearTimeout(globalState.requestTimer);
            globalState.isComposition = true;
        }
    }
    function onPastHandler(event) {
        event.preventDefault();
        var node = globalState.activeElements.get(this);
        var text = event.clipboardData.getData('text');
        var selObj = shared_1.globalThisPolyfill.getSelection();
        var target = event.target;
        var selRange = selObj.getRangeAt(0);
        var restore = createCaretCache(target);
        selRange.deleteContents();
        selRange.insertNode(document.createTextNode(text));
        path_1.Path.setIn(node.props, this.getAttribute(engine.props.contentEditableAttrName), target.textContent);
        restore(text.length);
    }
    function findTargetNodeId(element) {
        if (!element)
            return;
        var nodeId = element.getAttribute(engine.props.contentEditableNodeIdAttrName);
        if (nodeId)
            return nodeId;
        var parent = element.closest("*[".concat(engine.props.nodeIdAttrName, "]"));
        if (parent)
            return parent.getAttribute(engine.props.nodeIdAttrName);
    }
    engine.subscribeTo(events_1.MouseClickEvent, function (event) {
        var _a;
        var target = event.data.target;
        var editableElement = (_a = target === null || target === void 0 ? void 0 : target.closest) === null || _a === void 0 ? void 0 : _a.call(target, "*[".concat(engine.props.contentEditableAttrName, "]"));
        if (editableElement &&
            editableElement.getAttribute('contenteditable') === 'true')
            return;
        globalState.activeElements.forEach(function (node, element) {
            globalState.activeElements.delete(element);
            element.removeAttribute('contenteditable');
            element.removeAttribute('spellcheck');
            element.removeEventListener('input', onInputHandler);
            element.removeEventListener('compositionstart', onCompositionHandler);
            element.removeEventListener('compositionupdate', onCompositionHandler);
            element.removeEventListener('compositionend', onCompositionHandler);
            element.removeEventListener('past', onPastHandler);
            document.removeEventListener('selectionchange', onSelectionChangeHandler);
        });
    });
    engine.subscribeTo(events_1.MouseDoubleClickEvent, function (event) {
        var _a;
        var target = event.data.target;
        var editableElement = (_a = target === null || target === void 0 ? void 0 : target.closest) === null || _a === void 0 ? void 0 : _a.call(target, "*[".concat(engine.props.contentEditableAttrName, "]"));
        var workspace = engine.workbench.activeWorkspace;
        var tree = workspace.operation.tree;
        if (editableElement) {
            var editable = editableElement.getAttribute('contenteditable');
            if (editable === 'false' || !editable) {
                var nodeId = findTargetNodeId(editableElement);
                if (nodeId) {
                    var targetNode = tree.findById(nodeId);
                    if (targetNode) {
                        globalState.activeElements.set(editableElement, targetNode);
                        editableElement.setAttribute('spellcheck', 'false');
                        editableElement.setAttribute('contenteditable', 'true');
                        editableElement.focus();
                        editableElement.addEventListener('input', onInputHandler);
                        editableElement.addEventListener('compositionstart', onCompositionHandler);
                        editableElement.addEventListener('compositionupdate', onCompositionHandler);
                        editableElement.addEventListener('compositionend', onCompositionHandler);
                        editableElement.addEventListener('keydown', onKeyDownHandler);
                        editableElement.addEventListener('paste', onPastHandler);
                        document.addEventListener('selectionchange', onSelectionChangeHandler);
                        setEndOfContenteditable(editableElement);
                    }
                }
            }
        }
    });
};
exports.useContentEditableEffect = useContentEditableEffect;
