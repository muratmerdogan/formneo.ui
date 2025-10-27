"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractKeyboardEvent = void 0;
var shared_1 = require("@designable/shared");
var AbstractKeyboardEvent = /** @class */ (function () {
    function AbstractKeyboardEvent(e) {
        this.data = (0, shared_1.getKeyCodeFromEvent)(e);
        this.originEvent = e;
    }
    Object.defineProperty(AbstractKeyboardEvent.prototype, "eventType", {
        get: function () {
            return this.originEvent.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractKeyboardEvent.prototype, "ctrlKey", {
        get: function () {
            return this.originEvent.ctrlKey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractKeyboardEvent.prototype, "shiftKey", {
        get: function () {
            return this.originEvent.shiftKey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractKeyboardEvent.prototype, "metaKey", {
        get: function () {
            return this.originEvent.metaKey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractKeyboardEvent.prototype, "altkey", {
        get: function () {
            return this.originEvent.altKey;
        },
        enumerable: false,
        configurable: true
    });
    AbstractKeyboardEvent.prototype.preventDefault = function () {
        if (this.originEvent.preventDefault) {
            this.originEvent.preventDefault();
        }
        else {
            this.originEvent.returnValue = false;
        }
    };
    AbstractKeyboardEvent.prototype.stopPropagation = function () {
        var _a;
        if ((_a = this.originEvent) === null || _a === void 0 ? void 0 : _a.stopPropagation) {
            this.originEvent.stopPropagation();
        }
        else {
            this.originEvent.cancelBubble = true;
        }
    };
    return AbstractKeyboardEvent;
}());
exports.AbstractKeyboardEvent = AbstractKeyboardEvent;
