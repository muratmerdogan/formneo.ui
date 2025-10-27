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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsiveSimulator = void 0;
var react_1 = __importStar(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var hooks_1 = require("../../hooks");
var widgets_1 = require("../../widgets");
var handle_1 = require("./handle");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var useResizeEffect = function (container, content, engine) {
    var status = null;
    var startX = 0;
    var startY = 0;
    var startWidth = 0;
    var startHeight = 0;
    var animationX = null;
    var animationY = null;
    var getStyle = function (status) {
        if (status === handle_1.ResizeHandleType.Resize)
            return 'nwse-resize';
        if (status === handle_1.ResizeHandleType.ResizeHeight)
            return 'ns-resize';
        if (status === handle_1.ResizeHandleType.ResizeWidth)
            return 'ew-resize';
    };
    var updateSize = function (deltaX, deltaY) {
        var _a;
        var containerRect = (_a = container.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (status === handle_1.ResizeHandleType.Resize) {
            engine.screen.setSize(startWidth + deltaX, startHeight + deltaY);
            container.current.scrollBy(containerRect.width + deltaX, containerRect.height + deltaY);
        }
        else if (status === handle_1.ResizeHandleType.ResizeHeight) {
            engine.screen.setSize(startWidth, startHeight + deltaY);
            container.current.scrollBy(container.current.scrollLeft, containerRect.height + deltaY);
        }
        else if (status === handle_1.ResizeHandleType.ResizeWidth) {
            engine.screen.setSize(startWidth + deltaX, startHeight);
            container.current.scrollBy(containerRect.width + deltaX, container.current.scrollTop);
        }
    };
    engine.subscribeTo(core_1.DragStartEvent, function (e) {
        var _a, _b;
        if (!((_a = engine.workbench.currentWorkspace) === null || _a === void 0 ? void 0 : _a.viewport))
            return;
        var target = e.data.target;
        if (target === null || target === void 0 ? void 0 : target.closest("*[".concat(engine.props.screenResizeHandlerAttrName, "]"))) {
            var rect = (_b = content.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
            if (!rect)
                return;
            status = target.getAttribute(engine.props.screenResizeHandlerAttrName);
            engine.cursor.setStyle(getStyle(status));
            startX = e.data.topClientX;
            startY = e.data.topClientY;
            startWidth = rect.width;
            startHeight = rect.height;
            engine.cursor.setDragType(core_1.CursorDragType.Resize);
        }
    });
    engine.subscribeTo(core_1.DragMoveEvent, function (e) {
        var _a, _b;
        if (!((_a = engine.workbench.currentWorkspace) === null || _a === void 0 ? void 0 : _a.viewport))
            return;
        if (!status)
            return;
        var deltaX = e.data.topClientX - startX;
        var deltaY = e.data.topClientY - startY;
        var containerRect = (_b = container.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        var distanceX = Math.floor(containerRect.right - e.data.topClientX);
        var distanceY = Math.floor(containerRect.bottom - e.data.topClientY);
        var factorX = (0, shared_1.calcSpeedFactor)(distanceX, 10);
        var factorY = (0, shared_1.calcSpeedFactor)(distanceY, 10);
        updateSize(deltaX, deltaY);
        if (distanceX <= 10) {
            if (!animationX) {
                animationX = (0, shared_1.createUniformSpeedAnimation)(1000 * factorX, function (delta) {
                    updateSize(deltaX + delta, deltaY);
                });
            }
        }
        else {
            if (animationX) {
                animationX = animationX();
            }
        }
        if (distanceY <= 10) {
            if (!animationY) {
                animationY = (0, shared_1.createUniformSpeedAnimation)(300 * factorY, function (delta) {
                    updateSize(deltaX, deltaY + delta);
                });
            }
        }
        else {
            if (animationY) {
                animationY = animationY();
            }
        }
    });
    engine.subscribeTo(core_1.DragStopEvent, function () {
        if (!status)
            return;
        status = null;
        engine.cursor.setStyle('');
        engine.cursor.setDragType(core_1.CursorDragType.Move);
        if (animationX) {
            animationX = animationX();
        }
        if (animationY) {
            animationY = animationY();
        }
    });
};
exports.ResponsiveSimulator = (0, reactive_react_1.observer)(function (props) {
    var container = (0, react_1.useRef)();
    var content = (0, react_1.useRef)();
    var prefix = (0, hooks_1.usePrefix)('responsive-simulator');
    var screen = (0, hooks_1.useScreen)();
    (0, hooks_1.useDesigner)(function (engine) {
        useResizeEffect(container, content, engine);
    });
    return (react_1.default.createElement("div", __assign({}, props, { className: (0, classnames_1.default)(prefix, props.className), style: __assign({ height: '100%', width: '100%', minHeight: 100, position: 'relative' }, props.style) }),
        react_1.default.createElement("div", { ref: container, style: {
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                overflow: 'overlay',
            } },
            react_1.default.createElement("div", { ref: content, style: {
                    width: screen.width,
                    height: screen.height,
                    paddingRight: 15,
                    paddingBottom: 15,
                    position: 'relative',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                } },
                props.children,
                react_1.default.createElement(handle_1.ResizeHandle, { type: handle_1.ResizeHandleType.Resize },
                    react_1.default.createElement(widgets_1.IconWidget, { infer: "DragMove", style: { pointerEvents: 'none' } })),
                react_1.default.createElement(handle_1.ResizeHandle, { type: handle_1.ResizeHandleType.ResizeHeight },
                    react_1.default.createElement(widgets_1.IconWidget, { infer: "Menu", style: { pointerEvents: 'none' } })),
                react_1.default.createElement(handle_1.ResizeHandle, { type: handle_1.ResizeHandleType.ResizeWidth },
                    react_1.default.createElement(widgets_1.IconWidget, { infer: "Menu", style: { pointerEvents: 'none' } }))))));
});
