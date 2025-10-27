import { useContext } from 'react';
import { TreeNodeContext } from '../context';
export var useTreeNode = function () {
    return useContext(TreeNodeContext);
};
