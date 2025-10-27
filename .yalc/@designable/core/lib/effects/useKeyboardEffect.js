"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardEffect = void 0;
var events_1 = require("../events");
var useKeyboardEffect = function (engine) {
    engine.subscribeTo(events_1.KeyDownEvent, function (event) {
        var keyboard = engine.keyboard;
        if (!keyboard)
            return;
        var workspace = engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
        keyboard.handleKeyboard(event, workspace.getEventContext());
    });
    engine.subscribeTo(events_1.KeyUpEvent, function (event) {
        var keyboard = engine.keyboard;
        if (!keyboard)
            return;
        var workspace = engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
        keyboard.handleKeyboard(event, workspace.getEventContext());
    });
};
exports.useKeyboardEffect = useKeyboardEffect;
