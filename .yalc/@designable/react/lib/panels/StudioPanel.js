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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioPanel = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../hooks");
var containers_1 = require("../containers");
var classnames_1 = __importDefault(require("classnames"));
var StudioPanelInternal = function (_a) {
    var logo = _a.logo, actions = _a.actions, props = __rest(_a, ["logo", "actions"]);
    var prefix = (0, hooks_1.usePrefix)('main-panel');
    var position = (0, hooks_1.usePosition)();
    var classNameBase = (0, classnames_1.default)('root', position, props.className);
    if (logo || actions) {
        return (react_1.default.createElement("div", __assign({}, props, { className: (0, classnames_1.default)("".concat(prefix, "-container"), classNameBase) }),
            react_1.default.createElement("div", { className: prefix + '-header' },
                react_1.default.createElement("div", { className: prefix + '-header-logo' }, logo),
                react_1.default.createElement("div", { className: prefix + '-header-actions' }, actions)),
            react_1.default.createElement("div", { className: prefix }, props.children)));
    }
    return (react_1.default.createElement("div", __assign({}, props, { className: (0, classnames_1.default)(prefix, classNameBase) }), props.children));
};
var StudioPanel = function (props) {
    return (react_1.default.createElement(containers_1.Layout, { theme: props.theme, prefixCls: props.prefixCls, position: props.position },
        react_1.default.createElement(StudioPanelInternal, __assign({}, props))));
};
exports.StudioPanel = StudioPanel;
