import React, { useRef } from 'react';
import { Input, Popover } from 'antd';
import { usePrefix } from '@designable/react';
import { SketchPicker } from 'react-color';
import './styles.less';
export var ColorInput = function (props) {
    var container = useRef();
    var prefix = usePrefix('color-input');
    var color = props.value;
    return (React.createElement("div", { ref: container, className: prefix },
        React.createElement(Input, { value: props.value, onChange: function (e) {
                var _a;
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, e.target.value);
            }, placeholder: "Color", prefix: React.createElement(Popover, { autoAdjustOverflow: true, trigger: "click", overlayInnerStyle: { padding: 0 }, getPopupContainer: function () { return container.current; }, content: React.createElement(SketchPicker, { color: color, onChange: function (_a) {
                        var _b;
                        var rgb = _a.rgb;
                        (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, "rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ",").concat(rgb.a, ")"));
                    } }) },
                React.createElement("div", { className: prefix + '-color-tips', style: {
                        backgroundColor: color,
                    } })) })));
};
