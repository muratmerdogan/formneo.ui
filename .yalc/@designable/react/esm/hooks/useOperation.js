import { useWorkspace } from './useWorkspace';
export var useOperation = function (workspaceId) {
    var workspace = useWorkspace(workspaceId);
    return workspace === null || workspace === void 0 ? void 0 : workspace.operation;
};
