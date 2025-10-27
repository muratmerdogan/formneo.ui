import React, { Fragment } from 'react';
import { useTransformHelper, useCursor, usePrefix } from '../../hooks';
import { observer } from '@formily/reactive-react';
import { CursorStatus } from '@designable/core';
import { calcRectOfAxisLineSegment } from '@designable/shared';
export var SpaceBlock = observer(function () {
    var cursor = useCursor();
    var transformHelper = useTransformHelper();
    var prefix = usePrefix('aux-space-block');
    if (cursor.status !== CursorStatus.Dragging)
        return null;
    var renderRulerBox = function (distance, type) {
        if (type === 'top' || type === 'bottom') {
            return (React.createElement("div", { className: prefix + '-ruler-v' },
                React.createElement("div", { className: prefix + '-ruler-indicator' },
                    React.createElement("span", null, distance === null || distance === void 0 ? void 0 : distance.toFixed(0)))));
        }
        else if (type === 'left' || type === 'right') {
            return (React.createElement("div", { className: prefix + '-ruler-h' },
                React.createElement("div", { className: prefix + '-ruler-indicator' },
                    React.createElement("span", null, distance === null || distance === void 0 ? void 0 : distance.toFixed(0)))));
        }
    };
    var renderDashedLine = function (line) {
        var rect = calcRectOfAxisLineSegment(line);
        if (!rect)
            return null;
        var width = rect.width || 2;
        var height = rect.height || 2;
        return (React.createElement("svg", { width: width + 'px', height: height + 'px', viewBox: "0 0 ".concat(width, " ").concat(height), style: {
                top: 0,
                left: 0,
                transform: "perspective(1px) translate3d(".concat(line.start.x, "px,").concat(line.start.y, "px,0)"),
                position: 'absolute',
                zIndex: 3,
            } },
            React.createElement("line", { x1: line.start.x - rect.x, y1: line.start.y - rect.y, x2: line.end.x - rect.x, y2: line.end.y - rect.y, strokeDasharray: 4, stroke: "#745BFF", strokeWidth: 2 })));
    };
    return (React.createElement(React.Fragment, null,
        transformHelper.measurerSpaceBlocks.map(function (_a, key) {
            var type = _a.type, crossDragNodesRect = _a.crossDragNodesRect, distance = _a.distance, extendsLine = _a.extendsLine;
            return (React.createElement(Fragment, null,
                renderDashedLine(extendsLine),
                React.createElement("div", { key: key, style: {
                        top: 0,
                        left: 0,
                        height: crossDragNodesRect.height,
                        width: crossDragNodesRect.width,
                        transform: "perspective(1px) translate3d(".concat(crossDragNodesRect.x, "px,").concat(crossDragNodesRect.y, "px,0)"),
                        position: 'absolute',
                        zIndex: 3,
                    } }, renderRulerBox(distance, type))));
        }),
        transformHelper.thresholdSpaceBlocks.map(function (_a, key) {
            var rect = _a.rect;
            return (React.createElement("div", { key: key, className: prefix, style: {
                    top: 0,
                    left: 0,
                    height: rect.height,
                    width: rect.width,
                    transform: "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)"),
                    position: 'absolute',
                    background: 'rgba(255, 0, 0, 0.2)',
                    zIndex: 1,
                } }));
        })));
});
SpaceBlock.displayName = 'SpaceBlock';
