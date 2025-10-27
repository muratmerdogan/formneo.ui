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
exports.ResourceWidget = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var TextWidget_1 = require("../TextWidget");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.ResourceWidget = (0, reactive_react_1.observer)(function (props) {
    var prefix = (0, hooks_1.usePrefix)('resource');
    var _a = __read((0, react_1.useState)(props.defaultExpand), 2), expand = _a[0], setExpand = _a[1];
    var renderNode = function (source) {
        var _a;
        var node = source.node, icon = source.icon, title = source.title, thumb = source.thumb, span = source.span;
        return (react_1.default.createElement("div", { className: prefix + '-item', style: { gridColumnStart: "span ".concat(span || 1) }, key: node.id, "data-designer-source-id": node.id },
            thumb && react_1.default.createElement("img", { className: prefix + '-item-thumb', src: thumb }),
            icon && react_1.default.isValidElement(icon) ? (react_1.default.createElement(react_1.default.Fragment, null, icon)) : (react_1.default.createElement(IconWidget_1.IconWidget, { className: prefix + '-item-icon', infer: icon, style: { width: 150, height: 40 } })),
            react_1.default.createElement("span", { className: prefix + '-item-text' }, react_1.default.createElement(TextWidget_1.TextWidget, null, title || ((_a = node.children[0]) === null || _a === void 0 ? void 0 : _a.getMessage('title'))))));
    };
    var sources = props.sources.reduce(function (buf, source) {
        if ((0, core_1.isResourceList)(source)) {
            return buf.concat(source);
        }
        else if ((0, core_1.isResourceHost)(source)) {
            return buf.concat(source.Resource);
        }
        return buf;
    }, []);
    var remainItems = sources.reduce(function (length, source) {
        var _a;
        return length + ((_a = source.span) !== null && _a !== void 0 ? _a : 1);
    }, 0) % 3;
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className, {
            expand: expand,
        }) },
        react_1.default.createElement("div", { className: prefix + '-header', onClick: function (e) {
                e.stopPropagation();
                e.preventDefault();
                setExpand(!expand);
            } },
            react_1.default.createElement("div", { className: prefix + '-header-expand' },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Expand", size: 10 })),
            react_1.default.createElement("div", { className: prefix + '-header-content' },
                react_1.default.createElement(TextWidget_1.TextWidget, null, props.title))),
        react_1.default.createElement("div", { className: prefix + '-content-wrapper' },
            react_1.default.createElement("div", { className: prefix + '-content' },
                sources.map((0, shared_1.isFn)(props.children) ? props.children : renderNode),
                remainItems ? (react_1.default.createElement("div", { className: prefix + '-item-remain', style: { gridColumnStart: "span ".concat(3 - remainItems) } })) : null))));
});
exports.ResourceWidget.defaultProps = {
    defaultExpand: true,
};
