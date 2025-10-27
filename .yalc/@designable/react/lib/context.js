"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceContext = exports.TreeNodeContext = exports.DesignerEngineContext = exports.DesignerLayoutContext = exports.DesignerComponentsContext = void 0;
var react_1 = require("react");
exports.DesignerComponentsContext = (0, react_1.createContext)({});
exports.DesignerLayoutContext = (0, react_1.createContext)(null);
exports.DesignerEngineContext = (0, react_1.createContext)(null);
exports.TreeNodeContext = (0, react_1.createContext)(null);
exports.WorkspaceContext = (0, react_1.createContext)(null);
