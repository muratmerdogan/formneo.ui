"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewportResizeEvent = void 0;
var AbstractViewportEvent_1 = require("./AbstractViewportEvent");
var ViewportResizeEvent = /** @class */ (function (_super) {
    __extends(ViewportResizeEvent, _super);
    function ViewportResizeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'viewport:resize';
        return _this;
    }
    return ViewportResizeEvent;
}(AbstractViewportEvent_1.AbstractViewportEvent));
exports.ViewportResizeEvent = ViewportResizeEvent;
