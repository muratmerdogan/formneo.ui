import { useDesigner } from './useDesigner';
export var useWorkbench = function () {
    var designer = useDesigner();
    return designer.workbench;
};
