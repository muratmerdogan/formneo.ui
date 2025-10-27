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
exports.MouseDoubleClickEvent = exports.MouseClickEvent = void 0;
var AbstractCursorEvent_1 = require("./AbstractCursorEvent");
var MouseClickEvent = /** @class */ (function (_super) {
    __extends(MouseClickEvent, _super);
    function MouseClickEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'mouse:click';
        return _this;
    }
    return MouseClickEvent;
}(AbstractCursorEvent_1.AbstractCursorEvent));
exports.MouseClickEvent = MouseClickEvent;
var MouseDoubleClickEvent = /** @class */ (function (_super) {
    __extends(MouseDoubleClickEvent, _super);
    function MouseDoubleClickEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'mouse:dblclick';
        return _this;
    }
    return MouseDoubleClickEvent;
}(AbstractCursorEvent_1.AbstractCursorEvent));
exports.MouseDoubleClickEvent = MouseDoubleClickEvent;
