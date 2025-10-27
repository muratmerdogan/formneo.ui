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
import { MouseClickEvent, MouseDoubleClickEvent } from '../events';
var MouseClickDriver = /** @class */ (function (_super) {
    __extends(MouseClickDriver, _super);
    function MouseClickDriver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseClick = function (e) {
            var target = e.target;
            if (target === null || target === void 0 ? void 0 : target.closest("*[".concat(_this.engine.props.clickStopPropagationAttrName, "]"))) {
                return;
            }
            _this.dispatch(new MouseClickEvent({
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.target,
                view: e.view,
            }));
        };
        _this.onMouseDoubleClick = function (e) {
            var target = e.target;
            if (target === null || target === void 0 ? void 0 : target.closest("*[".concat(_this.engine.props.clickStopPropagationAttrName, "]"))) {
                return;
            }
            _this.dispatch(new MouseDoubleClickEvent({
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.target,
                view: e.view,
            }));
        };
        return _this;
    }
    MouseClickDriver.prototype.attach = function () {
        this.addEventListener('click', this.onMouseClick, {
            mode: 'onlyChild',
        });
        this.addEventListener('dblclick', this.onMouseDoubleClick, {
            mode: 'onlyChild',
        });
    };
    MouseClickDriver.prototype.detach = function () {
        this.removeEventListener('click', this.onMouseClick, {
            mode: 'onlyChild',
        });
        this.removeEventListener('dblclick', this.onMouseDoubleClick, {
            mode: 'onlyChild',
        });
    };
    return MouseClickDriver;
}(EventDriver));
export { MouseClickDriver };
