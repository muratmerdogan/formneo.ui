import { action, define, observable } from '@formily/reactive';
export var ScreenType;
(function (ScreenType) {
    ScreenType["PC"] = "PC";
    ScreenType["Responsive"] = "Responsive";
    ScreenType["Mobile"] = "Mobile";
    ScreenType["Sketch"] = "Sketch";
})(ScreenType || (ScreenType = {}));
export var ScreenStatus;
(function (ScreenStatus) {
    ScreenStatus["Normal"] = "Normal";
    ScreenStatus["Resizing"] = "Resizing";
    ScreenStatus["Zooming"] = "Zooming";
})(ScreenStatus || (ScreenStatus = {}));
var Screen = /** @class */ (function () {
    function Screen(engine) {
        this.scale = 1;
        this.width = '100%';
        this.height = '100%';
        this.background = '';
        this.flip = false;
        this.status = ScreenStatus.Normal;
        this.engine = engine;
        this.type = engine.props.defaultScreenType;
        this.makeObservable();
    }
    Screen.prototype.makeObservable = function () {
        define(this, {
            type: observable.ref,
            scale: observable.ref,
            width: observable.ref,
            height: observable.ref,
            status: observable.ref,
            flip: observable.ref,
            background: observable.ref,
            setType: action,
            setScale: action,
            setSize: action,
            resetSize: action,
            setBackground: action,
            setFlip: action,
        });
    };
    Screen.prototype.setStatus = function (status) {
        this.status = status;
    };
    Screen.prototype.setType = function (type) {
        this.type = type;
    };
    Screen.prototype.setScale = function (scale) {
        this.scale = scale;
    };
    Screen.prototype.setSize = function (width, height) {
        if (width) {
            this.width = width;
        }
        if (height) {
            this.height = height;
        }
    };
    Screen.prototype.resetSize = function () {
        this.width = '100%';
        this.height = '100%';
    };
    Screen.prototype.setBackground = function (background) {
        this.background = background;
    };
    Screen.prototype.setFlip = function (flip) {
        this.flip = flip;
    };
    return Screen;
}());
export { Screen };
