"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransformHelper = void 0;
var useOperation_1 = require("./useOperation");
var useTransformHelper = function (workspaceId) {
    var operation = (0, useOperation_1.useOperation)(workspaceId);
    return operation === null || operation === void 0 ? void 0 : operation.transformHelper;
};
exports.useTransformHelper = useTransformHelper;
