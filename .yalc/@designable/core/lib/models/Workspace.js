"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
var Viewport_1 = require("./Viewport");
var Operation_1 = require("./Operation");
var History_1 = require("./History");
var shared_1 = require("@designable/shared");
var events_1 = require("../events");
//工作区模型
var Workspace = /** @class */ (function () {
    function Workspace(engine, props) {
        var _this = this;
        this.engine = engine;
        this.props = props;
        this.id = props.id || (0, shared_1.uid)();
        this.title = props.title;
        this.description = props.description;
        this.viewport = new Viewport_1.Viewport({
            engine: this.engine,
            workspace: this,
            viewportElement: props.viewportElement,
            contentWindow: props.contentWindow,
            nodeIdAttrName: this.engine.props.nodeIdAttrName,
            moveSensitive: true,
            moveInsertionType: 'all',
        });
        this.outline = new Viewport_1.Viewport({
            engine: this.engine,
            workspace: this,
            viewportElement: props.viewportElement,
            contentWindow: props.contentWindow,
            nodeIdAttrName: this.engine.props.outlineNodeIdAttrName,
            moveSensitive: false,
            moveInsertionType: 'block',
        });
        this.operation = new Operation_1.Operation(this);
        this.history = new History_1.History(this, {
            onPush: function (item) {
                _this.operation.dispatch(new events_1.HistoryPushEvent(item));
            },
            onRedo: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new events_1.HistoryRedoEvent(item));
            },
            onUndo: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new events_1.HistoryUndoEvent(item));
            },
            onGoto: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new events_1.HistoryGotoEvent(item));
            },
        });
    }
    Workspace.prototype.getEventContext = function () {
        return {
            workbench: this.engine.workbench,
            workspace: this,
            engine: this.engine,
            viewport: this.viewport,
        };
    };
    Workspace.prototype.attachEvents = function (container, contentWindow) {
        this.engine.attachEvents(container, contentWindow, this.getEventContext());
    };
    Workspace.prototype.detachEvents = function (container) {
        this.engine.detachEvents(container);
    };
    Workspace.prototype.dispatch = function (event) {
        return this.engine.dispatch(event, this.getEventContext());
    };
    Workspace.prototype.serialize = function () {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            operation: this.operation.serialize(),
        };
    };
    Workspace.prototype.from = function (workspace) {
        if (!workspace)
            return;
        if (workspace.operation) {
            this.operation.from(workspace.operation);
        }
        if (workspace.id) {
            this.id = workspace.id;
        }
        if (workspace.title) {
            this.title = workspace.title;
        }
        if (workspace.description) {
            this.description = workspace.description;
        }
    };
    return Workspace;
}());
exports.Workspace = Workspace;
