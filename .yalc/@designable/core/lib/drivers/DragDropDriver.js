"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragDropDriver = void 0;
var shared_1 = require("@designable/shared");
var events_1 = require("../events");
var GlobalState = {
    dragging: false,
    onMouseDownAt: 0,
    startEvent: null,
    moveEvent: null,
};
var DragDropDriver = /** @class */ (function (_super) {
    __extends(DragDropDriver, _super);
    function DragDropDriver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mouseDownTimer = null;
        _this.onMouseDown = function (e) {
            var _a, _b;
            if (e.button !== 0 || e.ctrlKey || e.metaKey) {
                return;
            }
            if (e.target['isContentEditable'] ||
                e.target['contentEditable'] === 'true') {
                return true;
            }
            if ((_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a['closest']) === null || _b === void 0 ? void 0 : _b.call(_a, '.monaco-editor'))
                return;
            GlobalState.startEvent = e;
            GlobalState.dragging = false;
            GlobalState.onMouseDownAt = Date.now();
            _this.batchAddEventListener('mouseup', _this.onMouseUp);
            _this.batchAddEventListener('dragend', _this.onMouseUp);
            _this.batchAddEventListener('dragstart', _this.onStartDrag);
            _this.batchAddEventListener('mousemove', _this.onDistanceChange);
        };
        _this.onMouseUp = function (e) {
            if (GlobalState.dragging) {
                _this.dispatch(new events_1.DragStopEvent({
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    target: e.target,
                    view: e.view,
                }));
            }
            _this.batchRemoveEventListener('contextmenu', _this.onContextMenuWhileDragging, true);
            _this.batchRemoveEventListener('mouseup', _this.onMouseUp);
            _this.batchRemoveEventListener('mousedown', _this.onMouseDown);
            _this.batchRemoveEventListener('dragover', _this.onMouseMove);
            _this.batchRemoveEventListener('mousemove', _this.onMouseMove);
            _this.batchRemoveEventListener('mousemove', _this.onDistanceChange);
            GlobalState.dragging = false;
        };
        _this.onMouseMove = function (e) {
            var _a, _b;
            if (e.clientX === ((_a = GlobalState.moveEvent) === null || _a === void 0 ? void 0 : _a.clientX) &&
                e.clientY === ((_b = GlobalState.moveEvent) === null || _b === void 0 ? void 0 : _b.clientY))
                return;
            _this.dispatch(new events_1.DragMoveEvent({
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.target,
                view: e.view,
            }));
            GlobalState.moveEvent = e;
        };
        _this.onContextMenuWhileDragging = function (e) {
            e.preventDefault();
        };
        _this.onStartDrag = function (e) {
            if (GlobalState.dragging)
                return;
            GlobalState.startEvent = GlobalState.startEvent || e;
            _this.batchAddEventListener('dragover', _this.onMouseMove);
            _this.batchAddEventListener('mousemove', _this.onMouseMove);
            _this.batchAddEventListener('contextmenu', _this.onContextMenuWhileDragging, true);
            _this.dispatch(new events_1.DragStartEvent({
                clientX: GlobalState.startEvent.clientX,
                clientY: GlobalState.startEvent.clientY,
                pageX: GlobalState.startEvent.pageX,
                pageY: GlobalState.startEvent.pageY,
                target: GlobalState.startEvent.target,
                view: GlobalState.startEvent.view,
            }));
            GlobalState.dragging = true;
        };
        _this.onDistanceChange = function (e) {
            var distance = Math.sqrt(Math.pow(e.pageX - GlobalState.startEvent.pageX, 2) +
                Math.pow(e.pageY - GlobalState.startEvent.pageY, 2));
            var timeDelta = Date.now() - GlobalState.onMouseDownAt;
            if (timeDelta > 10 && e !== GlobalState.startEvent && distance > 4) {
                _this.batchRemoveEventListener('mousemove', _this.onDistanceChange);
                _this.onStartDrag(e);
            }
        };
        return _this;
    }
    DragDropDriver.prototype.attach = function () {
        this.batchAddEventListener('mousedown', this.onMouseDown, true);
    };
    DragDropDriver.prototype.detach = function () {
        GlobalState.dragging = false;
        GlobalState.moveEvent = null;
        GlobalState.onMouseDownAt = null;
        GlobalState.startEvent = null;
        this.batchRemoveEventListener('mousedown', this.onMouseDown, true);
        this.batchRemoveEventListener('dragstart', this.onStartDrag);
        this.batchRemoveEventListener('dragend', this.onMouseUp);
        this.batchRemoveEventListener('dragover', this.onMouseMove);
        this.batchRemoveEventListener('mouseup', this.onMouseUp);
        this.batchRemoveEventListener('mousemove', this.onMouseMove);
        this.batchRemoveEventListener('mousemove', this.onDistanceChange);
        this.batchRemoveEventListener('contextmenu', this.onContextMenuWhileDragging, true);
    };
    return DragDropDriver;
}(shared_1.EventDriver));
exports.DragDropDriver = DragDropDriver;
