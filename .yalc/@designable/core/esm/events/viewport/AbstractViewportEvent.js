import { globalThisPolyfill } from '@designable/shared';
var AbstractViewportEvent = /** @class */ (function () {
    function AbstractViewportEvent(data) {
        this.data = data || {
            scrollX: globalThisPolyfill.scrollX,
            scrollY: globalThisPolyfill.scrollY,
            width: globalThisPolyfill.innerWidth,
            height: globalThisPolyfill.innerHeight,
            innerWidth: globalThisPolyfill.innerWidth,
            innerHeight: globalThisPolyfill.innerHeight,
            view: globalThisPolyfill,
            target: globalThisPolyfill,
        };
    }
    return AbstractViewportEvent;
}());
export { AbstractViewportEvent };
