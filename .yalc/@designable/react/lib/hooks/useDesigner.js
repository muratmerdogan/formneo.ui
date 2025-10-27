"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDesigner = void 0;
var react_1 = require("react");
var context_1 = require("../context");
var shared_1 = require("@designable/shared");
var useDesigner = function (effects) {
    var designer = shared_1.globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
        (0, react_1.useContext)(context_1.DesignerEngineContext);
    (0, react_1.useEffect)(function () {
        if ((0, shared_1.isFn)(effects)) {
            return effects(designer);
        }
    }, []);
    return designer;
};
exports.useDesigner = useDesigner;
