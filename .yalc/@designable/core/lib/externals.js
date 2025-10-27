"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDesigner = exports.createResource = exports.createBehavior = exports.createLocales = exports.isResource = exports.isResourceList = exports.isResourceHost = exports.isBehavior = exports.isBehaviorList = exports.isBehaviorHost = void 0;
var shared_1 = require("@designable/shared");
var reactive_1 = require("@formily/reactive");
var presets_1 = require("./presets");
var models_1 = require("./models");
var internals_1 = require("./internals");
var isBehaviorHost = function (val) {
    return (val === null || val === void 0 ? void 0 : val.Behavior) && (0, exports.isBehaviorList)(val.Behavior);
};
exports.isBehaviorHost = isBehaviorHost;
var isBehaviorList = function (val) {
    return Array.isArray(val) && val.every(exports.isBehavior);
};
exports.isBehaviorList = isBehaviorList;
var isBehavior = function (val) {
    return (val === null || val === void 0 ? void 0 : val.name) ||
        (val === null || val === void 0 ? void 0 : val.selector) ||
        (val === null || val === void 0 ? void 0 : val.extends) ||
        (val === null || val === void 0 ? void 0 : val.designerProps) ||
        (val === null || val === void 0 ? void 0 : val.designerLocales);
};
exports.isBehavior = isBehavior;
var isResourceHost = function (val) {
    return (val === null || val === void 0 ? void 0 : val.Resource) && (0, exports.isResourceList)(val.Resource);
};
exports.isResourceHost = isResourceHost;
var isResourceList = function (val) {
    return Array.isArray(val) && val.every(exports.isResource);
};
exports.isResourceList = isResourceList;
var isResource = function (val) {
    return (val === null || val === void 0 ? void 0 : val.node) && !!val.node.isSourceNode && val.node instanceof models_1.TreeNode;
};
exports.isResource = isResource;
var createLocales = function () {
    var packages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        packages[_i] = arguments[_i];
    }
    var results = {};
    packages.forEach(function (locales) {
        (0, internals_1.mergeLocales)(results, locales);
    });
    return results;
};
exports.createLocales = createLocales;
var createBehavior = function () {
    var behaviors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        behaviors[_i] = arguments[_i];
    }
    return behaviors.reduce(function (buf, behavior) {
        if ((0, shared_1.isArr)(behavior))
            return buf.concat(exports.createBehavior.apply(void 0, __spreadArray([], __read(behavior), false)));
        var selector = (behavior || {}).selector;
        if (!selector)
            return buf;
        if (typeof selector === 'string') {
            behavior.selector = function (node) { return node.componentName === selector; };
        }
        return buf.concat(behavior);
    }, []);
};
exports.createBehavior = createBehavior;
var createResource = function () {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    return sources.reduce(function (buf, source) {
        return buf.concat(__assign(__assign({}, source), { node: new models_1.TreeNode({
                componentName: '$$ResourceNode$$',
                isSourceNode: true,
                children: source.elements || [],
            }) }));
    }, []);
};
exports.createResource = createResource;
var createDesigner = function (props) {
    if (props === void 0) { props = {}; }
    var drivers = props.drivers || [];
    var effects = props.effects || [];
    var shortcuts = props.shortcuts || [];
    return (0, reactive_1.untracked)(function () {
        return new models_1.Engine(__assign(__assign({}, props), { effects: __spreadArray(__spreadArray([], __read(effects), false), __read(presets_1.DEFAULT_EFFECTS), false), drivers: __spreadArray(__spreadArray([], __read(drivers), false), __read(presets_1.DEFAULT_DRIVERS), false), shortcuts: __spreadArray(__spreadArray([], __read(shortcuts), false), __read(presets_1.DEFAULT_SHORTCUTS), false) }));
    });
};
exports.createDesigner = createDesigner;
