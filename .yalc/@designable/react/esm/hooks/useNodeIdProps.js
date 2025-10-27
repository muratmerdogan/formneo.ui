import { useDesigner } from './useDesigner';
import { useTreeNode } from './useTreeNode';
export var useNodeIdProps = function (node) {
    var _a;
    var target = useTreeNode();
    var designer = useDesigner();
    return _a = {},
        _a[designer.props.nodeIdAttrName] = node ? node.id : target.id,
        _a;
};
