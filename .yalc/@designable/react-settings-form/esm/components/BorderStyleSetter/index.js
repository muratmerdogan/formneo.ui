import React, { Fragment, useMemo } from 'react';
import { usePrefix } from '@designable/react';
import { camelCase } from '@formily/shared';
import { Select } from '@formily/antd';
import { observable } from '@formily/reactive';
import { useField, Field, observer } from '@formily/react';
import { FoldItem } from '../FoldItem';
import { ColorInput } from '../ColorInput';
import { SizeInput } from '../SizeInput';
import { PositionInput } from '../PositionInput';
import cls from 'classnames';
import './styles.less';
var Positions = ['center', 'top', 'right', 'bottom', 'left'];
var BorderStyleOptions = [
    {
        label: 'None',
        value: 'none',
    },
    {
        label: React.createElement("span", { className: "border-style-solid-line" }),
        value: 'solid',
    },
    {
        label: React.createElement("span", { className: "border-style-dashed-line" }),
        value: 'dashed',
    },
    {
        label: React.createElement("span", { className: "border-style-dotted-line" }),
        value: 'dotted',
    },
];
var createBorderProp = function (position, key) {
    var insert = position === 'center' ? '' : "-".concat(position);
    return camelCase("border".concat(insert, "-").concat(key));
};
var parseInitPosition = function (field) {
    var basePath = field.address.parent();
    for (var i = 0; i < Positions.length; i++) {
        var position = Positions[i];
        var stylePath = "".concat(basePath, ".").concat(createBorderProp(position, 'style'));
        var widthPath = "".concat(basePath, ".").concat(createBorderProp(position, 'width'));
        var colorPath = "".concat(basePath, ".").concat(createBorderProp(position, 'color'));
        if (field.query(stylePath).value() ||
            field.query(widthPath).value() ||
            field.query(colorPath).value()) {
            return position;
        }
    }
    return 'center';
};
export var BorderStyleSetter = observer(function (_a) {
    var className = _a.className, style = _a.style;
    var field = useField();
    var currentPosition = useMemo(function () {
        return observable({
            value: parseInitPosition(field),
        });
    }, [field.value]);
    var prefix = usePrefix('border-style-setter');
    var createReaction = function (position) { return function (field) {
        field.display = currentPosition.value === position ? 'visible' : 'hidden';
        if (position !== 'center') {
            var borderStyle = field.query('.borderStyle').value();
            var borderWidth = field.query('.borderWidth').value();
            var borderColor = field.query('.borderColor').value();
            if (borderStyle || borderWidth || borderColor) {
                field.value = undefined;
            }
        }
    }; };
    return (React.createElement(FoldItem, { label: field.title },
        React.createElement(FoldItem.Extra, null,
            React.createElement("div", { className: cls(prefix, className), style: style },
                React.createElement("div", { className: prefix + '-position' },
                    React.createElement(PositionInput, { value: currentPosition.value, onChange: function (value) {
                            currentPosition.value = value;
                        } })),
                React.createElement("div", { className: prefix + '-input' }, Positions.map(function (position, key) {
                    return (React.createElement(Fragment, { key: key },
                        React.createElement(Field, { name: createBorderProp(position, 'style'), basePath: field.address.parent(), dataSource: BorderStyleOptions, reactions: createReaction(position), component: [Select, { placeholder: 'Please Select' }] }),
                        React.createElement(Field, { name: createBorderProp(position, 'width'), basePath: field.address.parent(), reactions: createReaction(position), component: [SizeInput, { exclude: ['auto'] }] }),
                        React.createElement(Field, { name: createBorderProp(position, 'color'), basePath: field.address.parent(), reactions: createReaction(position), component: [ColorInput] })));
                }))))));
});
