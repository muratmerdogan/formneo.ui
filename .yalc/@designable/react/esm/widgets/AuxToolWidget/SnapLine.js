import React from 'react';
import { useTransformHelper, useCursor, usePrefix } from '../../hooks';
import { observer } from '@formily/reactive-react';
import { CursorStatus } from '@designable/core';
export var SnapLine = observer(function () {
    var cursor = useCursor();
    var transformHelper = useTransformHelper();
    var prefix = usePrefix('aux-snap-line');
    var createLineStyle = function (rect) {
        var baseStyle = {
            top: 0,
            left: 0,
            height: rect.height || 1,
            width: rect.width || 1,
            transform: "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)"),
            background: "#b0b1f3",
            position: 'absolute',
            zIndex: 2,
        };
        return baseStyle;
    };
    if (cursor.status !== CursorStatus.Dragging)
        return null;
    return (React.createElement(React.Fragment, null, transformHelper.closestSnapLines.map(function (line, key) {
        if (line.type !== 'normal')
            return null;
        return (React.createElement("div", { key: key, className: prefix, style: createLineStyle(line.rect) }));
    })));
});
SnapLine.displayName = 'SnapLine';
