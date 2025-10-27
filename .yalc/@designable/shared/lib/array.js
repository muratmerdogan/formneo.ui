"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flat = exports.includesWith = exports.includes = exports.find = exports.findIndex = exports.some = exports.every = exports.reduce = exports.map = exports.each = exports.toArr = void 0;
var types_1 = require("./types");
var toArr = function (val) { return ((0, types_1.isArr)(val) ? val : val ? [val] : []); };
exports.toArr = toArr;
function each(val, iterator, revert) {
    if ((0, types_1.isArr)(val) || (0, types_1.isStr)(val)) {
        if (revert) {
            for (var i = val.length - 1; i >= 0; i--) {
                if (iterator(val[i], i) === false) {
                    return;
                }
            }
        }
        else {
            for (var i = 0; i < val.length; i++) {
                if (iterator(val[i], i) === false) {
                    return;
                }
            }
        }
    }
    else if ((0, types_1.isObj)(val)) {
        var key = void 0;
        for (key in val) {
            if (Object.hasOwnProperty.call(val, key)) {
                if (iterator(val[key], key) === false) {
                    return;
                }
            }
        }
    }
}
exports.each = each;
function map(val, iterator, revert) {
    var res = (0, types_1.isArr)(val) || (0, types_1.isStr)(val) ? [] : {};
    each(val, function (item, key) {
        var value = iterator(item, key);
        if ((0, types_1.isArr)(res)) {
            ;
            res.push(value);
        }
        else {
            res[key] = value;
        }
    }, revert);
    return res;
}
exports.map = map;
function reduce(val, iterator, accumulator, revert) {
    var result = accumulator;
    each(val, function (item, key) {
        result = iterator(result, item, key);
    }, revert);
    return result;
}
exports.reduce = reduce;
function every(val, iterator, revert) {
    var res = true;
    each(val, function (item, key) {
        if (!iterator(item, key)) {
            res = false;
            return false;
        }
    }, revert);
    return res;
}
exports.every = every;
function some(val, iterator, revert) {
    var res = false;
    each(val, function (item, key) {
        if (iterator(item, key)) {
            res = true;
            return false;
        }
    }, revert);
    return res;
}
exports.some = some;
function findIndex(val, iterator, revert) {
    var res = -1;
    each(val, function (item, key) {
        if (iterator(item, key)) {
            res = key;
            return false;
        }
    }, revert);
    return res;
}
exports.findIndex = findIndex;
function find(val, iterator, revert) {
    var res;
    each(val, function (item, key) {
        if (iterator(item, key)) {
            res = item;
            return false;
        }
    }, revert);
    return res;
}
exports.find = find;
function includes(val, searchElement, revert) {
    if ((0, types_1.isStr)(val))
        return val.includes(searchElement);
    return some(val, function (item) { return item === searchElement; }, revert);
}
exports.includes = includes;
function includesWith(val, search) {
    if ((0, types_1.isArr)(val)) {
        return val.some(function (item) { return search(item); });
    }
    else {
        return false;
    }
}
exports.includesWith = includesWith;
var flat = function (array) {
    return (0, exports.toArr)(array).reduce(function (buf, item) {
        if ((0, types_1.isArr)(item))
            return buf.concat((0, exports.flat)(item));
        return buf.concat(item);
    }, []);
};
exports.flat = flat;
