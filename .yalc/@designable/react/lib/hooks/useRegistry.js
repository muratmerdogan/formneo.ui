"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegistry = void 0;
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var useRegistry = function () {
    return shared_1.globalThisPolyfill['__DESIGNER_REGISTRY__'] || core_1.GlobalRegistry;
};
exports.useRegistry = useRegistry;
