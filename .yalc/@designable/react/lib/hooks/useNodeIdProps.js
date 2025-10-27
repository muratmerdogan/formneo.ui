"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodeIdProps = void 0;
var useDesigner_1 = require("./useDesigner");
var useTreeNode_1 = require("./useTreeNode");
var useNodeIdProps = function (node) {
    var _a;
    var target = (0, useTreeNode_1.useTreeNode)();
    var designer = (0, useDesigner_1.useDesigner)();
    return _a = {},
        _a[designer.props.nodeIdAttrName] = node ? node.id : target.id,
        _a;
};
exports.useNodeIdProps = useNodeIdProps;
