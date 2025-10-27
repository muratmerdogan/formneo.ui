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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@designable/shared");
var context_1 = require("../context");
var classnames_1 = __importDefault(require("classnames"));
var Layout = function (props) {
    var _a;
    var layout = (0, react_1.useContext)(context_1.DesignerLayoutContext);
    var ref = (0, react_1.useRef)();
    (0, react_1.useLayoutEffect)(function () {
        if (ref.current) {
            (0, shared_1.each)(props.variables, function (value, key) {
                ref.current.style.setProperty("--".concat(key), value);
            });
        }
    }, []);
    if (layout) {
        return react_1.default.createElement(react_1.Fragment, null, props.children);
    }
    return (react_1.default.createElement("div", { ref: ref, className: (0, classnames_1.default)((_a = {},
            _a["".concat(props.prefixCls, "app")] = true,
            _a["".concat(props.prefixCls).concat(props.theme)] = props.theme,
            _a)) },
        react_1.default.createElement(context_1.DesignerLayoutContext.Provider, { value: {
                theme: props.theme,
                prefixCls: props.prefixCls,
                position: props.position,
            } }, props.children)));
};
exports.Layout = Layout;
exports.Layout.defaultProps = {
    theme: 'light',
    prefixCls: 'dn-',
    position: 'fixed',
};
