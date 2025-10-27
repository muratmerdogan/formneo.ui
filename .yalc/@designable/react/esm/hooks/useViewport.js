import { useWorkspace } from './useWorkspace';
export var useViewport = function (workspaceId) {
    var workspace = useWorkspace(workspaceId);
    return workspace === null || workspace === void 0 ? void 0 : workspace.viewport;
};
