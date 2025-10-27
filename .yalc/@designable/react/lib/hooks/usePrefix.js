"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrefix = void 0;
var useLayout_1 = require("./useLayout");
var usePrefix = function (after) {
    var _a;
    if (after === void 0) { after = ''; }
    return ((_a = (0, useLayout_1.useLayout)()) === null || _a === void 0 ? void 0 : _a.prefixCls) + after;
};
exports.usePrefix = usePrefix;
