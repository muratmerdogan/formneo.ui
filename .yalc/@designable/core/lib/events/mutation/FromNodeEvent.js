"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromNodeEvent = void 0;
var FromNodeEvent = /** @class */ (function () {
    function FromNodeEvent(data) {
        this.type = 'from:node';
        this.data = data;
    }
    return FromNodeEvent;
}());
exports.FromNodeEvent = FromNodeEvent;
