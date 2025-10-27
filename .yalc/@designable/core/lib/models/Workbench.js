"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbench = void 0;
var Workspace_1 = require("./Workspace");
var reactive_1 = require("@formily/reactive");
var events_1 = require("../events");
var Workbench = /** @class */ (function () {
    function Workbench(engine) {
        this.type = 'DESIGNABLE';
        this.engine = engine;
        this.workspaces = [];
        this.currentWorkspace = null;
        this.activeWorkspace = null;
        this.makeObservable();
    }
    Workbench.prototype.makeObservable = function () {
        (0, reactive_1.define)(this, {
            currentWorkspace: reactive_1.observable.ref,
            workspaces: reactive_1.observable.shallow,
            activeWorkspace: reactive_1.observable.ref,
            type: reactive_1.observable.ref,
            switchWorkspace: reactive_1.action,
            addWorkspace: reactive_1.action,
            removeWorkspace: reactive_1.action,
            setActiveWorkspace: reactive_1.action,
            setWorkbenchType: reactive_1.action,
        });
    };
    Workbench.prototype.getEventContext = function () {
        return {
            engine: this.engine,
            workbench: this.engine.workbench,
            workspace: null,
            viewport: null,
        };
    };
    Workbench.prototype.switchWorkspace = function (id) {
        var finded = this.findWorkspaceById(id);
        if (finded) {
            this.currentWorkspace = finded;
            this.engine.dispatch(new events_1.SwitchWorkspaceEvent(finded));
        }
        return this.currentWorkspace;
    };
    Workbench.prototype.setActiveWorkspace = function (workspace) {
        this.activeWorkspace = workspace;
        return workspace;
    };
    Workbench.prototype.setWorkbenchType = function (type) {
        this.type = type;
    };
    Workbench.prototype.addWorkspace = function (props) {
        var finded = this.findWorkspaceById(props.id);
        if (!finded) {
            this.currentWorkspace = new Workspace_1.Workspace(this.engine, props);
            this.workspaces.push(this.currentWorkspace);
            this.engine.dispatch(new events_1.AddWorkspaceEvent(this.currentWorkspace));
            return this.currentWorkspace;
        }
        return finded;
    };
    Workbench.prototype.removeWorkspace = function (id) {
        var findIndex = this.findWorkspaceIndexById(id);
        if (findIndex > -1 && findIndex < this.workspaces.length) {
            var findedWorkspace = this.workspaces[findIndex];
            findedWorkspace.viewport.detachEvents();
            this.workspaces.splice(findIndex, 1);
            if (findedWorkspace === this.currentWorkspace) {
                if (this.workspaces.length && this.workspaces[findIndex]) {
                    this.currentWorkspace = this.workspaces[findIndex];
                }
                else {
                    this.currentWorkspace = this.workspaces[this.workspaces.length - 1];
                }
            }
            this.engine.dispatch(new events_1.RemoveWorkspaceEvent(findedWorkspace));
        }
    };
    Workbench.prototype.ensureWorkspace = function (props) {
        if (props === void 0) { props = {}; }
        var workspace = this.findWorkspaceById(props.id);
        if (workspace)
            return workspace;
        this.addWorkspace(props);
        return this.currentWorkspace;
    };
    Workbench.prototype.findWorkspaceById = function (id) {
        return this.workspaces.find(function (item) { return item.id === id; });
    };
    Workbench.prototype.findWorkspaceIndexById = function (id) {
        return this.workspaces.findIndex(function (item) { return item.id === id; });
    };
    Workbench.prototype.mapWorkspace = function (callbackFn) {
        return this.workspaces.map(callbackFn);
    };
    Workbench.prototype.eachWorkspace = function (callbackFn) {
        this.workspaces.forEach(callbackFn);
    };
    return Workbench;
}());
exports.Workbench = Workbench;
