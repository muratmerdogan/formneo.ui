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
import { ScreenType } from '@designable/core';
import { requestIdle } from '@designable/shared';
import { observer } from '@formily/reactive-react';
import { useScreen } from '../hooks';
import { MobileSimulator, PCSimulator, ResponsiveSimulator, } from '../simulators';
export var Simulator = observer(function (props) {
    var screen = useScreen();
    if (screen.type === ScreenType.PC)
        return React.createElement(PCSimulator, __assign({}, props), props.children);
    if (screen.type === ScreenType.Mobile)
        return React.createElement(MobileSimulator, __assign({}, props), props.children);
    if (screen.type === ScreenType.Responsive)
        return (React.createElement(ResponsiveSimulator, __assign({}, props), props.children));
    return React.createElement(PCSimulator, __assign({}, props), props.children);
}, {
    scheduler: requestIdle,
});
