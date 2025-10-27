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
import { TreeNode } from './TreeNode';
import { observable, define, action } from '@formily/reactive';
import { calcDistanceOfPointToRect, calcDistancePointToEdge, isNearAfter, isPointInRect, } from '@designable/shared';
import { DragNodeEvent, DropNodeEvent } from '../events';
import { CursorDragType } from './Cursor';
export var ClosestPosition;
(function (ClosestPosition) {
    ClosestPosition["Before"] = "BEFORE";
    ClosestPosition["ForbidBefore"] = "FORBID_BEFORE";
    ClosestPosition["After"] = "After";
    ClosestPosition["ForbidAfter"] = "FORBID_AFTER";
    ClosestPosition["Upper"] = "UPPER";
    ClosestPosition["ForbidUpper"] = "FORBID_UPPER";
    ClosestPosition["Under"] = "UNDER";
    ClosestPosition["ForbidUnder"] = "FORBID_UNDER";
    ClosestPosition["Inner"] = "INNER";
    ClosestPosition["ForbidInner"] = "FORBID_INNER";
    ClosestPosition["InnerAfter"] = "INNER_AFTER";
    ClosestPosition["ForbidInnerAfter"] = "FORBID_INNER_AFTER";
    ClosestPosition["InnerBefore"] = "INNER_BEFORE";
    ClosestPosition["ForbidInnerBefore"] = "FORBID_INNER_BEFORE";
    ClosestPosition["Forbid"] = "FORBID";
})(ClosestPosition || (ClosestPosition = {}));
var MoveHelper = /** @class */ (function () {
    function MoveHelper(props) {
        this.dragNodes = [];
        this.touchNode = null;
        this.closestNode = null;
        this.activeViewport = null;
        this.viewportClosestRect = null;
        this.outlineClosestRect = null;
        this.viewportClosestOffsetRect = null;
        this.outlineClosestOffsetRect = null;
        this.viewportClosestDirection = null;
        this.outlineClosestDirection = null;
        this.dragging = false;
        this.operation = props.operation;
        this.rootNode = this.operation.tree;
        this.makeObservable();
    }
    Object.defineProperty(MoveHelper.prototype, "cursor", {
        get: function () {
            return this.operation.engine.cursor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveHelper.prototype, "viewport", {
        get: function () {
            return this.operation.workspace.viewport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveHelper.prototype, "outline", {
        get: function () {
            return this.operation.workspace.outline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveHelper.prototype, "hasDragNodes", {
        get: function () {
            return this.dragNodes.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MoveHelper.prototype, "closestDirection", {
        get: function () {
            if (this.activeViewport === this.outline) {
                return this.outlineClosestDirection;
            }
            return this.viewportClosestDirection;
        },
        enumerable: false,
        configurable: true
    });
    MoveHelper.prototype.getClosestLayout = function (viewport) {
        return viewport.getValidNodeLayout(this.closestNode);
    };
    MoveHelper.prototype.calcClosestPosition = function (point, viewport) {
        var _this = this;
        var closestNode = this.closestNode;
        if (!closestNode || !viewport.isPointInViewport(point))
            return ClosestPosition.Forbid;
        var closestRect = viewport.getValidNodeRect(closestNode);
        var isInline = this.getClosestLayout(viewport) === 'horizontal';
        if (!closestRect) {
            return;
        }
        var isAfter = isNearAfter(point, closestRect, viewport.moveInsertionType === 'block' ? false : isInline);
        var getValidParent = function (node) {
            var _a;
            if (!node)
                return;
            if ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.allowSibling(_this.dragNodes))
                return node.parent;
            return getValidParent(node.parent);
        };
        if (isPointInRect(point, closestRect, viewport.moveSensitive)) {
            if (!closestNode.allowAppend(this.dragNodes)) {
                if (!closestNode.allowSibling(this.dragNodes)) {
                    var parentClosestNode = getValidParent(closestNode);
                    if (parentClosestNode) {
                        this.closestNode = parentClosestNode;
                    }
                    if (isInline) {
                        if (parentClosestNode) {
                            if (isAfter) {
                                return ClosestPosition.After;
                            }
                            return ClosestPosition.Before;
                        }
                        if (isAfter) {
                            return ClosestPosition.ForbidAfter;
                        }
                        return ClosestPosition.ForbidBefore;
                    }
                    else {
                        if (parentClosestNode) {
                            if (isAfter) {
                                return ClosestPosition.Under;
                            }
                            return ClosestPosition.Upper;
                        }
                        if (isAfter) {
                            return ClosestPosition.ForbidUnder;
                        }
                        return ClosestPosition.ForbidUpper;
                    }
                }
                else {
                    if (isInline) {
                        return isAfter ? ClosestPosition.After : ClosestPosition.Before;
                    }
                    else {
                        return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
                    }
                }
            }
            if (closestNode.contains.apply(closestNode, __spreadArray([], __read(this.dragNodes), false))) {
                if (isAfter) {
                    return ClosestPosition.InnerAfter;
                }
                return ClosestPosition.InnerBefore;
            }
            else {
                return ClosestPosition.Inner;
            }
        }
        else if (closestNode === closestNode.root) {
            return isAfter ? ClosestPosition.InnerAfter : ClosestPosition.InnerBefore;
        }
        else {
            if (!closestNode.allowSibling(this.dragNodes)) {
                var parentClosestNode = getValidParent(closestNode);
                if (parentClosestNode) {
                    this.closestNode = parentClosestNode;
                }
                if (isInline) {
                    if (parentClosestNode) {
                        if (isAfter) {
                            return ClosestPosition.After;
                        }
                        return ClosestPosition.Before;
                    }
                    return isAfter
                        ? ClosestPosition.ForbidAfter
                        : ClosestPosition.ForbidBefore;
                }
                else {
                    if (parentClosestNode) {
                        if (isAfter) {
                            return ClosestPosition.Under;
                        }
                        return ClosestPosition.Upper;
                    }
                    return isAfter
                        ? ClosestPosition.ForbidUnder
                        : ClosestPosition.ForbidUpper;
                }
            }
            if (isInline) {
                return isAfter ? ClosestPosition.After : ClosestPosition.Before;
            }
            else {
                return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
            }
        }
    };
    MoveHelper.prototype.calcClosestNode = function (point, viewport) {
        var _a, _b;
        if (this.touchNode) {
            var touchNodeRect = viewport.getValidNodeRect(this.touchNode);
            if (!touchNodeRect)
                return;
            if ((_b = (_a = this.touchNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.length) {
                var touchDistance = calcDistancePointToEdge(point, touchNodeRect);
                var minDistance_1 = touchDistance;
                var minDistanceNode_1 = this.touchNode;
                this.touchNode.eachChildren(function (node) {
                    var rect = viewport.getElementRectById(node.id);
                    if (!rect)
                        return;
                    var distance = isPointInRect(point, rect, viewport.moveSensitive)
                        ? 0
                        : calcDistanceOfPointToRect(point, rect);
                    if (distance <= minDistance_1) {
                        minDistance_1 = distance;
                        minDistanceNode_1 = node;
                    }
                });
                return minDistanceNode_1;
            }
            else {
                return this.touchNode;
            }
        }
        return this.operation.tree;
    };
    MoveHelper.prototype.calcClosestRect = function (viewport, closestDirection) {
        var closestNode = this.closestNode;
        if (!closestNode || !closestDirection)
            return;
        var closestRect = viewport.getValidNodeRect(closestNode);
        if (closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.InnerBefore) {
            return viewport.getChildrenRect(closestNode);
        }
        else {
            return closestRect;
        }
    };
    MoveHelper.prototype.calcClosestOffsetRect = function (viewport, closestDirection) {
        var closestNode = this.closestNode;
        if (!closestNode || !closestDirection)
            return;
        var closestRect = viewport.getValidNodeOffsetRect(closestNode);
        if (closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.InnerBefore) {
            return viewport.getChildrenOffsetRect(closestNode);
        }
        else {
            return closestRect;
        }
    };
    MoveHelper.prototype.dragStart = function (props) {
        var nodes = TreeNode.filterDraggable(props === null || props === void 0 ? void 0 : props.dragNodes);
        if (nodes.length) {
            this.dragNodes = nodes;
            this.trigger(new DragNodeEvent({
                target: this.operation.tree,
                source: this.dragNodes,
            }));
            this.viewport.cacheElements();
            this.cursor.setDragType(CursorDragType.Move);
            this.dragging = true;
        }
    };
    MoveHelper.prototype.dragMove = function (props) {
        var point = props.point, touchNode = props.touchNode;
        if (!this.dragging)
            return;
        if (this.outline.isPointInViewport(point, false)) {
            this.activeViewport = this.outline;
            this.touchNode = touchNode;
            this.closestNode = this.calcClosestNode(point, this.outline);
        }
        else if (this.viewport.isPointInViewport(point, false)) {
            this.activeViewport = this.viewport;
            this.touchNode = touchNode;
            this.closestNode = this.calcClosestNode(point, this.viewport);
        }
        if (!this.activeViewport)
            return;
        if (this.activeViewport === this.outline) {
            this.outlineClosestDirection = this.calcClosestPosition(point, this.outline);
            this.viewportClosestDirection = this.outlineClosestDirection;
        }
        else {
            this.viewportClosestDirection = this.calcClosestPosition(point, this.viewport);
            this.outlineClosestDirection = this.viewportClosestDirection;
        }
        if (this.outline.mounted) {
            this.outlineClosestRect = this.calcClosestRect(this.outline, this.outlineClosestDirection);
            this.outlineClosestOffsetRect = this.calcClosestOffsetRect(this.outline, this.outlineClosestDirection);
        }
        if (this.viewport.mounted) {
            this.viewportClosestRect = this.calcClosestRect(this.viewport, this.viewportClosestDirection);
            this.viewportClosestOffsetRect = this.calcClosestOffsetRect(this.viewport, this.viewportClosestDirection);
        }
    };
    MoveHelper.prototype.dragDrop = function (props) {
        this.trigger(new DropNodeEvent({
            target: this.operation.tree,
            source: props === null || props === void 0 ? void 0 : props.dropNode,
        }));
    };
    MoveHelper.prototype.dragEnd = function () {
        this.dragging = false;
        this.dragNodes = [];
        this.touchNode = null;
        this.closestNode = null;
        this.activeViewport = null;
        this.outlineClosestDirection = null;
        this.outlineClosestOffsetRect = null;
        this.outlineClosestRect = null;
        this.viewportClosestDirection = null;
        this.viewportClosestOffsetRect = null;
        this.viewportClosestRect = null;
        this.viewport.clearCache();
    };
    MoveHelper.prototype.trigger = function (event) {
        if (this.operation) {
            return this.operation.dispatch(event);
        }
    };
    MoveHelper.prototype.makeObservable = function () {
        define(this, {
            dragging: observable.ref,
            dragNodes: observable.ref,
            touchNode: observable.ref,
            closestNode: observable.ref,
            outlineClosestDirection: observable.ref,
            outlineClosestOffsetRect: observable.ref,
            outlineClosestRect: observable.ref,
            viewportClosestDirection: observable.ref,
            viewportClosestOffsetRect: observable.ref,
            viewportClosestRect: observable.ref,
            dragStart: action,
            dragMove: action,
            dragEnd: action,
        });
    };
    return MoveHelper;
}());
export { MoveHelper };
