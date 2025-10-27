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
import { isResourceHost, isResourceList, } from '@designable/core';
import { isFn } from '@designable/shared';
import { observer } from '@formily/reactive-react';
import { usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { TextWidget } from '../TextWidget';
import cls from 'classnames';
import './styles.less';
export var ResourceWidget = observer(function (props) {
    var prefix = usePrefix('resource');
    var _a = __read(useState(props.defaultExpand), 2), expand = _a[0], setExpand = _a[1];
    var renderNode = function (source) {
        var _a;
        var node = source.node, icon = source.icon, title = source.title, thumb = source.thumb, span = source.span;
        return (React.createElement("div", { className: prefix + '-item', style: { gridColumnStart: "span ".concat(span || 1) }, key: node.id, "data-designer-source-id": node.id },
            thumb && React.createElement("img", { className: prefix + '-item-thumb', src: thumb }),
            icon && React.isValidElement(icon) ? (React.createElement(React.Fragment, null, icon)) : (React.createElement(IconWidget, { className: prefix + '-item-icon', infer: icon, style: { width: 150, height: 40 } })),
            React.createElement("span", { className: prefix + '-item-text' }, React.createElement(TextWidget, null, title || ((_a = node.children[0]) === null || _a === void 0 ? void 0 : _a.getMessage('title'))))));
    };
    var sources = props.sources.reduce(function (buf, source) {
        if (isResourceList(source)) {
            return buf.concat(source);
        }
        else if (isResourceHost(source)) {
            return buf.concat(source.Resource);
        }
        return buf;
    }, []);
    var remainItems = sources.reduce(function (length, source) {
        var _a;
        return length + ((_a = source.span) !== null && _a !== void 0 ? _a : 1);
    }, 0) % 3;
    return (React.createElement("div", { className: cls(prefix, props.className, {
            expand: expand,
        }) },
        React.createElement("div", { className: prefix + '-header', onClick: function (e) {
                e.stopPropagation();
                e.preventDefault();
                setExpand(!expand);
            } },
            React.createElement("div", { className: prefix + '-header-expand' },
                React.createElement(IconWidget, { infer: "Expand", size: 10 })),
            React.createElement("div", { className: prefix + '-header-content' },
                React.createElement(TextWidget, null, props.title))),
        React.createElement("div", { className: prefix + '-content-wrapper' },
            React.createElement("div", { className: prefix + '-content' },
                sources.map(isFn(props.children) ? props.children : renderNode),
                remainItems ? (React.createElement("div", { className: prefix + '-item-remain', style: { gridColumnStart: "span ".concat(3 - remainItems) } })) : null))));
});
ResourceWidget.defaultProps = {
    defaultExpand: true,
};
