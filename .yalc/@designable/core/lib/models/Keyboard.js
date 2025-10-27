"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
var reactive_1 = require("@formily/reactive");
var shared_1 = require("@designable/shared");
var Shortcut_1 = require("./Shortcut");
var Modifiers = [
    ['metaKey', shared_1.KeyCode.Meta],
    ['shiftKey', shared_1.KeyCode.Shift],
    ['ctrlKey', shared_1.KeyCode.Control],
    ['altKey', shared_1.KeyCode.Alt],
];
var Keyboard = /** @class */ (function () {
    function Keyboard(engine) {
        var _a;
        this.shortcuts = [];
        this.sequence = [];
        this.keyDown = null;
        this.modifiers = {};
        this.requestTimer = null;
        this.engine = engine;
        this.shortcuts = ((_a = engine.props) === null || _a === void 0 ? void 0 : _a.shortcuts) || [];
        this.makeObservable();
    }
    Keyboard.prototype.matchCodes = function (context) {
        for (var i = 0; i < this.shortcuts.length; i++) {
            var shortcut = this.shortcuts[i];
            if (shortcut.match(this.sequence, context)) {
                return true;
            }
        }
        return false;
    };
    Keyboard.prototype.preventCodes = function () {
        var _this = this;
        return this.shortcuts.some(function (shortcut) {
            return shortcut.preventCodes(_this.sequence);
        });
    };
    Keyboard.prototype.includes = function (key) {
        return this.sequence.some(function (code) { return Shortcut_1.Shortcut.matchCode(code, key); });
    };
    Keyboard.prototype.excludes = function (key) {
        this.sequence = this.sequence.filter(function (code) { return !Shortcut_1.Shortcut.matchCode(key, code); });
    };
    Keyboard.prototype.addKeyCode = function (key) {
        if (!this.includes(key)) {
            this.sequence.push(key);
        }
    };
    Keyboard.prototype.removeKeyCode = function (key) {
        if (this.includes(key)) {
            this.excludes(key);
        }
    };
    Keyboard.prototype.isModifier = function (code) {
        return Modifiers.some(function (modifier) { return Shortcut_1.Shortcut.matchCode(modifier[1], code); });
    };
    Keyboard.prototype.handleModifiers = function (event) {
        var _this = this;
        Modifiers.forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], code = _b[1];
            if (event[key]) {
                if (!_this.includes(code)) {
                    _this.sequence = [code].concat(_this.sequence);
                }
            }
        });
    };
    Keyboard.prototype.handleKeyboard = function (event, context) {
        if (event.eventType === 'keydown') {
            this.keyDown = event.data;
            this.addKeyCode(this.keyDown);
            this.handleModifiers(event);
            if (this.matchCodes(context)) {
                this.sequence = [];
            }
            this.requestClean(4000);
            if (this.preventCodes()) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
        else {
            if (this.isModifier(event.data)) {
                this.sequence = [];
            }
            this.keyDown = null;
        }
    };
    Keyboard.prototype.isKeyDown = function (code) {
        return this.keyDown === code;
    };
    Keyboard.prototype.requestClean = function (duration) {
        var _this = this;
        if (duration === void 0) { duration = 320; }
        clearTimeout(this.requestTimer);
        this.requestTimer = setTimeout(function () {
            _this.keyDown = null;
            _this.sequence = [];
            clearTimeout(_this.requestTimer);
        }, duration);
    };
    Keyboard.prototype.makeObservable = function () {
        (0, reactive_1.define)(this, {
            sequence: reactive_1.observable.shallow,
            keyDown: reactive_1.observable.ref,
            handleKeyboard: reactive_1.action,
        });
    };
    return Keyboard;
}());
exports.Keyboard = Keyboard;
