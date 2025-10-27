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
import React, { useLayoutEffect, useRef, useState } from 'react';
import { usePrefix, useViewport } from '../hooks';
import { AuxToolWidget, EmptyWidget } from '../widgets';
import { requestIdle, globalThisPolyfill } from '@designable/shared';
import cls from 'classnames';
export var Viewport = function (_a) {
    var placeholder = _a.placeholder, dragTipsDirection = _a.dragTipsDirection, props = __rest(_a, ["placeholder", "dragTipsDirection"]);
    var _b = __read(useState(false), 2), loaded = _b[0], setLoaded = _b[1];
    var prefix = usePrefix('viewport');
    var viewport = useViewport();
    var ref = useRef();
    var viewportRef = useRef();
    var isFrameRef = useRef(false);
    useLayoutEffect(function () {
        var frameElement = ref.current.querySelector('iframe');
        if (!viewport)
            return;
        if (viewportRef.current && viewportRef.current !== viewport) {
            viewportRef.current.onUnmount();
        }
        if (frameElement) {
            frameElement.addEventListener('load', function () {
                viewport.onMount(frameElement, frameElement.contentWindow);
                requestIdle(function () {
                    isFrameRef.current = true;
                    setLoaded(true);
                });
            });
        }
        else {
            viewport.onMount(ref.current, globalThisPolyfill);
            requestIdle(function () {
                isFrameRef.current = false;
                setLoaded(true);
            });
        }
        viewportRef.current = viewport;
        return function () {
            viewport.onUnmount();
        };
    }, [viewport]);
    return (React.createElement("div", __assign({}, props, { ref: ref, className: cls(prefix, props.className), style: __assign({ opacity: !loaded ? 0 : 1, overflow: isFrameRef.current ? 'hidden' : 'overlay' }, props.style) }),
        props.children,
        React.createElement(AuxToolWidget, null),
        React.createElement(EmptyWidget, { dragTipsDirection: dragTipsDirection }, placeholder)));
};
