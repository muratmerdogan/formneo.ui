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
import React, { Fragment } from 'react';
import { Helpers } from './Helpers';
import { ResizeHandler } from './ResizeHandler';
import { useSelection, useValidNodeOffsetRect, useTree, useCursor, useMoveHelper, usePrefix, useDesigner, } from '../../hooks';
import { observer } from '@formily/reactive-react';
import { TranslateHandler } from './TranslateHandler';
export var SelectionBox = function (props) {
    var _a;
    var _b;
    var designer = useDesigner();
    var prefix = usePrefix('aux-selection-box');
    var innerPrefix = usePrefix('aux-selection-box-inner');
    var nodeRect = useValidNodeOffsetRect(props.node);
    var createSelectionStyle = function () {
        var baseStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            boxSizing: 'border-box',
            zIndex: 4,
        };
        if (nodeRect) {
            baseStyle.transform = "perspective(1px) translate3d(".concat(nodeRect.x, "px,").concat(nodeRect.y, "px,0)");
            baseStyle.height = nodeRect.height;
            baseStyle.width = nodeRect.width;
        }
        return baseStyle;
    };
    if (!nodeRect)
        return null;
    if (!nodeRect.width || !nodeRect.height)
        return null;
    var selectionId = (_a = {},
        _a[(_b = designer.props) === null || _b === void 0 ? void 0 : _b.nodeSelectionIdAttrName] = props.node.id,
        _a);
    return (React.createElement("div", __assign({}, selectionId, { className: prefix, style: createSelectionStyle() }),
        React.createElement("div", { className: innerPrefix }),
        React.createElement(ResizeHandler, { node: props.node }),
        React.createElement(TranslateHandler, { node: props.node }),
        props.showHelpers && (React.createElement(Helpers, __assign({}, props, { node: props.node, nodeRect: nodeRect })))));
};
export var Selection = observer(function () {
    var selection = useSelection();
    var tree = useTree();
    var cursor = useCursor();
    var viewportMoveHelper = useMoveHelper();
    if (cursor.status !== 'NORMAL' && viewportMoveHelper.touchNode)
        return null;
    return (React.createElement(Fragment, null, selection.selected.map(function (id) {
        var node = tree.findById(id);
        if (!node)
            return;
        if (node.hidden)
            return;
        return (React.createElement(SelectionBox, { key: id, node: node, showHelpers: selection.selected.length === 1 }));
    })));
});
Selection.displayName = 'Selection';
