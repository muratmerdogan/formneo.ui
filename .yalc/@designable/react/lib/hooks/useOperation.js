"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOperation = void 0;
var useWorkspace_1 = require("./useWorkspace");
var useOperation = function (workspaceId) {
    var workspace = (0, useWorkspace_1.useWorkspace)(workspaceId);
    return workspace === null || workspace === void 0 ? void 0 : workspace.operation;
};
exports.useOperation = useOperation;
