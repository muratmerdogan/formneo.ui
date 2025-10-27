"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
var TreeNode_1 = require("./TreeNode");
var Selection_1 = require("./Selection");
var Hover_1 = require("./Hover");
var TransformHelper_1 = require("./TransformHelper");
var MoveHelper_1 = require("./MoveHelper");
var shared_1 = require("@designable/shared");
var Operation = /** @class */ (function () {
    function Operation(workspace) {
        this.requests = {
            snapshot: null,
        };
        this.engine = workspace.engine;
        this.workspace = workspace;
        this.tree = new TreeNode_1.TreeNode(__assign(__assign({ componentName: this.engine.props.rootComponentName }, this.engine.props.defaultComponentTree), { operation: this }));
        this.hover = new Hover_1.Hover({
            operation: this,
        });
        this.selection = new Selection_1.Selection({
            operation: this,
        });
        this.moveHelper = new MoveHelper_1.MoveHelper({
            operation: this,
        });
        this.transformHelper = new TransformHelper_1.TransformHelper({
            operation: this,
        });
        this.selection.select(this.tree);
    }
    Operation.prototype.dispatch = function (event, callback) {
        if (this.workspace.dispatch(event) === false)
            return;
        if ((0, shared_1.isFn)(callback))
            return callback();
    };
    Operation.prototype.snapshot = function (type) {
        var _this = this;
        (0, shared_1.cancelIdle)(this.requests.snapshot);
        if (!this.workspace ||
            !this.workspace.history ||
            this.workspace.history.locking)
            return;
        this.requests.snapshot = (0, shared_1.requestIdle)(function () {
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
exports.Operation = Operation;
