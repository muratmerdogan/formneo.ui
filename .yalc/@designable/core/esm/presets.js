import { DragDropDriver, MouseClickDriver, MouseMoveDriver, ViewportResizeDriver, ViewportScrollDriver, KeyboardDriver, } from './drivers';
import { useCursorEffect, useViewportEffect, useDragDropEffect, useSelectionEffect, useResizeEffect, useKeyboardEffect, useAutoScrollEffect, useWorkspaceEffect, useFreeSelectionEffect, useContentEditableEffect, useTranslateEffect, } from './effects';
import { SelectNodes, SelectAllNodes, SelectSameTypeNodes, DeleteNodes, CopyNodes, PasteNodes, UndoMutation, RedoMutation, CursorSwitchSelection, PreventCommandX, SelectPrevNode, SelectNextNode, } from './shortcuts';
export var DEFAULT_EFFECTS = [
    useFreeSelectionEffect,
    useCursorEffect,
    useViewportEffect,
    useDragDropEffect,
    useSelectionEffect,
    useKeyboardEffect,
    useAutoScrollEffect,
    useWorkspaceEffect,
    useContentEditableEffect,
    useTranslateEffect,
    useResizeEffect,
];
export var DEFAULT_DRIVERS = [
    MouseMoveDriver,
    DragDropDriver,
    MouseClickDriver,
    ViewportResizeDriver,
    ViewportScrollDriver,
    KeyboardDriver,
];
export var DEFAULT_SHORTCUTS = [
    PreventCommandX,
    SelectNodes,
    SelectAllNodes,
    SelectSameTypeNodes,
    DeleteNodes,
    CopyNodes,
    PasteNodes,
    SelectPrevNode,
    SelectNextNode,
    UndoMutation,
    RedoMutation,
    CursorSwitchSelection,
];
