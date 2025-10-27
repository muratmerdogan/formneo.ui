"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hover = void 0;
var reactive_1 = require("@formily/reactive");
var events_1 = require("../events");
var Hover = /** @class */ (function () {
    function Hover(props) {
        this.node = null;
        this.operation = props === null || props === void 0 ? void 0 : props.operation;
        this.makeObservable();
    }
    Hover.prototype.setHover = function (node) {
        if (node) {
            this.node = node;
        }
        else {
            this.node = null;
        }
        this.trigger();
    };
    Hover.prototype.clear = function () {
        this.node = null;
    };
    Hover.prototype.trigger = function () {
        if (this.operation) {
            return this.operation.dispatch(new events_1.HoverNodeEvent({
                target: this.operation.tree,
                source: this.node,
            }));
        }
    };
    Hover.prototype.makeObservable = function () {
        (0, reactive_1.define)(this, {
            node: reactive_1.observable.ref,
            setHover: reactive_1.action,
            clear: reactive_1.action,
        });
    };
    return Hover;
}());
exports.Hover = Hover;
