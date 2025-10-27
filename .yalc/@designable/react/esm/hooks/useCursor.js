import { useDesigner } from './useDesigner';
export var useCursor = function () {
    var designer = useDesigner();
    return designer.cursor;
};
