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
exports.DragStopEvent = void 0;
var AbstractCursorEvent_1 = require("./AbstractCursorEvent");
var DragStopEvent = /** @class */ (function (_super) {
    __extends(DragStopEvent, _super);
    function DragStopEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'drag:stop';
        return _this;
    }
    return DragStopEvent;
}(AbstractCursorEvent_1.AbstractCursorEvent));
exports.DragStopEvent = DragStopEvent;
