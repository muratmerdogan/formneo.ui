import React from 'react';
import { useHover, usePrefix, useValidNodeOffsetRect, useSelection, } from '../../hooks';
import { observer } from '@formily/reactive-react';
export var DashedBox = observer(function () {
    var hover = useHover();
    var prefix = usePrefix('aux-dashed-box');
    var selection = useSelection();
    var rect = useValidNodeOffsetRect(hover === null || hover === void 0 ? void 0 : hover.node);
    var createTipsStyle = function () {
        var baseStyle = {
            top: 0,
            left: 0,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            visibility: 'hidden',
            zIndex: 2,
        };
        if (rect) {
            baseStyle.transform = "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)");
            baseStyle.height = rect.height;
            baseStyle.width = rect.width;
            baseStyle.visibility = 'visible';
        }
        return baseStyle;
    };
    if (!hover.node)
        return null;
    if (hover.node.hidden)
        return null;
    if (selection.selected.includes(hover.node.id))
        return null;
    return (React.createElement("div", { className: prefix, style: createTipsStyle() },
        React.createElement("span", { className: prefix + '-title', style: {
                position: 'absolute',
                bottom: '100%',
                left: 0,
                fontSize: 12,
                userSelect: 'none',
                fontWeight: 'lighter',
                whiteSpace: 'nowrap',
            } }, hover === null || hover === void 0 ? void 0 : hover.node.getMessage('title'))));
});
DashedBox.displayName = 'DashedBox';
