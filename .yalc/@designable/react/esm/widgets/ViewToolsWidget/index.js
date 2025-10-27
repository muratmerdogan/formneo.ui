import React from 'react';
import { Button } from 'antd';
import { observer } from '@formily/reactive-react';
import { IconWidget } from '../IconWidget';
import { usePrefix, useWorkbench } from '../../hooks';
import cls from 'classnames';
export var ViewToolsWidget = observer(function (_a) {
    var use = _a.use, style = _a.style, className = _a.className;
    var workbench = useWorkbench();
    var prefix = usePrefix('view-tools');
    return (React.createElement(Button.Group, { style: style, className: cls(prefix, className) },
        use.includes('DESIGNABLE') && (React.createElement(Button, { disabled: workbench.type === 'DESIGNABLE', onClick: function () {
                workbench.type = 'DESIGNABLE';
            }, size: "small" },
            React.createElement(IconWidget, { infer: "Design" }))),
        use.includes('JSONTREE') && (React.createElement(Button, { disabled: workbench.type === 'JSONTREE', onClick: function () {
                workbench.type = 'JSONTREE';
            }, size: "small" },
            React.createElement(IconWidget, { infer: "JSON" }))),
        use.includes('MARKUP') && (React.createElement(Button, { disabled: workbench.type === 'MARKUP', onClick: function () {
                workbench.type = 'MARKUP';
            }, size: "small" },
            React.createElement(IconWidget, { infer: "Code" }))),
        use.includes('PREVIEW') && (React.createElement(Button, { disabled: workbench.type === 'PREVIEW', onClick: function () {
                workbench.type = 'PREVIEW';
            }, size: "small" },
            React.createElement(IconWidget, { infer: "Play" })))));
});
ViewToolsWidget.defaultProps = {
    use: ['DESIGNABLE', 'JSONTREE', 'PREVIEW'],
};
