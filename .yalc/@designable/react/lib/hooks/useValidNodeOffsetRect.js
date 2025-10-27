"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidNodeOffsetRect = void 0;
var react_1 = require("react");
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var useViewport_1 = require("./useViewport");
var useDesigner_1 = require("./useDesigner");
var isEqualRect = function (rect1, rect2) {
    return ((rect1 === null || rect1 === void 0 ? void 0 : rect1.x) === (rect2 === null || rect2 === void 0 ? void 0 : rect2.x) &&
        (rect1 === null || rect1 === void 0 ? void 0 : rect1.y) === (rect2 === null || rect2 === void 0 ? void 0 : rect2.y) &&
        (rect1 === null || rect1 === void 0 ? void 0 : rect1.width) === (rect2 === null || rect2 === void 0 ? void 0 : rect2.width) &&
        (rect1 === null || rect1 === void 0 ? void 0 : rect1.height) === (rect2 === null || rect2 === void 0 ? void 0 : rect2.height));
};
var useValidNodeOffsetRect = function (node) {
    var engine = (0, useDesigner_1.useDesigner)();
    var viewport = (0, useViewport_1.useViewport)();
    var _a = __read((0, react_1.useState)(null), 2), forceUpdate = _a[1];
    var rectRef = (0, react_1.useMemo)(function () { return ({ current: viewport.getValidNodeOffsetRect(node) }); }, [viewport]);
    var element = viewport.findElementById(node === null || node === void 0 ? void 0 : node.id);
    var compute = (0, react_1.useCallback)(function () {
        if (engine.cursor.status !== core_1.CursorStatus.Normal &&
            engine.cursor.dragType === core_1.CursorDragType.Move)
            return;
        var nextRect = viewport.getValidNodeOffsetRect(node);
        if (!isEqualRect(rectRef.current, nextRect) && nextRect) {
            rectRef.current = nextRect;
            forceUpdate([]);
        }
    }, [viewport, node]);
    (0, react_1.useEffect)(function () {
        var layoutObserver = new shared_1.LayoutObserver(compute);
        if (element)
            layoutObserver.observe(element);
        return function () {
            layoutObserver.disconnect();
        };
    }, [node, viewport, element]);
    return rectRef.current;
};
exports.useValidNodeOffsetRect = useValidNodeOffsetRect;
