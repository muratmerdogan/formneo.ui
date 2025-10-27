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
import React, { useEffect, useState } from 'react';
import { requestIdle } from '@designable/shared';
import { observer } from '@formily/reactive-react';
import { TextWidget, IconWidget } from '../widgets';
import { usePrefix, useWorkbench } from '../hooks';
import cls from 'classnames';
export var SettingsPanel = observer(function (props) {
    var prefix = usePrefix('settings-panel');
    var workbench = useWorkbench();
    var _a = __read(useState(true), 2), innerVisible = _a[0], setInnerVisible = _a[1];
    var _b = __read(useState(false), 2), pinning = _b[0], setPinning = _b[1];
    var _c = __read(useState(true), 2), visible = _c[0], setVisible = _c[1];
    useEffect(function () {
        if (visible || workbench.type === 'DESIGNABLE') {
            if (!innerVisible) {
                requestIdle(function () {
                    requestAnimationFrame(function () {
                        setInnerVisible(true);
                    });
                });
            }
        }
    }, [visible, workbench.type]);
    if (workbench.type !== 'DESIGNABLE') {
        if (innerVisible)
            setInnerVisible(false);
        return null;
    }
    if (!visible) {
        if (innerVisible)
            setInnerVisible(false);
        return (React.createElement("div", { className: prefix + '-opener', onClick: function () {
                setVisible(true);
            } },
            React.createElement(IconWidget, { infer: "Setting", size: 20 })));
    }
    return (React.createElement("div", { className: cls(prefix, { pinning: pinning }) },
        React.createElement("div", { className: prefix + '-header' },
            React.createElement("div", { className: prefix + '-header-title' },
                React.createElement(TextWidget, null, props.title)),
            React.createElement("div", { className: prefix + '-header-actions' },
                React.createElement("div", { className: prefix + '-header-extra' }, props.extra),
                !pinning && (React.createElement(IconWidget, { infer: "PushPinOutlined", className: prefix + '-header-pin', onClick: function () {
                        setPinning(!pinning);
                    } })),
                pinning && (React.createElement(IconWidget, { infer: "PushPinFilled", className: prefix + '-pin-filled', onClick: function () {
                        setPinning(!pinning);
                    } })),
                React.createElement(IconWidget, { infer: "Close", className: prefix + '-header-close', onClick: function () {
                        setVisible(false);
                    } }))),
        React.createElement("div", { className: prefix + '-body' }, innerVisible && props.children)));
});
