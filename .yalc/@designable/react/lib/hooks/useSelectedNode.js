"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentNode = exports.useSelectedNode = void 0;
var useSelected_1 = require("./useSelected");
var useTree_1 = require("./useTree");
var useSelectedNode = function (workspaceId) {
    var _a;
    var selected = (0, useSelected_1.useSelected)(workspaceId);
    var tree = (0, useTree_1.useTree)(workspaceId);
    return (_a = tree === null || tree === void 0 ? void 0 : tree.findById) === null || _a === void 0 ? void 0 : _a.call(tree, selected[0]);
};
exports.useSelectedNode = useSelectedNode;
/**
 * @deprecated
 * please use useSelectedNode
 */
exports.useCurrentNode = exports.useSelectedNode;
