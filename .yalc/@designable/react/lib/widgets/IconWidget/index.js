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
exports.IconWidget = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@designable/shared");
var reactive_react_1 = require("@formily/reactive-react");
var antd_1 = require("antd");
var hooks_1 = require("../../hooks");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var IconContext = (0, react_1.createContext)(null);
var isNumSize = function (val) { return /^[\d.]+$/.test(val); };
exports.IconWidget = (0, reactive_react_1.observer)(function (props) {
    var _a, _b, _c;
    var theme = (0, hooks_1.useTheme)();
    var context = (0, react_1.useContext)(IconContext);
    var registry = (0, hooks_1.useRegistry)();
    var prefix = (0, hooks_1.usePrefix)('icon');
    var size = props.size || '1em';
    var height = ((_a = props.style) === null || _a === void 0 ? void 0 : _a.height) || size;
    var width = ((_b = props.style) === null || _b === void 0 ? void 0 : _b.width) || size;
    var takeIcon = function (infer) {
        if ((0, shared_1.isStr)(infer)) {
            var finded = registry.getDesignerIcon(infer);
            if (finded) {
                return takeIcon(finded);
            }
            return react_1.default.createElement("img", { src: infer, height: height, width: width });
        }
        else if ((0, shared_1.isFn)(infer)) {
            return react_1.default.createElement(infer, {
                height: height,
                width: width,
                fill: 'currentColor',
            });
        }
        else if (react_1.default.isValidElement(infer)) {
            if (infer.type === 'svg') {
                return react_1.default.cloneElement(infer, {
                    height: height,
                    width: width,
                    fill: 'currentColor',
                    viewBox: infer.props.viewBox || '0 0 1024 1024',
                    focusable: 'false',
                    'aria-hidden': 'true',
                });
            }
            else if (infer.type === 'path' || infer.type === 'g') {
                return (react_1.default.createElement("svg", { viewBox: "0 0 1024 1024", height: height, width: width, fill: "currentColor", focusable: "false", "aria-hidden": "true" }, infer));
            }
            return infer;
        }
        else if ((0, shared_1.isPlainObj)(infer)) {
            if (infer[theme]) {
                return takeIcon(infer[theme]);
            }
            else if (infer['shadow']) {
                return (react_1.default.createElement(exports.IconWidget.ShadowSVG, { width: width, height: height, content: infer['shadow'] }));
            }
            return null;
        }
    };
    var renderTooltips = function (children) {
        if (!(0, shared_1.isStr)(props.infer) && (context === null || context === void 0 ? void 0 : context.tooltip))
            return children;
        var tooltip = props.tooltip || registry.getDesignerMessage("icons.".concat(props.infer));
        if (tooltip) {
            var title = react_1.default.isValidElement(tooltip) || (0, shared_1.isStr)(tooltip)
                ? tooltip
                : tooltip.title;
            var props_1 = react_1.default.isValidElement(tooltip) || (0, shared_1.isStr)(tooltip)
                ? {}
                : (0, shared_1.isObj)(tooltip)
                    ? tooltip
                    : {};
            return (react_1.default.createElement(antd_1.Tooltip, __assign({}, props_1, { title: title }), children));
        }
        return children;
    };
    if (!props.infer)
        return null;
    return renderTooltips(react_1.default.createElement("span", __assign({}, props, { className: (0, classnames_1.default)(prefix, props.className), style: __assign(__assign({}, props.style), { cursor: props.onClick ? 'pointer' : (_c = props.style) === null || _c === void 0 ? void 0 : _c.cursor }) }), takeIcon(props.infer)));
});
exports.IconWidget.ShadowSVG = function (props) {
    var ref = (0, react_1.useRef)();
    var width = isNumSize(props.width) ? "".concat(props.width, "px") : props.width;
    var height = isNumSize(props.height) ? "".concat(props.height, "px") : props.height;
    (0, react_1.useEffect)(function () {
        if (ref.current) {
            var root = ref.current.attachShadow({
                mode: 'open',
            });
            root.innerHTML = "<svg viewBox=\"0 0 1024 1024\" style=\"width:".concat(width, ";height:").concat(height, "\">").concat(props.content, "</svg>");
        }
    }, []);
    return react_1.default.createElement("div", { ref: ref });
};
exports.IconWidget.Provider = function (props) {
    return (react_1.default.createElement(IconContext.Provider, { value: props }, props.children));
};
