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
exports.CompositePanel = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@designable/shared");
var classnames_1 = __importDefault(require("classnames"));
var widgets_1 = require("../widgets");
var hooks_1 = require("../hooks");
var parseItems = function (children) {
    var items = [];
    react_1.default.Children.forEach(children, function (child, index) {
        var _a;
        if ((child === null || child === void 0 ? void 0 : child['type']) === exports.CompositePanel.Item) {
            items.push(__assign({ key: (_a = child['key']) !== null && _a !== void 0 ? _a : index }, child['props']));
        }
    });
    return items;
};
var findItem = function (items, key) {
    for (var index = 0; index < items.length; index++) {
        var item = items[index];
        if (key === index)
            return item;
        if (key === item.key)
            return item;
    }
};
var getDefaultKey = function (children) {
    var items = parseItems(children);
    return items === null || items === void 0 ? void 0 : items[0].key;
};
var CompositePanel = function (props) {
    var _a;
    var _b, _c, _d;
    var prefix = (0, hooks_1.usePrefix)('composite-panel');
    var _e = __read((0, react_1.useState)((_b = props.defaultActiveKey) !== null && _b !== void 0 ? _b : getDefaultKey(props.children)), 2), activeKey = _e[0], setActiveKey = _e[1];
    var activeKeyRef = (0, react_1.useRef)(null);
    var _f = __read((0, react_1.useState)((_c = props.defaultPinning) !== null && _c !== void 0 ? _c : false), 2), pinning = _f[0], setPinning = _f[1];
    var _g = __read((0, react_1.useState)((_d = props.defaultOpen) !== null && _d !== void 0 ? _d : true), 2), visible = _g[0], setVisible = _g[1];
    var items = parseItems(props.children);
    var currentItem = findItem(items, activeKey);
    var content = currentItem === null || currentItem === void 0 ? void 0 : currentItem.children;
    activeKeyRef.current = activeKey;
    (0, react_1.useEffect)(function () {
        if ((0, shared_1.isValid)(props.activeKey)) {
            if (props.activeKey !== activeKeyRef.current) {
                setActiveKey(props.activeKey);
            }
        }
    }, [props.activeKey]);
    var renderContent = function () {
        if (!content || !visible)
            return;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix + '-tabs-content', {
                pinning: pinning,
            }) },
            react_1.default.createElement("div", { className: prefix + '-tabs-header' },
                react_1.default.createElement("div", { className: prefix + '-tabs-header-title' },
                    react_1.default.createElement(widgets_1.TextWidget, null, currentItem.title)),
                react_1.default.createElement("div", { className: prefix + '-tabs-header-actions' },
                    react_1.default.createElement("div", { className: prefix + '-tabs-header-extra' }, currentItem.extra),
                    !pinning && (react_1.default.createElement(widgets_1.IconWidget, { infer: "PushPinOutlined", className: prefix + '-tabs-header-pin', onClick: function () {
                            setPinning(!pinning);
                        } })),
                    pinning && (react_1.default.createElement(widgets_1.IconWidget, { infer: "PushPinFilled", className: prefix + '-tabs-header-pin-filled', onClick: function () {
                            setPinning(!pinning);
                        } })),
                    react_1.default.createElement(widgets_1.IconWidget, { infer: "Close", className: prefix + '-tabs-header-close', onClick: function () {
                            setVisible(false);
                        } }))),
            react_1.default.createElement("div", { className: prefix + '-tabs-body' }, content)));
    };
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, (_a = {},
            _a["direction-".concat(props.direction)] = !!props.direction,
            _a)) },
        react_1.default.createElement("div", { className: prefix + '-tabs' }, items.map(function (item, index) {
            var _a;
            var takeTab = function () {
                if (item.href) {
                    return react_1.default.createElement("a", { href: item.href }, item.icon);
                }
                return (react_1.default.createElement(widgets_1.IconWidget, { tooltip: props.showNavTitle
                        ? null
                        : {
                            title: react_1.default.createElement(widgets_1.TextWidget, null, item.title),
                            placement: props.direction === 'right' ? 'left' : 'right',
                        }, infer: item.icon }));
            };
            var shape = (_a = item.shape) !== null && _a !== void 0 ? _a : 'tab';
            var Comp = shape === 'link' ? 'a' : 'div';
            return (react_1.default.createElement(Comp, { className: (0, classnames_1.default)(prefix + '-tabs-pane', {
                    active: activeKey === item.key,
                }), key: index, href: item.href, onClick: function (e) {
                    var _a, _b;
                    if (shape === 'tab') {
                        if (activeKey === item.key) {
                            setVisible(!visible);
                        }
                        else {
                            setVisible(true);
                        }
                        if (!(props === null || props === void 0 ? void 0 : props.activeKey) || !(props === null || props === void 0 ? void 0 : props.onChange))
                            setActiveKey(item.key);
                    }
                    (_a = item.onClick) === null || _a === void 0 ? void 0 : _a.call(item, e);
                    (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, item.key);
                } },
                takeTab(),
                props.showNavTitle && item.title ? (react_1.default.createElement("div", { className: prefix + '-tabs-pane-title' },
                    react_1.default.createElement(widgets_1.TextWidget, null, item.title))) : null));
        })),
        renderContent()));
};
exports.CompositePanel = CompositePanel;
exports.CompositePanel.Item = function () {
    return react_1.default.createElement(react_1.default.Fragment, null);
};
