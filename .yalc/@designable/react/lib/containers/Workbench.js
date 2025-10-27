"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbench = void 0;
var react_1 = __importDefault(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../hooks");
var Workspace_1 = require("./Workspace");
exports.Workbench = (0, reactive_react_1.observer)(function (props) {
    var _a;
    var workbench = (0, hooks_1.useWorkbench)();
    return (react_1.default.createElement(Workspace_1.Workspace, { id: (_a = workbench.currentWorkspace) === null || _a === void 0 ? void 0 : _a.id }, props.children));
});
