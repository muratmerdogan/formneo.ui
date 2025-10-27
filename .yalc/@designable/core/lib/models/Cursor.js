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
exports.Cursor = exports.CursorType = exports.CursorDragType = exports.CursorStatus = void 0;
var reactive_1 = require("@formily/reactive");
var shared_1 = require("@designable/shared");
var CursorStatus;
(function (CursorStatus) {
    CursorStatus["Normal"] = "NORMAL";
    CursorStatus["DragStart"] = "DRAG_START";
    CursorStatus["Dragging"] = "DRAGGING";
    CursorStatus["DragStop"] = "DRAG_STOP";
})(CursorStatus = exports.CursorStatus || (exports.CursorStatus = {}));
var CursorDragType;
(function (CursorDragType) {
    CursorDragType["Move"] = "MOVE";
    CursorDragType["Resize"] = "RESIZE";
    CursorDragType["Rotate"] = "ROTATE";
    CursorDragType["Scale"] = "SCALE";
    CursorDragType["Translate"] = "TRANSLATE";
    CursorDragType["Round"] = "ROUND";
})(CursorDragType = exports.CursorDragType || (exports.CursorDragType = {}));
var CursorType;
(function (CursorType) {
    CursorType["Normal"] = "NORMAL";
    CursorType["Selection"] = "SELECTION";
    CursorType["Sketch"] = "SKETCH";
})(CursorType = exports.CursorType || (exports.CursorType = {}));
var DEFAULT_POSITION = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    topPageX: 0,
    topPageY: 0,
    topClientX: 0,
    topClientY: 0,
};
var setCursorStyle = function (contentWindow, style) {
    var _a, _b, _c, _d;
    var currentRoot = (_b = (_a = document === null || document === void 0 ? void 0 : document.getElementsByTagName) === null || _a === void 0 ? void 0 : _a.call(document, 'html')) === null || _b === void 0 ? void 0 : _b[0];
    var root = (_d = (_c = contentWindow === null || contentWindow === void 0 ? void 0 : contentWindow.document) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('html')) === null || _d === void 0 ? void 0 : _d[0];
    if (root && root.style.cursor !== style) {
        root.style.cursor = style;
    }
    if (currentRoot && currentRoot.style.cursor !== style) {
        currentRoot.style.cursor = style;
    }
};
var calcPositionDelta = function (end, start) {
    return Object.keys(end || {}).reduce(function (buf, key) {
        if ((0, shared_1.isValidNumber)(end === null || end === void 0 ? void 0 : end[key]) && (0, shared_1.isValidNumber)(start === null || start === void 0 ? void 0 : start[key])) {
            buf[key] = end[key] - start[key];
        }
        else {
            buf[key] = end[key];
        }
        return buf;
    }, {});
};
var Cursor = /** @class */ (function () {
    function Cursor(engine) {
        this.type = CursorType.Normal;
        this.dragType = CursorDragType.Move;
        this.status = CursorStatus.Normal;
        this.position = DEFAULT_POSITION;
        this.dragAtomDelta = DEFAULT_POSITION;
        this.dragStartToCurrentDelta = DEFAULT_POSITION;
        this.dragStartToEndDelta = DEFAULT_POSITION;
        this.view = shared_1.globalThisPolyfill;
        this.engine = engine;
        this.makeObservable();
    }
    Cursor.prototype.makeObservable = function () {
        (0, reactive_1.define)(this, {
            type: reactive_1.observable.ref,
            dragType: reactive_1.observable.ref,
            status: reactive_1.observable.ref,
            position: reactive_1.observable.ref,
            dragStartPosition: reactive_1.observable.ref,
            dragEndPosition: reactive_1.observable.ref,
            dragAtomDelta: reactive_1.observable.ref,
            dragStartToCurrentDelta: reactive_1.observable.ref,
            dragStartToEndDelta: reactive_1.observable.ref,
            view: reactive_1.observable.ref,
            setStyle: reactive_1.action,
            setPosition: reactive_1.action,
            setStatus: reactive_1.action,
            setType: reactive_1.action,
        });
    };
    Object.defineProperty(Cursor.prototype, "speed", {
        get: function () {
            return Math.sqrt(Math.pow(this.dragAtomDelta.clientX, 2) +
                Math.pow(this.dragAtomDelta.clientY, 2));
        },
        enumerable: false,
        configurable: true
    });
    Cursor.prototype.setStatus = function (status) {
        this.status = status;
    };
    Cursor.prototype.setType = function (type) {
        this.type = type;
    };
    Cursor.prototype.setDragType = function (type) {
        this.dragType = type;
    };
    Cursor.prototype.setStyle = function (style) {
        this.engine.workbench.eachWorkspace(function (workspace) {
            setCursorStyle(workspace.viewport.contentWindow, style);
        });
    };
    Cursor.prototype.setPosition = function (position) {
        this.dragAtomDelta = calcPositionDelta(this.position, position);
        this.position = __assign({}, position);
        if (this.status === CursorStatus.Dragging) {
            this.dragStartToCurrentDelta = calcPositionDelta(this.position, this.dragStartPosition);
        }
    };
    Cursor.prototype.setDragStartPosition = function (position) {
        if (position) {
            this.dragStartPosition = __assign({}, position);
        }
        else {
            this.dragStartPosition = null;
            this.dragStartToCurrentDelta = DEFAULT_POSITION;
        }
    };
    Cursor.prototype.setDragEndPosition = function (position) {
        if (!this.dragStartPosition)
            return;
        if (position) {
            this.dragEndPosition = __assign({}, position);
            this.dragStartToEndDelta = calcPositionDelta(this.dragStartPosition, this.dragEndPosition);
        }
        else {
            this.dragEndPosition = null;
            this.dragStartToEndDelta = DEFAULT_POSITION;
        }
    };
    return Cursor;
}());
exports.Cursor = Cursor;
