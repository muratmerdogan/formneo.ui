"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
var useLayout_1 = require("./useLayout");
var useTheme = function () {
    var _a;
    return (_a = (0, useLayout_1.useLayout)()) === null || _a === void 0 ? void 0 : _a.theme;
};
exports.useTheme = useTheme;
