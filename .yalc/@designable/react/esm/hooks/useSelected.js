import { useSelection } from './useSelection';
export var useSelected = function (workspaceId) {
    var selection = useSelection(workspaceId);
    return (selection === null || selection === void 0 ? void 0 : selection.selected) || [];
};
