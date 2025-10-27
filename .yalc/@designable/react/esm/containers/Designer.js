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
import React, { useEffect, useRef } from 'react';
import { GlobalRegistry } from '@designable/core';
import { DesignerEngineContext } from '../context';
import { GhostWidget } from '../widgets';
import { useDesigner } from '../hooks';
import { Layout } from './Layout';
import * as icons from '../icons';
GlobalRegistry.registerDesignerIcons(icons);
export var Designer = function (props) {
    var engine = useDesigner();
    var ref = useRef();
    useEffect(function () {
        if (props.engine) {
            if (props.engine && ref.current) {
                if (props.engine !== ref.current) {
                    ref.current.unmount();
                }
            }
            props.engine.mount();
            ref.current = props.engine;
        }
        return function () {
            if (props.engine) {
                props.engine.unmount();
            }
        };
    }, [props.engine]);
    if (engine)
        throw new Error('There can only be one Designable Engine Context in the React Tree');
    return (React.createElement(Layout, __assign({}, props),
        React.createElement(DesignerEngineContext.Provider, { value: props.engine },
            props.children,
            React.createElement(GhostWidget, null))));
};
Designer.defaultProps = {
    prefixCls: 'dn-',
    theme: 'light',
};
