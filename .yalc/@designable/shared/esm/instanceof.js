import { isStr, isFn } from './types';
import { globalThisPolyfill } from './globalThisPolyfill';
export var instOf = function (value, cls) {
    if (isFn(cls))
        return value instanceof cls;
    if (isStr(cls))
        return globalThisPolyfill[cls]
            ? value instanceof globalThisPolyfill[cls]
            : false;
    return false;
};
