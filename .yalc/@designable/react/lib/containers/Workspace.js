"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../hooks");
var context_1 = require("../context");
var Workspace = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, props = __rest(_a, ["id", "title", "description"]);
    var oldId = (0, react_1.useRef)();
    var designer = (0, hooks_1.useDesigner)();
    var workspace = (0, react_1.useMemo)(function () {
        if (!designer)
            return;
        if (oldId.current && oldId.current !== id) {
            var old = designer.workbench.findWorkspaceById(oldId.current);
            if (old)
                old.viewport.detachEvents();
        }
        var workspace = {
            id: id || 'index',
            title: title,
            description: description,
        };
        designer.workbench.ensureWorkspace(workspace);
        oldId.current = workspace.id;
        return workspace;
    }, [id, designer]);
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(context_1.WorkspaceContext.Provider, { value: workspace }, props.children)));
};
exports.Workspace = Workspace;
