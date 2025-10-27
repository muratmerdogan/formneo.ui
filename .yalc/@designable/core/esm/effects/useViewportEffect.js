import { ViewportResizeEvent, ViewportScrollEvent } from '../events';
export var useViewportEffect = function (engine) {
    engine.subscribeTo(ViewportResizeEvent, function (event) {
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
    engine.subscribeTo(ViewportScrollEvent, function (event) {
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
