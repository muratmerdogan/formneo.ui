import { GlobalRegistry } from '@designable/core';
import { globalThisPolyfill } from '@designable/shared';
export var useRegistry = function () {
    return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry;
};
