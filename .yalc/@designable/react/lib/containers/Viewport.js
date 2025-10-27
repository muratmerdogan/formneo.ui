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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewport = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../hooks");
var widgets_1 = require("../widgets");
var shared_1 = require("@designable/shared");
var classnames_1 = __importDefault(require("classnames"));
var Viewport = function (_a) {
    var placeholder = _a.placeholder, dragTipsDirection = _a.dragTipsDirection, props = __rest(_a, ["placeholder", "dragTipsDirection"]);
    var _b = __read((0, react_1.useState)(false), 2), loaded = _b[0], setLoaded = _b[1];
    var prefix = (0, hooks_1.usePrefix)('viewport');
    var viewport = (0, hooks_1.useViewport)();
    var ref = (0, react_1.useRef)();
    var viewportRef = (0, react_1.useRef)();
    var isFrameRef = (0, react_1.useRef)(false);
    (0, react_1.useLayoutEffect)(function () {
        var frameElement = ref.current.querySelector('iframe');
        if (!viewport)
            return;
        if (viewportRef.current && viewportRef.current !== viewport) {
            viewportRef.current.onUnmount();
        }
        if (frameElement) {
            frameElement.addEventListener('load', function () {
                viewport.onMount(frameElement, frameElement.contentWindow);
                (0, shared_1.requestIdle)(function () {
                    isFrameRef.current = true;
                    setLoaded(true);
                });
            });
        }
        else {
            viewport.onMount(ref.current, shared_1.globalThisPolyfill);
            (0, shared_1.requestIdle)(function () {
                isFrameRef.current = false;
                setLoaded(true);
            });
        }
        viewportRef.current = viewport;
        return function () {
            viewport.onUnmount();
        };
    }, [viewport]);
    return (react_1.default.createElement("div", __assign({}, props, { ref: ref, className: (0, classnames_1.default)(prefix, props.className), style: __assign({ opacity: !loaded ? 0 : 1, overflow: isFrameRef.current ? 'hidden' : 'overlay' }, props.style) }),
        props.children,
        react_1.default.createElement(widgets_1.AuxToolWidget, null),
        react_1.default.createElement(widgets_1.EmptyWidget, { dragTipsDirection: dragTipsDirection }, placeholder)));
};
exports.Viewport = Viewport;
