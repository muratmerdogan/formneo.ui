"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCursor = void 0;
var useDesigner_1 = require("./useDesigner");
var useCursor = function () {
    var designer = (0, useDesigner_1.useDesigner)();
    return designer.cursor;
};
exports.useCursor = useCursor;
