import React from 'react';
import { Breadcrumb } from 'antd';
import { useSelectedNode, useSelection, usePrefix, useHover } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { NodeTitleWidget } from '../NodeTitleWidget';
import { observer } from '@formily/reactive-react';
import './styles.less';
export var NodePathWidget = observer(function (props) {
    var _a;
    var selected = useSelectedNode(props.workspaceId);
    var selection = useSelection(props.workspaceId);
    var hover = useHover(props.workspaceId);
    var prefix = usePrefix('node-path');
    if (!selected)
        return React.createElement(React.Fragment, null);
    var maxItems = (_a = props.maxItems) !== null && _a !== void 0 ? _a : 3;
    var nodes = selected
        .getParents()
        .slice(0, maxItems - 1)
        .reverse()
        .concat(selected);
    return (React.createElement(Breadcrumb, { className: prefix }, nodes.map(function (node, key) {
        return (React.createElement(Breadcrumb.Item, { key: key },
            key === 0 && (React.createElement(IconWidget, { infer: "Position", style: { marginRight: 3 } })),
            React.createElement("a", { href: "", onMouseEnter: function () {
                    hover.setHover(node);
                }, onClick: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    selection.select(node);
                } },
                React.createElement(NodeTitleWidget, { node: node }))));
    })));
});
