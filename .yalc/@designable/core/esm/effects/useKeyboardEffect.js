import { KeyDownEvent, KeyUpEvent } from '../events';
export var useKeyboardEffect = function (engine) {
    engine.subscribeTo(KeyDownEvent, function (event) {
        var keyboard = engine.keyboard;
        if (!keyboard)
            return;
        var workspace = engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
        keyboard.handleKeyboard(event, workspace.getEventContext());
    });
    engine.subscribeTo(KeyUpEvent, function (event) {
        var keyboard = engine.keyboard;
        if (!keyboard)
            return;
        var workspace = engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
        keyboard.handleKeyboard(event, workspace.getEventContext());
    });
};
