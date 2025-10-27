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
import React from 'react';
import { observer } from '@formily/reactive-react';
import { IconWidget } from '../IconWidget';
import { useDesigner, usePrefix } from '../../hooks';
import { Button } from 'antd';
export var DragHandler = observer(function (_a) {
    var _b;
    var node = _a.node, style = _a.style;
    var designer = useDesigner();
    var prefix = usePrefix('aux-drag-handler');
    if (node === node.root || !node.allowDrag())
        return null;
    var handlerProps = (_b = {},
        _b[designer.props.nodeDragHandlerAttrName] = 'true',
        _b);
    return (React.createElement(Button, __assign({}, handlerProps, { className: prefix, style: style, type: "primary" }),
        React.createElement(IconWidget, { infer: "Move" })));
});
DragHandler.displayName = 'DragHandler';
