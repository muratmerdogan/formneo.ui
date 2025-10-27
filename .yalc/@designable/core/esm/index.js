var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
import * as Core from './exports';
export * from './exports';
import { globalThisPolyfill } from '@designable/shared';
if ((_a = globalThisPolyfill === null || globalThisPolyfill === void 0 ? void 0 : globalThisPolyfill['Designable']) === null || _a === void 0 ? void 0 : _a['Core']) {
    if (module.exports) {
        module.exports = __assign({ __esModule: true }, globalThisPolyfill['Designable']['Core']);
    }
}
else {
    globalThisPolyfill['Designable'] = globalThisPolyfill['Designable'] || {};
    globalThisPolyfill['Designable'].Core = Core;
}
