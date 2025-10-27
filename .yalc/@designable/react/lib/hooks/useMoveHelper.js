"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMoveHelper = void 0;
var useOperation_1 = require("./useOperation");
var useMoveHelper = function (workspaceId) {
    var operation = (0, useOperation_1.useOperation)(workspaceId);
    return operation === null || operation === void 0 ? void 0 : operation.moveHelper;
};
exports.useMoveHelper = useMoveHelper;
