"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViewportEffect = void 0;
var events_1 = require("../events");
var useViewportEffect = function (engine) {
    engine.subscribeTo(events_1.ViewportResizeEvent, function (event) {
        var _a;
        var currentWorkspace = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace;
        if (!currentWorkspace)
            return;
        var viewport = currentWorkspace.viewport;
        var outline = currentWorkspace.outline;
        if (viewport.matchViewport(event.data.target)) {
            viewport.digestViewport();
        }
        if (outline.matchViewport(event.data.target)) {
            outline.digestViewport();
        }
    });
    engine.subscribeTo(events_1.ViewportScrollEvent, function (event) {
        var _a;
        var currentWorkspace = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace;
        if (!currentWorkspace)
            return;
        var viewport = currentWorkspace.viewport;
        var outline = currentWorkspace.outline;
        if (viewport.matchViewport(event.data.target)) {
            viewport.digestViewport();
        }
        if (outline.matchViewport(event.data.target)) {
            outline.digestViewport();
        }
    });
};
exports.useViewportEffect = useViewportEffect;
