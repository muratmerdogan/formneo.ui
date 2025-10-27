"use strict";
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
exports.Helpers = void 0;
var react_1 = __importStar(require("react"));
var reactive_1 = require("@formily/reactive");
var hooks_1 = require("../../hooks");
var Selector_1 = require("./Selector");
var Copy_1 = require("./Copy");
var Delete_1 = require("./Delete");
var DragHandler_1 = require("./DragHandler");
var classnames_1 = __importDefault(require("classnames"));
var HELPER_DEBOUNCE_TIMEOUT = 100;
var Helpers = function (_a) {
    var _b;
    var node = _a.node, nodeRect = _a.nodeRect;
    var prefix = (0, hooks_1.usePrefix)('aux-helpers');
    var viewport = (0, hooks_1.useViewport)();
    var unmountRef = (0, react_1.useRef)(false);
    var ref = (0, react_1.useRef)();
    var _c = __read((0, react_1.useState)('top-right'), 2), position = _c[0], setPosition = _c[1];
    (0, react_1.useLayoutEffect)(function () {
        var request = null;
        var getYInViewport = function (nodeRect, helpersRect) {
            if (nodeRect.top - viewport.scrollY > helpersRect.height) {
                return 'top';
            }
            else if (viewport.isScrollTop &&
                nodeRect.height + helpersRect.height > viewport.height) {
                return 'inner-top';
            }
            else if (nodeRect.bottom >= viewport.scrollY + viewport.height &&
                nodeRect.height + helpersRect.height > viewport.height) {
                return 'inner-bottom';
            }
            return 'bottom';
        };
        var getXInViewport = function (nodeRect, helpersRect) {
            var widthDelta = helpersRect.width - nodeRect.width;
            if (widthDelta >= 0) {
                if (nodeRect.x < widthDelta) {
                    return 'left';
                }
                else if (nodeRect.right + widthDelta > viewport.width) {
                    return 'right';
                }
                else {
                    return 'center';
                }
            }
            return 'right';
        };
        var update = function () {
            var _a;
            var helpersRect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (!helpersRect || !nodeRect)
                return;
            if (unmountRef.current)
                return;
            setPosition(getYInViewport(nodeRect, helpersRect) +
                '-' +
                getXInViewport(nodeRect, helpersRect));
        };
        update();
        return (0, reactive_1.reaction)(function () { return [
            viewport.width,
            viewport.height,
            viewport.scrollX,
            viewport.scrollY,
            viewport.isScrollBottom,
            viewport.isScrollTop,
        ]; }, function () {
            clearTimeout(request);
            request = setTimeout(update, HELPER_DEBOUNCE_TIMEOUT);
        });
    }, [viewport, nodeRect]);
    if (!nodeRect || !node)
        return null;
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, (_b = {},
            _b[position] = true,
            _b)), ref: ref },
        react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix + '-content') },
            react_1.default.createElement(Selector_1.Selector, { node: node }),
            (node === null || node === void 0 ? void 0 : node.allowClone()) === false ? null : react_1.default.createElement(Copy_1.Copy, { node: node }),
            (node === null || node === void 0 ? void 0 : node.allowDrag()) === false ? null : react_1.default.createElement(DragHandler_1.DragHandler, { node: node }),
            (node === null || node === void 0 ? void 0 : node.allowDelete()) === false ? null : react_1.default.createElement(Delete_1.Delete, { node: node }))));
};
exports.Helpers = Helpers;
exports.Helpers.displayName = 'Helpers';
