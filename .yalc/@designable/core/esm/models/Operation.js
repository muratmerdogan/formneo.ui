var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { TreeNode } from './TreeNode';
import { Selection } from './Selection';
import { Hover } from './Hover';
import { TransformHelper } from './TransformHelper';
import { MoveHelper } from './MoveHelper';
import { cancelIdle, isFn, requestIdle } from '@designable/shared';
var Operation = /** @class */ (function () {
    function Operation(workspace) {
        this.requests = {
            snapshot: null,
        };
        this.engine = workspace.engine;
        this.workspace = workspace;
        this.tree = new TreeNode(__assign(__assign({ componentName: this.engine.props.rootComponentName }, this.engine.props.defaultComponentTree), { operation: this }));
        this.hover = new Hover({
            operation: this,
        });
        this.selection = new Selection({
            operation: this,
        });
        this.moveHelper = new MoveHelper({
            operation: this,
        });
        this.transformHelper = new TransformHelper({
            operation: this,
        });
        this.selection.select(this.tree);
    }
    Operation.prototype.dispatch = function (event, callback) {
        if (this.workspace.dispatch(event) === false)
            return;
        if (isFn(callback))
            return callback();
    };
    Operation.prototype.snapshot = function (type) {
        var _this = this;
        cancelIdle(this.requests.snapshot);
        if (!this.workspace ||
            !this.workspace.history ||
            this.workspace.history.locking)
            return;
        this.requests.snapshot = requestIdle(function () {
            _this.workspace.history.push(type);
        });
    };
    Operation.prototype.from = function (operation) {
        if (!operation)
            return;
        if (operation.tree) {
            this.tree.from(operation.tree);
        }
        if (operation.selected) {
            this.selection.selected = operation.selected;
        }
    };
    Operation.prototype.serialize = function () {
        return {
            tree: this.tree.serialize(),
            selected: [this.tree.id],
        };
    };
    return Operation;
}());
export { Operation };
