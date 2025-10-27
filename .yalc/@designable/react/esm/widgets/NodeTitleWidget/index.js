import React, { Fragment } from 'react';
import { observer } from '@formily/reactive-react';
export var NodeTitleWidget = observer(function (props) {
    var takeNode = function () {
        var node = props.node;
        if (node.componentName === '$$ResourceNode$$') {
            return node.children[0];
        }
        return node;
    };
    var node = takeNode();
    return React.createElement(Fragment, null, node.getMessage('title') || node.componentName);
});
