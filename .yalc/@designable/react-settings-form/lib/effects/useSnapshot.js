"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSnapshot = void 0;
var core_1 = require("@formily/core");
var timeRequest = null;
var useSnapshot = function (operation) {
    (0, core_1.onFieldInputValueChange)('*', function () {
        clearTimeout(timeRequest);
        timeRequest = setTimeout(function () {
            operation.snapshot('update:node:props');
        }, 1000);
    });
};
exports.useSnapshot = useSnapshot;
