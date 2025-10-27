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
import { ViewportResizeEvent } from '../events';
import { ResizeObserver } from '@juggle/resize-observer';
import { globalThisPolyfill } from '@designable/shared';
var ViewportResizeDriver = /** @class */ (function (_super) {
    __extends(ViewportResizeDriver, _super);
    function ViewportResizeDriver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.request = null;
        _this.resizeObserver = null;
        _this.onResize = function (e) {
            if (e.preventDefault)
                e.preventDefault();
            _this.request = requestAnimationFrame(function () {
                cancelAnimationFrame(_this.request);
                _this.dispatch(new ViewportResizeEvent({
                    scrollX: _this.contentWindow.scrollX,
                    scrollY: _this.contentWindow.scrollY,
                    width: _this.contentWindow.innerWidth,
                    height: _this.contentWindow.innerHeight,
                    innerHeight: _this.contentWindow.innerHeight,
                    innerWidth: _this.contentWindow.innerWidth,
                    view: _this.contentWindow,
                    target: e.target || _this.container,
                }));
            });
        };
        return _this;
    }
    ViewportResizeDriver.prototype.attach = function () {
        if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
            this.addEventListener('resize', this.onResize);
        }
        else {
            if (this.container && this.container !== document) {
                this.resizeObserver = new ResizeObserver(this.onResize);
                this.resizeObserver.observe(this.container);
            }
        }
    };
    ViewportResizeDriver.prototype.detach = function () {
        if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
            this.removeEventListener('resize', this.onResize);
        }
        else if (this.resizeObserver) {
            if (this.container && this.container !== document) {
                this.resizeObserver.unobserve(this.container);
                this.resizeObserver.disconnect();
            }
        }
    };
    return ViewportResizeDriver;
}(EventDriver));
export { ViewportResizeDriver };
