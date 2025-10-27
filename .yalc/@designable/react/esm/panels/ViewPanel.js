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
import { observer } from '@formily/reactive-react';
import { useTree, useWorkbench } from '../hooks';
import { Viewport } from '../containers';
import { requestIdle } from '@designable/shared';
export var ViewPanel = observer(function (props) {
    var _a = __read(useState(true), 2), visible = _a[0], setVisible = _a[1];
    var workbench = useWorkbench();
    var tree = useTree();
    useEffect(function () {
        if (workbench.type === props.type) {
            requestIdle(function () {
                requestAnimationFrame(function () {
                    setVisible(true);
                });
            });
        }
        else {
            setVisible(false);
        }
    }, [workbench.type]);
    if (workbench.type !== props.type)
        return null;
    var render = function () {
        return props.children(tree, function (payload) {
            tree.from(payload);
            tree.takeSnapshot();
        });
    };
    if (workbench.type === 'DESIGNABLE')
        return (React.createElement(Viewport, { dragTipsDirection: props.dragTipsDirection }, render()));
    return (React.createElement("div", { style: {
            overflow: props.scrollable ? 'overlay' : 'hidden',
            height: '100%',
            cursor: 'auto',
            userSelect: 'text',
        } }, visible && render()));
});
ViewPanel.defaultProps = {
    scrollable: true,
};
