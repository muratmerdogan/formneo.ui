import 'requestidlecallback';
import { globalThisPolyfill } from './globalThisPolyfill';
export var requestIdle = function (callback, options) {
    return globalThisPolyfill['requestIdleCallback'](callback, options);
};
export var cancelIdle = function (id) {
    globalThisPolyfill['cancelIdleCallback'](id);
};
