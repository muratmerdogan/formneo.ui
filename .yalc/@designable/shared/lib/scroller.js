"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollAnimate = exports.updateScrollValue = exports.calcAutoScrollBasicInfo = void 0;
var animation_1 = require("./animation");
var types_1 = require("./types");
var MAX_SPEED = 80; // px/s
var calcAutoScrollBasicInfo = function (point, axis, viewport, maxSpeed) {
    if (maxSpeed === void 0) { maxSpeed = MAX_SPEED; }
    var left = viewport.left, right = viewport.right, top = viewport.top, bottom = viewport.bottom;
    var x = point.x, y = point.y;
    var begin;
    var end;
    var pos;
    var speedFactor;
    if (axis === 'x') {
        begin = left;
        end = right;
        pos = x;
    }
    else {
        begin = top;
        end = bottom;
        pos = y;
    }
    var scrollerSize = end - begin;
    var moveDistance = scrollerSize > 400 ? 100 : scrollerSize / 3;
    if (end - pos < moveDistance) {
        return {
            direction: 'end',
            speedFactor: speedFactor,
            speed: maxSpeed * (0, animation_1.calcSpeedFactor)(end - pos, moveDistance),
        };
    }
    else if (pos - begin < moveDistance) {
        return {
            direction: 'begin',
            speedFactor: speedFactor,
            speed: maxSpeed * (0, animation_1.calcSpeedFactor)(pos - begin, moveDistance),
        };
    }
    return null;
};
exports.calcAutoScrollBasicInfo = calcAutoScrollBasicInfo;
var updateScrollValue = function (element, axis, value, callback) {
    if (element) {
        if (!(0, types_1.isWindow)(element)) {
            if (axis === 'x') {
                if (element.scrollLeft + value > element.scrollWidth)
                    return;
                element.scrollLeft += value;
                if ((0, types_1.isFn)(callback)) {
                    callback(element.scrollLeft);
                }
            }
            else {
                if (element.scrollTop + value > element.scrollHeight)
                    return;
                element.scrollTop += value;
                if ((0, types_1.isFn)(callback)) {
                    callback(element.scrollTop);
                }
            }
        }
        else {
            if (axis === 'x') {
                element.scrollBy({
                    left: value,
                    behavior: 'smooth',
                });
            }
            else {
                element.scrollBy({
                    top: value,
                    behavior: 'smooth',
                });
            }
            if ((0, types_1.isFn)(callback)) {
                callback(value);
            }
        }
    }
};
exports.updateScrollValue = updateScrollValue;
var scrollAnimate = function (element, axis, direction, speed, callback) {
    return (0, animation_1.createUniformSpeedAnimation)(speed, function (delta) {
        (0, exports.updateScrollValue)(element, axis, direction === 'begin' ? 0 - delta : delta, callback);
    });
};
exports.scrollAnimate = scrollAnimate;
