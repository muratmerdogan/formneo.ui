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
import React, { useState, useEffect } from 'react';
import { usePrefix } from '@designable/react';
import cls from 'classnames';
import './styles.less';
export var CornerInput = function (props) {
    var prefix = usePrefix('corner-input');
    var _a = __read(useState(props.value), 2), current = _a[0], setCurrent = _a[1];
    useEffect(function () {
        if (!props.value) {
            setCurrent('all');
        }
    }, [props.value]);
    var createCellProps = function (type) { return ({
        className: cls(prefix + '-cell', { active: current === type }),
        onClick: function () {
            var _a;
            setCurrent(type);
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, type);
        },
    }); };
    return (React.createElement("div", { className: cls(prefix, props.className), style: props.style },
        React.createElement("div", { className: prefix + '-column' },
            React.createElement("div", __assign({}, createCellProps('topLeft')), "\u250F"),
            React.createElement("div", __assign({}, createCellProps('bottomLeft')), "\u2517")),
        React.createElement("div", { className: prefix + '-column' },
            React.createElement("div", __assign({}, createCellProps('all')), "\u254B")),
        React.createElement("div", { className: prefix + '-column' },
            React.createElement("div", __assign({}, createCellProps('topRight')), "\u2513"),
            React.createElement("div", __assign({}, createCellProps('bottomRight')), "\u251B"))));
};
