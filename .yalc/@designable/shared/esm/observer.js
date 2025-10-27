var LayoutObserver = /** @class */ (function () {
    function LayoutObserver(observer) {
        if (observer === void 0) { observer = function () { }; }
        var _this = this;
        this.connected = false;
        this.observe = function (target) {
            _this.resizeObserver.observe(target);
            _this.performanceObserver.observe({
                entryTypes: ['paint', 'element', 'layout-shift', 'event'],
            });
            _this.mutationObserver.observe(target, {
                attributeFilter: ['style'],
                attributes: true,
            });
            _this.connected = true;
        };
        this.disconnect = function () {
            if (_this.connected) {
                _this.resizeObserver.disconnect();
                _this.performanceObserver.disconnect();
                _this.mutationObserver.disconnect();
            }
            _this.connected = false;
        };
        this.resizeObserver = new ResizeObserver(function () { return observer(); });
        this.performanceObserver = new PerformanceObserver(function () {
            observer();
        });
        this.mutationObserver = new MutationObserver(function () { return observer(); });
    }
    return LayoutObserver;
}());
export { LayoutObserver };
