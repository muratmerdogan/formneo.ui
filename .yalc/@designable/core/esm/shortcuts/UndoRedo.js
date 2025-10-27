import { KeyCode, Shortcut } from '../models';
export var UndoMutation = new Shortcut({
    codes: [
        [KeyCode.Meta, KeyCode.Z],
        [KeyCode.Control, KeyCode.Z],
    ],
    handler: function (context) {
        var workspace = context === null || context === void 0 ? void 0 : context.workspace;
        if (workspace) {
            workspace.history.undo();
        }
        workspace.operation.hover.clear();
    },
});
export var RedoMutation = new Shortcut({
    codes: [
        [KeyCode.Meta, KeyCode.Shift, KeyCode.Z],
        [KeyCode.Control, KeyCode.Shift, KeyCode.Z],
    ],
    handler: function (context) {
        var workspace = context === null || context === void 0 ? void 0 : context.workspace;
        if (workspace) {
            workspace.history.redo();
        }
        workspace.operation.hover.clear();
    },
});
