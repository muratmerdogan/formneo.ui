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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Designer = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@designable/core");
var context_1 = require("../context");
var widgets_1 = require("../widgets");
var hooks_1 = require("../hooks");
var Layout_1 = require("./Layout");
var icons = __importStar(require("../icons"));
core_1.GlobalRegistry.registerDesignerIcons(icons);
var Designer = function (props) {
    var engine = (0, hooks_1.useDesigner)();
    var ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        if (props.engine) {
            if (props.engine && ref.current) {
                if (props.engine !== ref.current) {
                    ref.current.unmount();
                }
            }
            props.engine.mount();
            ref.current = props.engine;
        }
        return function () {
            if (props.engine) {
                props.engine.unmount();
            }
        };
    }, [props.engine]);
    if (engine)
        throw new Error('There can only be one Designable Engine Context in the React Tree');
    return (react_1.default.createElement(Layout_1.Layout, __assign({}, props),
        react_1.default.createElement(context_1.DesignerEngineContext.Provider, { value: props.engine },
            props.children,
            react_1.default.createElement(widgets_1.GhostWidget, null))));
};
exports.Designer = Designer;
exports.Designer.defaultProps = {
    prefixCls: 'dn-',
    theme: 'light',
};
