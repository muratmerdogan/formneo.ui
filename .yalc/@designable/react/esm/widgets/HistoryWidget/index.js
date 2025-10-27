import React from 'react';
import format from 'dateformat';
import { observer } from '@formily/reactive-react';
import { usePrefix, useWorkbench } from '../../hooks';
import { TextWidget } from '../TextWidget';
import cls from 'classnames';
import './styles.less';
export var HistoryWidget = observer(function () {
    var workbench = useWorkbench();
    var currentWorkspace = (workbench === null || workbench === void 0 ? void 0 : workbench.activeWorkspace) || (workbench === null || workbench === void 0 ? void 0 : workbench.currentWorkspace);
    var prefix = usePrefix('history');
    if (!currentWorkspace)
        return null;
    return (React.createElement("div", { className: prefix }, currentWorkspace.history.list().map(function (item, index) {
        var type = item.type || 'default_state';
        var token = type.replace(/\:/g, '_');
        return (React.createElement("div", { className: cls(prefix + '-item', {
                active: currentWorkspace.history.current === index,
            }), key: item.timestamp, onClick: function () {
                currentWorkspace.history.goTo(index);
            } },
            React.createElement("span", { className: prefix + '-item-title' },
                React.createElement(TextWidget, { token: "operations.".concat(token) })),
            React.createElement("span", { className: prefix + '-item-timestamp' },
                ' ',
                format(item.timestamp, 'yy/mm/dd HH:MM:ss'))));
    })));
});
