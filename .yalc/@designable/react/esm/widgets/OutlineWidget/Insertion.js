import React from 'react';
import { useMoveHelper, usePrefix } from '../../hooks';
import { ClosestPosition } from '@designable/core';
import { observer } from '@formily/reactive-react';
export var Insertion = observer(function (_a) {
    var workspaceId = _a.workspaceId;
    var moveHelper = useMoveHelper(workspaceId);
    var prefix = usePrefix('outline-tree-insertion');
    var createInsertionStyle = function () {
        var closestDirection = moveHelper.outlineClosestDirection;
        var closestRect = moveHelper.outlineClosestOffsetRect;
        var baseStyle = {
            position: 'absolute',
            transform: 'perspective(1px) translate3d(0,0,0)',
            top: 0,
            left: 0,
        };
        if (!closestRect)
            return baseStyle;
        if (closestDirection === ClosestPosition.After ||
            closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.Under ||
            closestDirection === ClosestPosition.ForbidAfter ||
            closestDirection === ClosestPosition.ForbidInnerAfter ||
            closestDirection === ClosestPosition.ForbidUnder) {
            baseStyle.width = closestRect.width;
            baseStyle.height = 2;
            baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y + closestRect.height - 2, "px,0)");
        }
        else if (closestDirection === ClosestPosition.Before ||
            closestDirection === ClosestPosition.InnerBefore ||
            closestDirection === ClosestPosition.Upper ||
            closestDirection === ClosestPosition.ForbidBefore ||
            closestDirection === ClosestPosition.ForbidInnerBefore ||
            closestDirection === ClosestPosition.ForbidUpper) {
            baseStyle.width = closestRect.width;
            baseStyle.height = 2;
            baseStyle.transform = "perspective(1px) translate3d(".concat(closestRect.x, "px,").concat(closestRect.y, "px,0)");
        }
        if (closestDirection.includes('FORBID')) {
            baseStyle.backgroundColor = 'red';
        }
        else {
            baseStyle.backgroundColor = '';
        }
        return baseStyle;
    };
    if (!(moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.closestNode))
        return null;
    return React.createElement("div", { className: prefix, style: createInsertionStyle() });
});
Insertion.displayName = 'Insertion';
