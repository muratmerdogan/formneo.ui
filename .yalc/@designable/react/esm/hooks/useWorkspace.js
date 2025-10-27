import { useContext } from 'react';
import { useDesigner } from './useDesigner';
import { WorkspaceContext } from '../context';
import { globalThisPolyfill } from '@designable/shared';
export var useWorkspace = function (id) {
    var _a;
    var designer = useDesigner();
    var workspaceId = id || ((_a = useContext(WorkspaceContext)) === null || _a === void 0 ? void 0 : _a.id);
    if (workspaceId) {
        return designer.workbench.findWorkspaceById(workspaceId);
    }
    if (globalThisPolyfill['__DESIGNABLE_WORKSPACE__'])
        return globalThisPolyfill['__DESIGNABLE_WORKSPACE__'];
    return designer.workbench.currentWorkspace;
};
