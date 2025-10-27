import { CursorType, KeyCode, Shortcut } from '../models';
export var CursorSwitchSelection = new Shortcut({
    codes: [KeyCode.Shift, KeyCode.S],
    handler: function (context) {
        var engine = context === null || context === void 0 ? void 0 : context.engine;
        if (engine) {
            engine.cursor.setType(CursorType.Selection);
        }
    },
});
