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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformHelper = void 0;
var shared_1 = require("@designable/shared");
var reactive_1 = require("@formily/reactive");
var SpaceBlock_1 = require("./SpaceBlock");
var TreeNode_1 = require("./TreeNode");
var SnapLine_1 = require("./SnapLine");
var Cursor_1 = require("./Cursor");
var TransformHelper = /** @class */ (function () {
    function TransformHelper(props) {
        this.dragNodes = [];
        this.rulerSnapLines = [];
        this.aroundSnapLines = [];
        this.aroundSpaceBlocks = null;
        this.viewportRectsStore = {};
        this.dragStartTranslateStore = {};
        this.dragStartSizeStore = {};
        this.dragStartNodesRect = null;
        this.snapping = false;
        this.dragging = false;
        this.snapped = false;
        this.operation = props.operation;
        this.makeObservable();
    }
    Object.defineProperty(TransformHelper.prototype, "tree", {
        get: function () {
            return this.operation.tree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "cursor", {
        get: function () {
            return this.operation.engine.cursor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "viewport", {
        get: function () {
            return this.operation.workspace.viewport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "deltaX", {
        get: function () {
            return this.cursor.dragStartToCurrentDelta.clientX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "deltaY", {
        get: function () {
            return this.cursor.dragStartToCurrentDelta.clientY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "cursorPosition", {
        get: function () {
            var position = this.cursor.position;
            return this.operation.workspace.viewport.getOffsetPoint(new shared_1.Point(position.clientX, position.clientY));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "cursorDragNodesRect", {
        get: function () {
            if (this.type === 'translate') {
                return new shared_1.Rect(this.cursorPosition.x - this.dragStartCursorOffset.x, this.cursorPosition.y - this.dragStartCursorOffset.y, this.dragNodesRect.width, this.dragNodesRect.height);
            }
            else if (this.type === 'resize') {
                var dragNodesRect = this.dragStartNodesRect;
                var deltaX = this.cursor.dragStartToCurrentDelta.clientX;
                var deltaY = this.cursor.dragStartToCurrentDelta.clientY;
                switch (this.direction) {
                    case 'left-top':
                        return new shared_1.Rect(this.cursorPosition.x - this.dragStartCursorOffset.x, this.cursorPosition.y - this.dragStartCursorOffset.y, dragNodesRect.width - deltaX, dragNodesRect.height - deltaY);
                    case 'left-center':
                        return new shared_1.Rect(this.cursorPosition.x - this.dragStartCursorOffset.x, dragNodesRect.y, dragNodesRect.width - deltaX, dragNodesRect.height);
                    case 'left-bottom':
                        return new shared_1.Rect(this.cursorPosition.x - this.dragStartCursorOffset.x, dragNodesRect.y, dragNodesRect.width - deltaX, dragNodesRect.height - deltaY);
                    case 'center-top':
                        return new shared_1.Rect(dragNodesRect.x, this.cursorPosition.y - this.dragStartCursorOffset.y, dragNodesRect.width, dragNodesRect.height - deltaY);
                    case 'center-bottom':
                        return new shared_1.Rect(dragNodesRect.x, dragNodesRect.y, dragNodesRect.width, dragNodesRect.height + deltaY);
                    case 'right-top':
                        return new shared_1.Rect(dragNodesRect.x, this.cursorPosition.y - this.dragStartCursorOffset.y, dragNodesRect.width + deltaX, dragNodesRect.height - deltaY);
                    case 'right-center':
                        return new shared_1.Rect(dragNodesRect.x, dragNodesRect.y, dragNodesRect.width + deltaX, dragNodesRect.height);
                    case 'right-bottom':
                        return new shared_1.Rect(dragNodesRect.x, dragNodesRect.y, dragNodesRect.width + deltaX, dragNodesRect.height - deltaY);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "cursorDragNodesEdgeLines", {
        get: function () {
            return (0, shared_1.calcEdgeLinesOfRect)(this.cursorDragNodesRect);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "dragNodesRect", {
        get: function () {
            if (this.draggingNodesRect)
                return this.draggingNodesRect;
            return (0, shared_1.calcBoundingRect)(this.dragNodes.map(function (node) { return node.getValidElementOffsetRect(); }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "dragNodesEdgeLines", {
        get: function () {
            return (0, shared_1.calcEdgeLinesOfRect)(this.dragNodesRect);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "cursorOffset", {
        get: function () {
            return new shared_1.Point(this.cursorPosition.x - this.dragNodesRect.x, this.cursorPosition.y - this.dragNodesRect.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "dragStartCursor", {
        get: function () {
            var position = this.operation.engine.cursor.dragStartPosition;
            return this.operation.workspace.viewport.getOffsetPoint(new shared_1.Point(position.clientX, position.clientY));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "dragStartCursorOffset", {
        get: function () {
            return new shared_1.Point(this.dragStartCursor.x - this.dragStartNodesRect.x, this.dragStartCursor.y - this.dragStartNodesRect.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "closestSnapLines", {
        get: function () {
            if (!this.dragging)
                return [];
            var results = [];
            var cursorDragNodesEdgeLines = this.cursorDragNodesEdgeLines;
            this.thresholdSnapLines.forEach(function (line) {
                var distance = (0, shared_1.calcDistanceOfSnapLineToEdges)(line, cursorDragNodesEdgeLines);
                if (distance < TransformHelper.threshold) {
                    var existed = results.findIndex(function (l) {
                        return l.distance > distance &&
                            l.distance > 0 &&
                            l.direction === line.direction;
                    });
                    if (existed > -1) {
                        results.splice(existed, 1);
                    }
                    results.push(line);
                }
            });
            return results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "closestSpaceBlocks", {
        get: function () {
            if (!this.dragging)
                return [];
            var cursorDragNodesEdgeLines = this.cursorDragNodesEdgeLines;
            return this.thresholdSpaceBlocks.filter(function (block) {
                var line = block.snapLine;
                if (!line)
                    return false;
                return ((0, shared_1.calcDistanceOfSnapLineToEdges)(line, cursorDragNodesEdgeLines) <
                    TransformHelper.threshold);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "thresholdSnapLines", {
        get: function () {
            if (!this.dragging)
                return [];
            var lines = [];
            this.aroundSnapLines.forEach(function (line) {
                lines.push(line);
            });
            this.rulerSnapLines.forEach(function (line) {
                if (line.closest) {
                    lines.push(line);
                }
            });
            for (var type in this.aroundSpaceBlocks) {
                var block = this.aroundSpaceBlocks[type];
                var line = block.snapLine;
                if (line) {
                    lines.push(line);
                }
            }
            return lines;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "thresholdSpaceBlocks", {
        get: function () {
            var results = [];
            if (!this.dragging)
                return [];
            for (var type in this.aroundSpaceBlocks) {
                var block = this.aroundSpaceBlocks[type];
                if (!block.snapLine)
                    return [];
                if (block.snapLine.distance !== 0)
                    return [];
                if (block.isometrics.length) {
                    results.push(block);
                    results.push.apply(results, __spreadArray([], __read(block.isometrics), false));
                }
            }
            return results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformHelper.prototype, "measurerSpaceBlocks", {
        get: function () {
            var results = [];
            if (!this.dragging || !this.snapped)
                return [];
            for (var type in this.aroundSpaceBlocks) {
                if (this.aroundSpaceBlocks[type])
                    results.push(this.aroundSpaceBlocks[type]);
            }
            return results;
        },
        enumerable: false,
        configurable: true
    });
    TransformHelper.prototype.calcBaseTranslate = function (node) {
        var _a;
        var dragStartTranslate = (_a = this.dragStartTranslateStore[node.id]) !== null && _a !== void 0 ? _a : {
            x: 0,
            y: 0,
        };
        var x = dragStartTranslate.x + this.deltaX, y = dragStartTranslate.y + this.deltaY;
        return { x: x, y: y };
    };
    TransformHelper.prototype.calcBaseResize = function (node) {
        var _a, _b;
        var deltaX = this.deltaX;
        var deltaY = this.deltaY;
        var dragStartTranslate = (_a = this.dragStartTranslateStore[node.id]) !== null && _a !== void 0 ? _a : {
            x: 0,
            y: 0,
        };
        var dragStartSize = (_b = this.dragStartSizeStore[node.id]) !== null && _b !== void 0 ? _b : {
            width: 0,
            height: 0,
        };
        switch (this.direction) {
            case 'left-top':
                return new shared_1.Rect(dragStartTranslate.x + deltaX, dragStartTranslate.y + deltaY, dragStartSize.width - deltaX, dragStartSize.height - deltaY);
            case 'left-center':
                return new shared_1.Rect(dragStartTranslate.x + deltaX, dragStartTranslate.y, dragStartSize.width - deltaX, dragStartSize.height);
            case 'left-bottom':
                return new shared_1.Rect(dragStartTranslate.x + deltaX, dragStartTranslate.y, dragStartSize.width - deltaX, dragStartSize.height + deltaY);
            case 'center-bottom':
                return new shared_1.Rect(dragStartTranslate.x, dragStartTranslate.y, dragStartSize.width, dragStartSize.height + deltaY);
            case 'center-top':
                return new shared_1.Rect(dragStartTranslate.x, dragStartTranslate.y + deltaY, dragStartSize.width, dragStartSize.height - deltaY);
            case 'right-top':
                return new shared_1.Rect(dragStartTranslate.x, dragStartTranslate.y + deltaY, dragStartSize.width + deltaX, dragStartSize.height - deltaY);
            case 'right-bottom':
                return new shared_1.Rect(dragStartTranslate.x, dragStartTranslate.y, dragStartSize.width + deltaX, dragStartSize.height + deltaY);
            case 'right-center':
                return new shared_1.Rect(dragStartTranslate.x, dragStartTranslate.y, dragStartSize.width + deltaX, dragStartSize.height);
        }
    };
    TransformHelper.prototype.calcDragStartStore = function (nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = []; }
        this.dragStartNodesRect = this.dragNodesRect;
        nodes.forEach(function (node) {
            var element = node.getElement();
            var rect = node.getElementOffsetRect();
            _this.dragStartTranslateStore[node.id] = (0, shared_1.calcElementTranslate)(element);
            _this.dragStartSizeStore[node.id] = {
                width: rect.width,
                height: rect.height,
            };
        });
    };
    TransformHelper.prototype.calcRulerSnapLines = function (dragNodesRect) {
        var edgeLines = (0, shared_1.calcEdgeLinesOfRect)(dragNodesRect);
        return this.rulerSnapLines.map(function (line) {
            line.distance = (0, shared_1.calcDistanceOfSnapLineToEdges)(line, edgeLines);
            return line;
        });
    };
    TransformHelper.prototype.calcAroundSnapLines = function (dragNodesRect) {
        var _this = this;
        var results = [];
        var edgeLines = (0, shared_1.calcEdgeLinesOfRect)(dragNodesRect);
        this.eachViewportNodes(function (refer, referRect) {
            if (_this.dragNodes.includes(refer))
                return;
            var referLines = (0, shared_1.calcEdgeLinesOfRect)(referRect);
            var add = function (line) {
                var _a = __read((0, shared_1.calcClosestEdges)(line, edgeLines), 2), distance = _a[0], edge = _a[1];
                var combined = (0, shared_1.calcCombineSnapLineSegment)(line, edge);
                if (distance < TransformHelper.threshold) {
                    if (_this.snapping && distance !== 0)
                        return;
                    var snapLine = new SnapLine_1.SnapLine(_this, __assign(__assign({}, combined), { distance: distance }));
                    var edge_1 = snapLine.snapEdge(dragNodesRect);
                    if (_this.type === 'translate') {
                        results.push(snapLine);
                    }
                    else if (edge_1 !== 'hc' && edge_1 !== 'vc') {
                        results.push(snapLine);
                    }
                }
            };
            referLines.h.forEach(add);
            referLines.v.forEach(add);
        });
        return results;
    };
    TransformHelper.prototype.calcAroundSpaceBlocks = function (dragNodesRect) {
        var _this = this;
        var closestSpaces = {};
        this.eachViewportNodes(function (refer, referRect) {
            if ((0, shared_1.isEqualRect)(dragNodesRect, referRect))
                return;
            var origin = (0, shared_1.calcSpaceBlockOfRect)(dragNodesRect, referRect);
            if (origin) {
                var spaceBlock = new SpaceBlock_1.SpaceBlock(_this, __assign({ refer: refer }, origin));
                if (!closestSpaces[origin.type]) {
                    closestSpaces[origin.type] = spaceBlock;
                }
                else if (spaceBlock.distance < closestSpaces[origin.type].distance) {
                    closestSpaces[origin.type] = spaceBlock;
                }
            }
        });
        return closestSpaces;
    };
    TransformHelper.prototype.calcViewportNodes = function () {
        var _this = this;
        this.tree.eachTree(function (node) {
            var topRect = node.getValidElementRect();
            var offsetRect = node.getValidElementOffsetRect();
            if (_this.dragNodes.includes(node))
                return;
            if (_this.viewport.isRectInViewport(topRect)) {
                _this.viewportRectsStore[node.id] = offsetRect;
            }
        });
    };
    TransformHelper.prototype.getNodeRect = function (node) {
        return this.viewportRectsStore[node.id];
    };
    TransformHelper.prototype.eachViewportNodes = function (visitor) {
        for (var id in this.viewportRectsStore) {
            visitor(this.tree.findById(id), this.viewportRectsStore[id]);
        }
    };
    TransformHelper.prototype.translate = function (node, handler) {
        var e_1, _a;
        if (!this.dragging)
            return;
        var translate = this.calcBaseTranslate(node);
        this.snapped = false;
        this.snapping = false;
        try {
            for (var _b = __values(this.closestSnapLines), _c = _b.next(); !_c.done; _c = _b.next()) {
                var line = _c.value;
                line.translate(node, translate);
                this.snapping = true;
                this.snapped = true;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        handler(translate);
        if (this.snapping) {
            this.dragMove();
            this.snapping = false;
        }
    };
    TransformHelper.prototype.resize = function (node, handler) {
        var e_2, _a;
        if (!this.dragging)
            return;
        var rect = this.calcBaseResize(node);
        this.snapping = false;
        this.snapping = false;
        try {
            for (var _b = __values(this.closestSnapLines), _c = _b.next(); !_c.done; _c = _b.next()) {
                var line = _c.value;
                line.resize(node, rect);
                this.snapping = true;
                this.snapped = true;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        handler(rect);
        if (this.snapping) {
            this.dragMove();
            this.snapping = false;
        }
    };
    // rotate(node: TreeNode, handler: (rotate: number) => void) {}
    // scale(node: TreeNode, handler: (scale: number) => void) {}
    // round(node: TreeNode, handler: (round: number) => void) {}
    TransformHelper.prototype.findRulerSnapLine = function (id) {
        return this.rulerSnapLines.find(function (item) { return item.id === id; });
    };
    TransformHelper.prototype.addRulerSnapLine = function (line) {
        if (!(0, shared_1.isLineSegment)(line))
            return;
        if (!this.findRulerSnapLine(line.id)) {
            this.rulerSnapLines.push(new SnapLine_1.SnapLine(this, __assign(__assign({}, line), { type: 'ruler' })));
        }
    };
    TransformHelper.prototype.removeRulerSnapLine = function (id) {
        var matchedLineIndex = this.rulerSnapLines.findIndex(function (item) { return item.id === id; });
        if (matchedLineIndex > -1) {
            this.rulerSnapLines.splice(matchedLineIndex, 1);
        }
    };
    TransformHelper.prototype.dragStart = function (props) {
        var dragNodes = props === null || props === void 0 ? void 0 : props.dragNodes;
        var type = props === null || props === void 0 ? void 0 : props.type;
        var direction = props === null || props === void 0 ? void 0 : props.direction;
        if (type === 'resize') {
            var nodes = TreeNode_1.TreeNode.filterResizable(dragNodes);
            if (nodes.length) {
                this.dragging = true;
                this.type = type;
                this.direction = direction;
                this.dragNodes = nodes;
                this.calcDragStartStore(nodes);
                this.cursor.setDragType(Cursor_1.CursorDragType.Resize);
            }
        }
        else if (type === 'translate') {
            var nodes = TreeNode_1.TreeNode.filterTranslatable(dragNodes);
            if (nodes.length) {
                this.dragging = true;
                this.type = type;
                this.direction = direction;
                this.dragNodes = nodes;
                this.calcDragStartStore(nodes);
                this.cursor.setDragType(Cursor_1.CursorDragType.Translate);
            }
        }
        else if (type === 'rotate') {
            var nodes = TreeNode_1.TreeNode.filterRotatable(dragNodes);
            if (nodes.length) {
                this.dragging = true;
                this.type = type;
                this.dragNodes = nodes;
                this.calcDragStartStore(nodes);
                this.cursor.setDragType(Cursor_1.CursorDragType.Rotate);
            }
        }
        else if (type === 'scale') {
            var nodes = TreeNode_1.TreeNode.filterScalable(dragNodes);
            if (nodes.length) {
                this.dragging = true;
                this.type = type;
                this.dragNodes = nodes;
                this.calcDragStartStore(nodes);
                this.cursor.setDragType(Cursor_1.CursorDragType.Scale);
            }
        }
        else if (type === 'round') {
            var nodes = TreeNode_1.TreeNode.filterRoundable(dragNodes);
            if (nodes.length) {
                this.dragging = true;
                this.type = type;
                this.dragNodes = nodes;
                this.calcDragStartStore(nodes);
                this.cursor.setDragType(Cursor_1.CursorDragType.Round);
            }
        }
        if (this.dragging) {
            this.calcViewportNodes();
        }
    };
    TransformHelper.prototype.dragMove = function () {
        if (!this.dragging)
            return;
        this.draggingNodesRect = null;
        this.draggingNodesRect = this.dragNodesRect;
        this.rulerSnapLines = this.calcRulerSnapLines(this.dragNodesRect);
        this.aroundSnapLines = this.calcAroundSnapLines(this.dragNodesRect);
        this.aroundSpaceBlocks = this.calcAroundSpaceBlocks(this.dragNodesRect);
    };
    TransformHelper.prototype.dragEnd = function () {
        this.dragging = false;
        this.viewportRectsStore = {};
        this.dragStartTranslateStore = {};
        this.aroundSnapLines = [];
        this.draggingNodesRect = null;
        this.aroundSpaceBlocks = null;
        this.dragStartNodesRect = null;
        this.dragNodes = [];
        this.cursor.setDragType(Cursor_1.CursorDragType.Move);
    };
    TransformHelper.prototype.makeObservable = function () {
        (0, reactive_1.define)(this, {
            snapped: reactive_1.observable.ref,
            dragging: reactive_1.observable.ref,
            snapping: reactive_1.observable.ref,
            dragNodes: reactive_1.observable.ref,
            aroundSnapLines: reactive_1.observable.ref,
            aroundSpaceBlocks: reactive_1.observable.ref,
            rulerSnapLines: reactive_1.observable.shallow,
            closestSnapLines: reactive_1.observable.computed,
            thresholdSnapLines: reactive_1.observable.computed,
            thresholdSpaceBlocks: reactive_1.observable.computed,
            measurerSpaceBlocks: reactive_1.observable.computed,
            cursor: reactive_1.observable.computed,
            cursorPosition: reactive_1.observable.computed,
            cursorOffset: reactive_1.observable.computed,
            dragStartCursor: reactive_1.observable.computed,
            translate: reactive_1.action,
            dragStart: reactive_1.action,
            dragMove: reactive_1.action,
            dragEnd: reactive_1.action,
        });
    };
    TransformHelper.threshold = 6;
    return TransformHelper;
}());
exports.TransformHelper = TransformHelper;
