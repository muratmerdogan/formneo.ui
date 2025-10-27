"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDropTemplate = void 0;
var core_1 = require("@designable/core");
var react_1 = require("@designable/react");
var shared_1 = require("../shared");
var useDropTemplate = function (name, getChildren) {
    return react_1.useDesigner(function (designer) {
        return designer.subscribeTo(core_1.AppendNodeEvent, function (event) {
            var _a = event.data, source = _a.source, target = _a.target;
            if (Array.isArray(target))
                return;
            if (!Array.isArray(source))
                return;
            if (shared_1.matchComponent(target, function (key) {
                return key === name &&
                    source.every(function (child) { return !shared_1.matchChildComponent(child, name); });
            }) &&
                target.children.length === 0) {
                target.setChildren.apply(target, __spread(getChildren(source)));
                return false;
            }
        });
    });
};
exports.useDropTemplate = useDropTemplate;
