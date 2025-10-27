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
import { isValidNumber } from './types';
export function isRect(rect) {
    return (rect === null || rect === void 0 ? void 0 : rect.x) && (rect === null || rect === void 0 ? void 0 : rect.y) && (rect === null || rect === void 0 ? void 0 : rect.width) && (rect === null || rect === void 0 ? void 0 : rect.height);
}
export function isPoint(val) {
    return isValidNumber(val === null || val === void 0 ? void 0 : val.x) && isValidNumber(val === null || val === void 0 ? void 0 : val.y);
}
export function isLineSegment(val) {
    return isPoint(val === null || val === void 0 ? void 0 : val.start) && isPoint(val === null || val === void 0 ? void 0 : val.end);
}
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
export { Point };
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rect.prototype, "left", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "top", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    return Rect;
}());
export { Rect };
var LineSegment = /** @class */ (function () {
    function LineSegment(start, end) {
        this.start = __assign({}, start);
        this.end = __assign({}, end);
    }
    return LineSegment;
}());
export { LineSegment };
export var RectQuadrant;
(function (RectQuadrant) {
    RectQuadrant["Inner1"] = "I1";
    RectQuadrant["Inner2"] = "I2";
    RectQuadrant["Inner3"] = "I3";
    RectQuadrant["Inner4"] = "I4";
    RectQuadrant["Outer1"] = "O1";
    RectQuadrant["Outer2"] = "O2";
    RectQuadrant["Outer3"] = "O3";
    RectQuadrant["Outer4"] = "O4";
})(RectQuadrant || (RectQuadrant = {}));
export function isPointInRect(point, rect, sensitive) {
    if (sensitive === void 0) { sensitive = true; }
    var boundSensor = function (value) {
        if (!sensitive)
            return 0;
        var sensor = value * 0.1;
        if (sensor > 20)
            return 20;
        if (sensor < 10)
            return 10;
        return sensor;
    };
    return (point.x >= rect.x + boundSensor(rect.width) &&
        point.x <= rect.x + rect.width - boundSensor(rect.width) &&
        point.y >= rect.y + boundSensor(rect.height) &&
        point.y <= rect.y + rect.height - boundSensor(rect.height));
}
export function isEqualRect(target, source) {
    return ((target === null || target === void 0 ? void 0 : target.x) === (source === null || source === void 0 ? void 0 : source.x) &&
        target.y === source.y &&
        target.width === source.width &&
        target.height === source.height);
}
export function getRectPoints(source) {
    var p1 = new Point(source.x, source.y);
    var p2 = new Point(source.x + source.width, source.y);
    var p3 = new Point(source.x + source.width, source.y + source.height);
    var p4 = new Point(source.x, source.y + source.height);
    return [p1, p2, p3, p4];
}
export function isRectInRect(target, source) {
    var _a = __read(getRectPoints(target), 4), p1 = _a[0], p2 = _a[1], p3 = _a[2], p4 = _a[3];
    return (isPointInRect(p1, source, false) &&
        isPointInRect(p2, source, false) &&
        isPointInRect(p3, source, false) &&
        isPointInRect(p4, source, false));
}
export function isCrossRectInRect(target, source) {
    var targetCenterPoint = new Point(target.x + target.width / 2, target.y + target.height / 2);
    var sourceCenterPoint = new Point(source.x + source.width / 2, source.y + source.height / 2);
    return (Math.abs(targetCenterPoint.x - sourceCenterPoint.x) <=
        target.width / 2 + source.width / 2 &&
        Math.abs(targetCenterPoint.y - sourceCenterPoint.y) <=
            target.height / 2 + source.height / 2);
}
/**
 * 计算点在矩形的哪个象限
 * @param point
 * @param rect
 */
export function calcQuadrantOfPointToRect(point, rect) {
    var isInner = isPointInRect(point, rect);
    if (point.x <= rect.x + rect.width / 2) {
        if (point.y <= rect.y + rect.height / 2) {
            if (isInner) {
                return RectQuadrant.Inner1;
            }
            else {
                return RectQuadrant.Outer1;
            }
        }
        else {
            if (isInner) {
                return RectQuadrant.Inner4;
            }
            else {
                return RectQuadrant.Outer4;
            }
        }
    }
    else {
        if (point.y <= rect.y + rect.height / 2) {
            if (isInner) {
                return RectQuadrant.Inner2;
            }
            else {
                return RectQuadrant.Outer2;
            }
        }
        else {
            if (isInner) {
                return RectQuadrant.Inner3;
            }
            else {
                return RectQuadrant.Outer3;
            }
        }
    }
}
export function calcDistanceOfPointToRect(point, rect) {
    var minX = Math.min(Math.abs(point.x - rect.x), Math.abs(point.x - (rect.x + rect.width)));
    var minY = Math.min(Math.abs(point.y - rect.y), Math.abs(point.y - (rect.y + rect.height)));
    if (point.x >= rect.x && point.x <= rect.x + rect.width) {
        minX = 0;
    }
    if (point.y >= rect.y && point.y <= rect.y + rect.height) {
        minY = 0;
    }
    return Math.sqrt(Math.pow(minX, 2) + Math.pow(minY, 2));
}
export function calcDistancePointToEdge(point, rect) {
    var distanceTop = Math.abs(point.y - rect.y);
    var distanceBottom = Math.abs(point.y - (rect.y + rect.height));
    var distanceLeft = Math.abs(point.x - rect.x);
    var distanceRight = Math.abs(point.x - (rect.x + rect.width));
    return Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight);
}
export function isNearAfter(point, rect, inline) {
    if (inline === void 0) { inline = false; }
    if (inline) {
        return (Math.abs(point.x - rect.x) + Math.abs(point.y - rect.y) >
            Math.abs(point.x - (rect.x + rect.width)) +
                Math.abs(point.y - (rect.y + rect.height)));
    }
    return Math.abs(point.y - rect.y) > Math.abs(point.y - (rect.y + rect.height));
}
/**
 * 计算点鱼矩形的相对位置信息
 * @param point
 * @param rect
 */
export function calcRelativeOfPointToRect(point, rect) {
    var distance = calcDistanceOfPointToRect(point, rect);
    var quadrant = calcQuadrantOfPointToRect(point, rect);
    return {
        quadrant: quadrant,
        distance: distance,
    };
}
export function calcBoundingRect(rects) {
    if (!(rects === null || rects === void 0 ? void 0 : rects.length))
        return;
    if ((rects === null || rects === void 0 ? void 0 : rects.length) === 1 && !rects[0])
        return;
    var minTop = Infinity;
    var maxBottom = -Infinity;
    var minLeft = Infinity;
    var maxRight = -Infinity;
    rects.forEach(function (item) {
        var rect = new Rect(item.x, item.y, item.width, item.height);
        if (rect.top <= minTop) {
            minTop = rect.top;
        }
        if (rect.bottom >= maxBottom) {
            maxBottom = rect.bottom;
        }
        if (rect.left <= minLeft) {
            minLeft = rect.left;
        }
        if (rect.right >= maxRight) {
            maxRight = rect.right;
        }
    });
    return new Rect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop);
}
export function calcRectByStartEndPoint(startPoint, endPoint, scrollX, scrollY) {
    if (scrollX === void 0) { scrollX = 0; }
    if (scrollY === void 0) { scrollY = 0; }
    var drawStartX = 0, drawStartY = 0;
    if (endPoint.x + scrollX >= startPoint.x &&
        endPoint.y + scrollY >= startPoint.y) {
        //4象限
        drawStartX = startPoint.x;
        drawStartY = startPoint.y;
        return new Rect(drawStartX - scrollX, drawStartY - scrollY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY));
    }
    else if (endPoint.x + scrollX < startPoint.x &&
        endPoint.y + scrollY < startPoint.y) {
        //1象限
        drawStartX = endPoint.x;
        drawStartY = endPoint.y;
        return new Rect(drawStartX, drawStartY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY));
    }
    else if (endPoint.x + scrollX < startPoint.x &&
        endPoint.y + scrollY >= startPoint.y) {
        //3象限
        drawStartX = endPoint.x;
        drawStartY = startPoint.y;
        return new Rect(drawStartX - scrollX, drawStartY - scrollY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY));
    }
    else {
        //2象限
        drawStartX = startPoint.x;
        drawStartY = endPoint.y;
        return new Rect(drawStartX, drawStartY, Math.abs(endPoint.x - startPoint.x + scrollX), Math.abs(endPoint.y - startPoint.y + scrollY));
    }
}
export function calcEdgeLinesOfRect(rect) {
    return {
        v: [
            new LineSegment(new Point(rect.x, rect.y), new Point(rect.x, rect.y + rect.height)),
            new LineSegment(new Point(rect.x + rect.width / 2, rect.y), new Point(rect.x + rect.width / 2, rect.y + rect.height)),
            new LineSegment(new Point(rect.x + rect.width, rect.y), new Point(rect.x + rect.width, rect.y + rect.height)),
        ],
        h: [
            new LineSegment(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y)),
            new LineSegment(new Point(rect.x, rect.y + rect.height / 2), new Point(rect.x + rect.width, rect.y + rect.height / 2)),
            new LineSegment(new Point(rect.x, rect.y + rect.height), new Point(rect.x + rect.width, rect.y + rect.height)),
        ],
    };
}
export function calcRectOfAxisLineSegment(line) {
    if (!isLineSegment(line))
        return;
    var isXAxis = line.start.x === line.end.x;
    return new Rect(line.start.x, line.start.y, isXAxis ? 0 : line.end.x - line.start.x, isXAxis ? line.end.y - line.start.y : 0);
}
export function calcSpaceBlockOfRect(target, source, type) {
    var targetRect = new Rect(target.x, target.y, target.width, target.height);
    var sourceRect = new Rect(source.x, source.y, source.width, source.height);
    if (sourceRect.bottom < targetRect.top && sourceRect.left > targetRect.right)
        return;
    if (sourceRect.top > targetRect.bottom && sourceRect.left > targetRect.right)
        return;
    if (sourceRect.bottom < targetRect.top && sourceRect.right < targetRect.left)
        return;
    if (sourceRect.top > targetRect.bottom && sourceRect.right < targetRect.left)
        return;
    if (sourceRect.bottom < targetRect.top) {
        var distance = targetRect.top - sourceRect.bottom;
        var left = Math.min(sourceRect.left, targetRect.left);
        var right = Math.max(sourceRect.right, targetRect.right);
        if (type && type !== 'top')
            return;
        return {
            type: 'top',
            distance: distance,
            rect: new Rect(left, sourceRect.bottom, right - left, distance),
        };
    }
    else if (sourceRect.top > targetRect.bottom) {
        var distance = sourceRect.top - targetRect.bottom;
        var left = Math.min(sourceRect.left, targetRect.left);
        var right = Math.max(sourceRect.right, targetRect.right);
        if (type && type !== 'bottom')
            return;
        return {
            type: 'bottom',
            distance: distance,
            rect: new Rect(left, targetRect.bottom, right - left, distance),
        };
    }
    else if (sourceRect.right < targetRect.left) {
        var distance = targetRect.left - sourceRect.right;
        var top_1 = Math.min(sourceRect.top, targetRect.top);
        var bottom = Math.max(sourceRect.bottom, targetRect.bottom);
        if (type && type !== 'left')
            return;
        return {
            type: 'left',
            distance: distance,
            rect: new Rect(sourceRect.right, top_1, distance, bottom - top_1),
        };
    }
    else if (sourceRect.left > targetRect.right) {
        var distance = sourceRect.left - targetRect.right;
        var top_2 = Math.min(sourceRect.top, targetRect.top);
        var bottom = Math.max(sourceRect.bottom, targetRect.bottom);
        if (type && type !== 'right')
            return;
        return {
            type: 'right',
            distance: distance,
            rect: new Rect(targetRect.right, top_2, distance, bottom - top_2),
        };
    }
}
export function calcExtendsLineSegmentOfRect(targetRect, referRect) {
    if (referRect.right < targetRect.right &&
        targetRect.left <= referRect.right) {
        //右侧
        if (referRect.bottom < targetRect.top) {
            //上方
            return {
                start: { x: referRect.right, y: referRect.bottom },
                end: { x: targetRect.right, y: referRect.bottom },
            };
        }
        else if (referRect.top > targetRect.bottom) {
            //下方
            return {
                start: { x: referRect.right, y: referRect.top },
                end: { x: targetRect.right, y: referRect.top },
            };
        }
    }
    else if (referRect.left > targetRect.left &&
        targetRect.right >= referRect.left) {
        //左侧
        if (referRect.bottom < targetRect.top) {
            //上方
            return {
                start: { x: targetRect.left, y: referRect.bottom },
                end: { x: referRect.left, y: referRect.bottom },
            };
        }
        else if (referRect.top > targetRect.bottom) {
            //下方
            return {
                start: { x: targetRect.left, y: referRect.top },
                end: { x: referRect.left, y: referRect.top },
            };
        }
    }
    if (referRect.top < targetRect.top && targetRect.bottom >= referRect.top) {
        //refer在上方
        if (referRect.right < targetRect.left) {
            //右侧
            return {
                start: { x: referRect.right, y: referRect.bottom },
                end: { x: referRect.right, y: targetRect.bottom },
            };
        }
        else if (referRect.left > targetRect.right) {
            //左侧
            return {
                start: { x: referRect.left, y: referRect.bottom },
                end: { x: referRect.left, y: targetRect.bottom },
            };
        }
    }
    else if (referRect.bottom > targetRect.bottom &&
        referRect.top <= targetRect.bottom) {
        //refer下方
        if (referRect.right < targetRect.left) {
            //右侧
            return {
                start: { x: referRect.right, y: targetRect.top },
                end: { x: referRect.right, y: referRect.top },
            };
        }
        else if (referRect.left > targetRect.right) {
            //左侧
            return {
                start: { x: referRect.left, y: targetRect.top },
                end: { x: referRect.left, y: referRect.top },
            };
        }
    }
}
export function calcOffsetOfSnapLineSegmentToEdge(line, current) {
    var edges = calcEdgeLinesOfRect(current);
    var isVerticalLine = line.start.x === line.end.x;
    if (isVerticalLine) {
        return { x: calcMinDistanceValue(edges.x, line.start.x) - current.x, y: 0 };
    }
    function calcEdgeLinesOfRect(rect) {
        return {
            x: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
            y: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
        };
    }
    function calcMinDistanceValue(edges, targetValue) {
        var minDistance = Infinity, minDistanceIndex = -1;
        for (var i = 0; i < edges.length; i++) {
            var distance = Math.abs(edges[i] - targetValue);
            if (minDistance > distance) {
                minDistance = distance;
                minDistanceIndex = i;
            }
        }
        return edges[minDistanceIndex];
    }
    return { x: 0, y: calcMinDistanceValue(edges.y, line.start.y) - current.y };
}
export function calcDistanceOfSnapLineToEdges(line, edges) {
    var _a, _b, _c, _d;
    var distance = Infinity;
    if (((_a = line === null || line === void 0 ? void 0 : line.start) === null || _a === void 0 ? void 0 : _a.y) === ((_b = line === null || line === void 0 ? void 0 : line.end) === null || _b === void 0 ? void 0 : _b.y)) {
        edges.h.forEach(function (target) {
            var _distance = Math.abs(target.start.y - line.start.y);
            if (_distance < distance) {
                distance = _distance;
            }
        });
    }
    else if (((_c = line === null || line === void 0 ? void 0 : line.start) === null || _c === void 0 ? void 0 : _c.x) === ((_d = line === null || line === void 0 ? void 0 : line.end) === null || _d === void 0 ? void 0 : _d.x)) {
        edges.v.forEach(function (target) {
            var _distance = Math.abs(target.start.x - line.start.x);
            if (_distance < distance) {
                distance = _distance;
            }
        });
    }
    else {
        throw new Error('can not calculate slash distance');
    }
    return distance;
}
export function calcCombineSnapLineSegment(target, source) {
    if (target.start.x === target.end.x) {
        return new LineSegment(new Point(target.start.x, target.start.y > source.start.y ? source.start.y : target.start.y), new Point(target.start.x, target.end.y > source.end.y ? target.end.y : source.end.y));
    }
    return new LineSegment(new Point(target.start.x > source.start.x ? source.start.x : target.start.x, target.start.y), new Point(target.end.x > source.end.x ? target.end.x : source.end.x, target.end.y));
}
export function calcClosestEdges(line, edges) {
    var _a, _b, _c, _d;
    var result;
    var distance = Infinity;
    if (((_a = line === null || line === void 0 ? void 0 : line.start) === null || _a === void 0 ? void 0 : _a.y) === ((_b = line === null || line === void 0 ? void 0 : line.end) === null || _b === void 0 ? void 0 : _b.y)) {
        edges.h.forEach(function (target) {
            var _distance = Math.abs(target.start.y - line.start.y);
            if (_distance < distance) {
                distance = _distance;
                result = target;
            }
        });
    }
    else if (((_c = line === null || line === void 0 ? void 0 : line.start) === null || _c === void 0 ? void 0 : _c.x) === ((_d = line === null || line === void 0 ? void 0 : line.end) === null || _d === void 0 ? void 0 : _d.x)) {
        edges.v.forEach(function (target) {
            var _distance = Math.abs(target.start.x - line.start.x);
            if (_distance < distance) {
                distance = _distance;
                result = target;
            }
        });
    }
    else {
        throw new Error('can not calculate slash distance');
    }
    return [distance, result];
}
