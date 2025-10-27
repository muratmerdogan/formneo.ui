"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insertion = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var core_1 = require("@designable/core");
var reactive_react_1 = require("@formily/reactive-react");
exports.Insertion = (0, reactive_react_1.observer)(function () {
    var moveHelper = (0, hooks_1.useMoveHelper)();
    var prefix = (0, hooks_1.usePrefix)('aux-insertion');
    var createInsertionStyle = function () {
        var _a;
        var closestDirection = moveHelper.viewportClosestDirection;
        var closestRect = moveHelper.viewportClosestOffsetRect;
        var isInlineLayout = ((_a = moveHelper.closestNode) === null || _a === void 0 ? void 0 : _a.moveLayout) === 'horizontal';
        var baseStyle = {
            position: 'absolute',
            transform: 'perspective(1px) translate3d(0,0,0)',
            top: 0,
            left: 0,
        };
        if (!closestRect)
            return baseStyle;
        if (closestDirection === core_1.ClosestPosition.Before ||
            closestDirection === core_1.ClosestPosition.ForbidBefore) {
            baseStyle.width = 2;
            baseStyle.height = closestRect.height;
            baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y, "px,0)");
        }
        else if (closestDirection === core_1.ClosestPosition.After ||
            closestDirection === core_1.ClosestPosition.ForbidAfter) {
            baseStyle.width = 2;
            baseStyle.height = closestRect.height;
            baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x + closestRect.width - 2, "px,").concat(closestRect.y, "px,0)");
        }
        else if (closestDirection === core_1.ClosestPosition.InnerAfter ||
            closestDirection === core_1.ClosestPosition.Under ||
            closestDirection === core_1.ClosestPosition.ForbidInnerAfter ||
            closestDirection === core_1.ClosestPosition.ForbidUnder) {
            if (isInlineLayout) {
                baseStyle.width = 2;
                baseStyle.height = closestRect.height;
                baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x + closestRect.width - 2, "px,").concat(closestRect.y, "px,0)");
            }
            else {
                baseStyle.width = closestRect.width;
                baseStyle.height = 2;
                baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y + closestRect.height - 2, "px,0)");
            }
        }
        else if (closestDirection === core_1.ClosestPosition.InnerBefore ||
            closestDirection === core_1.ClosestPosition.Upper ||
            closestDirection === core_1.ClosestPosition.ForbidInnerBefore ||
            closestDirection === core_1.ClosestPosition.ForbidUpper) {
            if (isInlineLayout) {
                baseStyle.width = 2;
                baseStyle.height = closestRect.height;
                baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y, "px,0)");
            }
            else {
                baseStyle.width = closestRect.width;
                baseStyle.height = 2;
                baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y, "px,0)");
            }
        }
        if (closestDirection.includes('FORBID')) {
            baseStyle.backgroundColor = 'red';
        }
        return baseStyle;
    };
    return react_1.default.createElement("div", { className: prefix, style: createInsertionStyle() });
});
exports.Insertion.displayName = 'Insertion';
