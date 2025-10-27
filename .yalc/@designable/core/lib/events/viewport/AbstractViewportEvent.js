"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractViewportEvent = void 0;
var shared_1 = require("@designable/shared");
var AbstractViewportEvent = /** @class */ (function () {
    function AbstractViewportEvent(data) {
        this.data = data || {
            scrollX: shared_1.globalThisPolyfill.scrollX,
            scrollY: shared_1.globalThisPolyfill.scrollY,
            width: shared_1.globalThisPolyfill.innerWidth,
            height: shared_1.globalThisPolyfill.innerHeight,
            innerWidth: shared_1.globalThisPolyfill.innerWidth,
            innerHeight: shared_1.globalThisPolyfill.innerHeight,
            view: shared_1.globalThisPolyfill,
            target: shared_1.globalThisPolyfill,
        };
    }
    return AbstractViewportEvent;
}());
exports.AbstractViewportEvent = AbstractViewportEvent;
