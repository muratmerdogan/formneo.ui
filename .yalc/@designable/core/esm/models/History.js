import { define, observable, action } from '@formily/reactive';
var History = /** @class */ (function () {
    function History(context, props) {
        this.current = 0;
        this.history = [];
        this.updateTimer = null;
        this.maxSize = 100;
        this.locking = false;
        this.context = context;
        this.props = props;
        this.push();
        this.makeObservable();
    }
    History.prototype.makeObservable = function () {
        define(this, {
            current: observable.ref,
            history: observable.shallow,
            push: action,
            undo: action,
            redo: action,
            goTo: action,
            clear: action,
        });
    };
    History.prototype.list = function () {
        return this.history;
    };
    History.prototype.push = function (type) {
        var _a;
        if (this.locking)
            return;
        if (this.current < this.history.length - 1) {
            this.history = this.history.slice(0, this.current + 1);
        }
        var item = {
            data: this.context.serialize(),
            timestamp: Date.now(),
            type: type,
        };
        this.current = this.history.length;
        this.history.push(item);
        var overSizeCount = this.history.length - this.maxSize;
        if (overSizeCount > 0) {
            this.history.splice(0, overSizeCount);
            this.current = this.history.length - 1;
        }
        if ((_a = this.props) === null || _a === void 0 ? void 0 : _a.onPush) {
            this.props.onPush(item);
        }
    };
    Object.defineProperty(History.prototype, "allowUndo", {
        get: function () {
            return this.history.length > 0 && this.current - 1 >= 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(History.prototype, "allowRedo", {
        get: function () {
            return this.history.length > this.current + 1;
        },
        enumerable: false,
        configurable: true
    });
    History.prototype.redo = function () {
        var _a;
        if (this.allowRedo) {
            var item = this.history[this.current + 1];
            this.locking = true;
            this.context.from(item.data);
            this.locking = false;
            this.current++;
            if ((_a = this.props) === null || _a === void 0 ? void 0 : _a.onRedo) {
                this.props.onRedo(item);
            }
        }
    };
    History.prototype.undo = function () {
        var _a;
        if (this.allowUndo) {
            var item = this.history[this.current - 1];
            this.locking = true;
            this.context.from(item.data);
            this.locking = false;
            this.current--;
            if ((_a = this.props) === null || _a === void 0 ? void 0 : _a.onUndo) {
                this.props.onUndo(item);
            }
        }
    };
    History.prototype.goTo = function (index) {
        var _a;
        var item = this.history[index];
        if (item) {
            this.locking = true;
            this.context.from(item.data);
            this.locking = false;
            this.current = index;
            if ((_a = this.props) === null || _a === void 0 ? void 0 : _a.onGoto) {
                this.props.onGoto(item);
            }
        }
    };
    History.prototype.clear = function () {
        this.history = [];
        this.current = 0;
    };
    return History;
}());
export { History };
