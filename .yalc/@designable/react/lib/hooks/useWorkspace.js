"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspace = void 0;
var react_1 = require("react");
var useDesigner_1 = require("./useDesigner");
var context_1 = require("../context");
var shared_1 = require("@designable/shared");
var useWorkspace = function (id) {
    var _a;
    var designer = (0, useDesigner_1.useDesigner)();
    var workspaceId = id || ((_a = (0, react_1.useContext)(context_1.WorkspaceContext)) === null || _a === void 0 ? void 0 : _a.id);
    if (workspaceId) {
        return designer.workbench.findWorkspaceById(workspaceId);
    }
    if (shared_1.globalThisPolyfill['__DESIGNABLE_WORKSPACE__'])
        return shared_1.globalThisPolyfill['__DESIGNABLE_WORKSPACE__'];
    return designer.workbench.currentWorkspace;
};
exports.useWorkspace = useWorkspace;
