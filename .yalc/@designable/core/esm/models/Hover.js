import { observable, define, action } from '@formily/reactive';
import { HoverNodeEvent } from '../events';
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
            return this.operation.dispatch(new HoverNodeEvent({
                target: this.operation.tree,
                source: this.node,
            }));
        }
    };
    Hover.prototype.makeObservable = function () {
        define(this, {
            node: observable.ref,
            setHover: action,
            clear: action,
        });
    };
    return Hover;
}());
export { Hover };
