import { each, isPlainObj } from '@designable/shared';
import { globalThisPolyfill } from '@designable/shared';
export var lowerSnake = function (str) {
    return String(str).replace(/\s+/g, '_').toLocaleLowerCase();
};
export var mergeLocales = function (target, source) {
    if (isPlainObj(target) && isPlainObj(source)) {
        each(source, function (value, key) {
            var token = lowerSnake(key);
            var messages = mergeLocales(target[key] || target[token], value);
            target[token] = messages;
        });
        return target;
    }
    else if (isPlainObj(source)) {
        var result_1 = Array.isArray(source) ? [] : {};
        each(source, function (value, key) {
            var messages = mergeLocales(undefined, value);
            result_1[lowerSnake(key)] = messages;
        });
        return result_1;
    }
    return source;
};
export var getBrowserLanguage = function () {
    var _a;
    /* istanbul ignore next */
    if (!globalThisPolyfill.navigator) {
        return 'en';
    }
    return (globalThisPolyfill.navigator['browserlanguage'] ||
        ((_a = globalThisPolyfill.navigator) === null || _a === void 0 ? void 0 : _a.language) ||
        'en');
};
