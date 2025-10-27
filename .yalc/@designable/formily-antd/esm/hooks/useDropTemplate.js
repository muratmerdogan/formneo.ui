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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { AppendNodeEvent } from '@designable/core';
import { useDesigner } from '@designable/react';
import { matchComponent, matchChildComponent } from '../shared';
export var useDropTemplate = function (name, getChildren) {
    return useDesigner(function (designer) {
        return designer.subscribeTo(AppendNodeEvent, function (event) {
            var _a = event.data, source = _a.source, target = _a.target;
            if (Array.isArray(target))
                return;
            if (!Array.isArray(source))
                return;
            if (matchComponent(target, function (key) {
                return key === name &&
                    source.every(function (child) { return !matchChildComponent(child, name); });
            }) &&
                target.children.length === 0) {
                target.setChildren.apply(target, __spread(getChildren(source)));
                return false;
            }
        });
    });
};
