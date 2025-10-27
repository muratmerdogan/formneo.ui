import React from 'react';
import { TreeNode } from '@designable/core';
import { usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { Button } from 'antd';
export var Copy = function (_a) {
    var node = _a.node, style = _a.style;
    var prefix = usePrefix('aux-copy');
    if (node === node.root)
        return null;
    return (React.createElement(Button, { className: prefix, style: style, type: "primary", onClick: function () {
            TreeNode.clone([node]);
        } },
        React.createElement(IconWidget, { infer: "Clone" })));
};
Copy.displayName = 'Copy';
