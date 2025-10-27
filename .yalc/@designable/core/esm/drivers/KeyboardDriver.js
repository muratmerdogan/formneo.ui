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
import { EventDriver } from '@designable/shared';
import { KeyDownEvent, KeyUpEvent } from '../events';
function filter(event) {
    var target = event.target;
    var tagName = target.tagName;
    var flag = true;
    // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>、Web Components
    if (target['isContentEditable'] ||
        ((tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT' ||
            customElements.get(tagName.toLocaleLowerCase())) &&
            !target.readOnly)) {
        flag = false;
    }
    return flag;
}
var KeyboardDriver = /** @class */ (function (_super) {
    __extends(KeyboardDriver, _super);
    function KeyboardDriver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onKeyDown = function (e) {
            if (!filter(e))
                return;
            _this.dispatch(new KeyDownEvent(e));
        };
        _this.onKeyUp = function (e) {
            _this.dispatch(new KeyUpEvent(e));
        };
        return _this;
    }
    KeyboardDriver.prototype.attach = function () {
        this.addEventListener('keydown', this.onKeyDown, {
            mode: 'onlyParent',
        });
        this.addEventListener('keyup', this.onKeyUp, {
            mode: 'onlyParent',
        });
    };
    KeyboardDriver.prototype.detach = function () {
        this.removeEventListener('keydown', this.onKeyDown, {
            mode: 'onlyParent',
        });
        this.removeEventListener('keyup', this.onKeyUp, {
            mode: 'onlyParent',
        });
    };
    return KeyboardDriver;
}(EventDriver));
export { KeyboardDriver };
