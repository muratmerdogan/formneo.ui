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
import React, { useState } from 'react';
import { useField, observer } from '@formily/react';
import { usePrefix, IconWidget } from '@designable/react';
import cls from 'classnames';
import './styles.less';
export var CollapseItem = observer(function (props) {
    var _a;
    var prefix = usePrefix('collapse-item');
    var field = useField();
    var _b = __read(useState((_a = props.defaultExpand) !== null && _a !== void 0 ? _a : true), 2), expand = _b[0], setExpand = _b[1];
    return (React.createElement("div", { className: cls(prefix, props.className, { expand: expand }), style: props.style },
        React.createElement("div", { className: prefix + '-header', onClick: function (e) {
                e.stopPropagation();
                e.preventDefault();
                setExpand(!expand);
            } },
            React.createElement("div", { className: prefix + '-header-expand' },
                React.createElement(IconWidget, { infer: "Expand", size: 10 })),
            React.createElement("div", { className: prefix + '-header-content' }, field.title)),
        React.createElement("div", { className: prefix + '-content' }, props.children)));
});
