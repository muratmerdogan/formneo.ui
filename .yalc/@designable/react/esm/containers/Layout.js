import React, { useContext, Fragment, useRef, useLayoutEffect } from 'react';
import { each } from '@designable/shared';
import { DesignerLayoutContext } from '../context';
import cls from 'classnames';
export var Layout = function (props) {
    var _a;
    var layout = useContext(DesignerLayoutContext);
    var ref = useRef();
    useLayoutEffect(function () {
        if (ref.current) {
            each(props.variables, function (value, key) {
                ref.current.style.setProperty("--".concat(key), value);
            });
        }
    }, []);
    if (layout) {
        return React.createElement(Fragment, null, props.children);
    }
    return (React.createElement("div", { ref: ref, className: cls((_a = {},
            _a["".concat(props.prefixCls, "app")] = true,
            _a["".concat(props.prefixCls).concat(props.theme)] = props.theme,
            _a)) },
        React.createElement(DesignerLayoutContext.Provider, { value: {
                theme: props.theme,
                prefixCls: props.prefixCls,
                position: props.position,
            } }, props.children)));
};
Layout.defaultProps = {
    theme: 'light',
    prefixCls: 'dn-',
    position: 'fixed',
};
