"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribable = void 0;
var types_1 = require("./types");
var UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');
var Subscribable = /** @class */ (function () {
    function Subscribable() {
        var _this = this;
        this.subscribers = {
            index: 0,
        };
        this.unsubscribe = function (id) {
            if (id === undefined || id === null) {
                for (var key in _this.subscribers) {
                    _this.unsubscribe(key);
                }
                return;
            }
            if (!(0, types_1.isFn)(id)) {
                delete _this.subscribers[id];
            }
            else {
                delete _this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]];
            }
        };
    }
    Subscribable.prototype.dispatch = function (event, context) {
        var interrupted = false;
        for (var key in this.subscribers) {
            if ((0, types_1.isFn)(this.subscribers[key])) {
                event['context'] = context;
                if (this.subscribers[key](event) === false) {
                    interrupted = true;
                }
            }
        }
        return interrupted ? false : true;
    };
    Subscribable.prototype.subscribe = function (subscriber) {
        var _this = this;
        var id;
        if ((0, types_1.isFn)(subscriber)) {
            id = this.subscribers.index + 1;
            this.subscribers[id] = subscriber;
            this.subscribers.index++;
        }
        var unsubscribe = function () {
            _this.unsubscribe(id);
        };
        unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id;
        return unsubscribe;
    };
    return Subscribable;
}());
exports.Subscribable = Subscribable;
