import { Viewport } from './Viewport';
import { Operation } from './Operation';
import { History } from './History';
import { uid } from '@designable/shared';
import { HistoryGotoEvent, HistoryRedoEvent, HistoryUndoEvent, HistoryPushEvent, } from '../events';
//工作区模型
var Workspace = /** @class */ (function () {
    function Workspace(engine, props) {
        var _this = this;
        this.engine = engine;
        this.props = props;
        this.id = props.id || uid();
        this.title = props.title;
        this.description = props.description;
        this.viewport = new Viewport({
            engine: this.engine,
            workspace: this,
            viewportElement: props.viewportElement,
            contentWindow: props.contentWindow,
            nodeIdAttrName: this.engine.props.nodeIdAttrName,
            moveSensitive: true,
            moveInsertionType: 'all',
        });
        this.outline = new Viewport({
            engine: this.engine,
            workspace: this,
            viewportElement: props.viewportElement,
            contentWindow: props.contentWindow,
            nodeIdAttrName: this.engine.props.outlineNodeIdAttrName,
            moveSensitive: false,
            moveInsertionType: 'block',
        });
        this.operation = new Operation(this);
        this.history = new History(this, {
            onPush: function (item) {
                _this.operation.dispatch(new HistoryPushEvent(item));
            },
            onRedo: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new HistoryRedoEvent(item));
            },
            onUndo: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new HistoryUndoEvent(item));
            },
            onGoto: function (item) {
                _this.operation.hover.clear();
                _this.operation.dispatch(new HistoryGotoEvent(item));
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
export { Workspace };
