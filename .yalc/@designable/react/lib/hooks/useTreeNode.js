"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeNode = void 0;
var react_1 = require("react");
var context_1 = require("../context");
var useTreeNode = function () {
    return (0, react_1.useContext)(context_1.TreeNodeContext);
};
exports.useTreeNode = useTreeNode;
