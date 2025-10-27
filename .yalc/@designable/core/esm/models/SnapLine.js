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
import { calcRectOfAxisLineSegment, calcOffsetOfSnapLineSegmentToEdge, } from '@designable/shared';
import { TransformHelper } from './TransformHelper';
var SnapLine = /** @class */ (function () {
    function SnapLine(helper, line) {
        this.helper = helper;
        this.type = line.type || 'normal';
        this._id = line.id;
        this.refer = line.refer;
        this.start = __assign({}, line.start);
        this.end = __assign({}, line.end);
        this.distance = line.distance;
    }
    Object.defineProperty(SnapLine.prototype, "id", {
        get: function () {
            var _a;
            return ((_a = this._id) !== null && _a !== void 0 ? _a : "".concat(this.start.x, "-").concat(this.start.y, "-").concat(this.end.x, "-").concat(this.end.y));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapLine.prototype, "direction", {
        get: function () {
            var _a, _b;
            if (((_a = this.start) === null || _a === void 0 ? void 0 : _a.x) === ((_b = this.end) === null || _b === void 0 ? void 0 : _b.x))
                return 'v';
            return 'h';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapLine.prototype, "closest", {
        get: function () {
            return this.distance < TransformHelper.threshold;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnapLine.prototype, "rect", {
        get: function () {
            return calcRectOfAxisLineSegment(this);
        },
        enumerable: false,
        configurable: true
    });
    SnapLine.prototype.translate = function (node, translate) {
        if (!node || !(node === null || node === void 0 ? void 0 : node.parent))
            return;
        var parent = node.parent;
        var dragNodeRect = node.getValidElementOffsetRect();
        var parentRect = parent.getValidElementOffsetRect();
        var edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect);
        if (this.direction === 'h') {
            translate.y = this.start.y - parentRect.y - edgeOffset.y;
        }
        else {
            translate.x = this.start.x - parentRect.x - edgeOffset.x;
        }
    };
    SnapLine.prototype.resize = function (node, rect) {
        if (!node || !(node === null || node === void 0 ? void 0 : node.parent))
            return;
        var parent = node.parent;
        var dragNodeRect = node.getValidElementOffsetRect();
        var parentRect = parent.getValidElementOffsetRect();
        var edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect);
        var cursorRect = this.helper.cursorDragNodesRect;
        var snapEdge = this.snapEdge(rect);
        if (this.direction === 'h') {
            var y = this.start.y - parentRect.y - edgeOffset.y;
            switch (this.helper.direction) {
                case 'left-top':
                case 'center-top':
                case 'right-top':
                    if (snapEdge !== 'ht')
                        return;
                    rect.y = y;
                    rect.height = cursorRect.bottom - y;
                    break;
                case 'left-bottom':
                case 'center-bottom':
                case 'right-bottom':
                    if (snapEdge !== 'hb')
                        return;
                    rect.height = this.start.y - cursorRect.top;
                    break;
            }
        }
        else {
            var x = this.start.x - parentRect.x - edgeOffset.x;
            switch (this.helper.direction) {
                case 'left-top':
                case 'left-bottom':
                case 'left-center':
                    if (snapEdge !== 'vl')
                        return;
                    rect.x = x;
                    rect.width = cursorRect.right - x;
                    break;
                case 'right-center':
                case 'right-top':
                case 'right-bottom':
                    if (snapEdge !== 'vr')
                        return;
                    rect.width = this.start.x - cursorRect.left;
                    break;
            }
        }
    };
    SnapLine.prototype.snapEdge = function (rect) {
        var threshold = TransformHelper.threshold;
        if (this.direction === 'h') {
            if (Math.abs(this.start.y - rect.top) < threshold)
                return 'ht';
            if (Math.abs(this.start.y - (rect.top + rect.height / 2)) < threshold)
                return 'hc';
            if (Math.abs(this.start.y - rect.bottom) < threshold)
                return 'hb';
        }
        else {
            if (Math.abs(this.start.x - rect.left) < threshold)
                return 'vl';
            if (Math.abs(this.start.x - (rect.left + rect.width / 2)) < threshold)
                return 'vc';
            if (Math.abs(this.start.x - rect.right) < threshold)
                return 'vr';
        }
    };
    return SnapLine;
}());
export { SnapLine };
