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
import React, { useEffect, useRef, useState } from 'react';
import { isValid } from '@designable/shared';
import cls from 'classnames';
import { IconWidget, TextWidget } from '../widgets';
import { usePrefix } from '../hooks';
var parseItems = function (children) {
    var items = [];
    React.Children.forEach(children, function (child, index) {
        var _a;
        if ((child === null || child === void 0 ? void 0 : child['type']) === CompositePanel.Item) {
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
export var CompositePanel = function (props) {
    var _a;
    var _b, _c, _d;
    var prefix = usePrefix('composite-panel');
    var _e = __read(useState((_b = props.defaultActiveKey) !== null && _b !== void 0 ? _b : getDefaultKey(props.children)), 2), activeKey = _e[0], setActiveKey = _e[1];
    var activeKeyRef = useRef(null);
    var _f = __read(useState((_c = props.defaultPinning) !== null && _c !== void 0 ? _c : false), 2), pinning = _f[0], setPinning = _f[1];
    var _g = __read(useState((_d = props.defaultOpen) !== null && _d !== void 0 ? _d : true), 2), visible = _g[0], setVisible = _g[1];
    var items = parseItems(props.children);
    var currentItem = findItem(items, activeKey);
    var content = currentItem === null || currentItem === void 0 ? void 0 : currentItem.children;
    activeKeyRef.current = activeKey;
    useEffect(function () {
        if (isValid(props.activeKey)) {
            if (props.activeKey !== activeKeyRef.current) {
                setActiveKey(props.activeKey);
            }
        }
    }, [props.activeKey]);
    var renderContent = function () {
        if (!content || !visible)
            return;
        return (React.createElement("div", { className: cls(prefix + '-tabs-content', {
                pinning: pinning,
            }) },
            React.createElement("div", { className: prefix + '-tabs-header' },
                React.createElement("div", { className: prefix + '-tabs-header-title' },
                    React.createElement(TextWidget, null, currentItem.title)),
                React.createElement("div", { className: prefix + '-tabs-header-actions' },
                    React.createElement("div", { className: prefix + '-tabs-header-extra' }, currentItem.extra),
                    !pinning && (React.createElement(IconWidget, { infer: "PushPinOutlined", className: prefix + '-tabs-header-pin', onClick: function () {
                            setPinning(!pinning);
                        } })),
                    pinning && (React.createElement(IconWidget, { infer: "PushPinFilled", className: prefix + '-tabs-header-pin-filled', onClick: function () {
                            setPinning(!pinning);
                        } })),
                    React.createElement(IconWidget, { infer: "Close", className: prefix + '-tabs-header-close', onClick: function () {
                            setVisible(false);
                        } }))),
            React.createElement("div", { className: prefix + '-tabs-body' }, content)));
    };
    return (React.createElement("div", { className: cls(prefix, (_a = {},
            _a["direction-".concat(props.direction)] = !!props.direction,
            _a)) },
        React.createElement("div", { className: prefix + '-tabs' }, items.map(function (item, index) {
            var _a;
            var takeTab = function () {
                if (item.href) {
                    return React.createElement("a", { href: item.href }, item.icon);
                }
                return (React.createElement(IconWidget, { tooltip: props.showNavTitle
                        ? null
                        : {
                            title: React.createElement(TextWidget, null, item.title),
                            placement: props.direction === 'right' ? 'left' : 'right',
                        }, infer: item.icon }));
            };
            var shape = (_a = item.shape) !== null && _a !== void 0 ? _a : 'tab';
            var Comp = shape === 'link' ? 'a' : 'div';
            return (React.createElement(Comp, { className: cls(prefix + '-tabs-pane', {
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
                props.showNavTitle && item.title ? (React.createElement("div", { className: prefix + '-tabs-pane-title' },
                    React.createElement(TextWidget, null, item.title))) : null));
        })),
        renderContent()));
};
CompositePanel.Item = function () {
    return React.createElement(React.Fragment, null);
};
