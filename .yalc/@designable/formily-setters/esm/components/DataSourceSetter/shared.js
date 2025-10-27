var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { uid, clone, toArr } from '@formily/shared';
export var traverseTree = function (data, callback) {
    var _a, _b;
    for (var i = 0; i < data.length; i++) {
        callback(data[i], i, data);
        if ((_a = data[i]) === null || _a === void 0 ? void 0 : _a.children) {
            traverseTree((_b = data[i]) === null || _b === void 0 ? void 0 : _b.children, callback);
        }
    }
};
export var transformValueToData = function (value) {
    var data = clone(value);
    traverseTree(data, function (item, i, dataSource) {
        var e_1, _a;
        var dataItem = {
            key: '',
            duplicateKey: '',
            map: [],
            children: [],
        };
        try {
            for (var _b = __values(Object.entries(dataSource[i] || {})), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value_1 = _d[1];
                if (key !== 'children')
                    dataItem.map.push({ label: key, value: value_1 });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var uuid = uid();
        dataItem.key = uuid;
        dataItem.duplicateKey = uuid;
        dataItem.children = dataSource[i].children || [];
        dataSource[i] = dataItem;
    });
    return data;
};
export var transformDataToValue = function (data) {
    var value = clone(data);
    traverseTree(value, function (item, i, dataSource) {
        var _a;
        var valueItem = {
            children: [],
        };
        toArr(dataSource[i].map).forEach(function (item) {
            if (item.label)
                valueItem[item.label] = item.value;
        });
        valueItem.children = ((_a = dataSource[i]) === null || _a === void 0 ? void 0 : _a.children) || [];
        dataSource[i] = valueItem;
    });
    return value;
};
