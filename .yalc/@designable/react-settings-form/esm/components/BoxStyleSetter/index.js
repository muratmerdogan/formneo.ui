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
import React from 'react';
import { useField, observer } from '@formily/react';
import { usePrefix, IconWidget } from '@designable/react';
import { FoldItem } from '../FoldItem';
import { SizeInput } from '../SizeInput';
import { InputItems } from '../InputItems';
import cls from 'classnames';
var PositionMap = {
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
    all: 1,
};
var BoxRex = /([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+))?)?)?/;
export var BoxStyleSetter = observer(function (props) {
    var field = useField();
    var prefix = usePrefix('box-style-setter');
    var createPositionHandler = function (position, props) {
        var matched = String(props.value).match(BoxRex) || [];
        var value = matched[PositionMap[position]];
        var v1 = matched[1];
        var v2 = matched[2];
        var v3 = matched[3];
        var v4 = matched[4];
        var allEqualls = v1 === v2 && v2 === v3 && v3 === v4;
        return __assign(__assign({}, props), { value: position === 'all' ? (allEqualls ? v1 : undefined) : value, onChange: function (value) {
                var _a, _b;
                if (position === 'all') {
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, "".concat(value || '0px', " ").concat(value || '0px', " ").concat(value || '0px', " ").concat(value || '0px'));
                }
                else {
                    matched[PositionMap[position]] = value;
                    (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, "".concat(matched[1] || '0px', " ").concat(matched[2] || '0px', " ").concat(matched[3] || '0px', " ").concat(matched[4] || '0px'));
                }
            } });
    };
    return (React.createElement(FoldItem, { className: cls(prefix, props.className), label: field.title },
        React.createElement(FoldItem.Base, null,
            React.createElement(SizeInput, __assign({}, createPositionHandler('all', props), { exclude: ['inherit', 'auto'] }))),
        React.createElement(FoldItem.Extra, null,
            React.createElement(InputItems, { width: "50%" },
                React.createElement(InputItems.Item, { icon: props.labels[0] },
                    React.createElement(SizeInput, __assign({}, createPositionHandler('top', props), { exclude: ['inherit', 'auto'] }))),
                React.createElement(InputItems.Item, { icon: props.labels[1] },
                    React.createElement(SizeInput, __assign({}, createPositionHandler('right', props), { exclude: ['inherit', 'auto'] }))),
                React.createElement(InputItems.Item, { icon: props.labels[2] },
                    React.createElement(SizeInput, __assign({}, createPositionHandler('bottom', props), { exclude: ['inherit', 'auto'] }))),
                React.createElement(InputItems.Item, { icon: props.labels[3] },
                    React.createElement(SizeInput, __assign({}, createPositionHandler('left', props), { exclude: ['inherit', 'auto'] })))))));
});
BoxStyleSetter.defaultProps = {
    labels: [
        React.createElement(IconWidget, { infer: "Top", size: 16, key: "1" }),
        React.createElement(IconWidget, { infer: "Right", size: 16, key: "2" }),
        React.createElement(IconWidget, { infer: "Bottom", size: 16, key: "3" }),
        React.createElement(IconWidget, { infer: "Left", size: 16, key: "4" }),
    ],
};
