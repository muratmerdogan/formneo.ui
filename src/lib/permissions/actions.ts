export enum ActionsMask {
    None = 0,
    View = 1 << 0,
    Create = 1 << 1,
    Update = 1 << 2,
    Delete = 1 << 3,
    Export = 1 << 4,
}

export const FullMask: number = ActionsMask.View | ActionsMask.Create | ActionsMask.Update | ActionsMask.Delete | ActionsMask.Export;

export type ActionKey = "View" | "Create" | "Update" | "Delete" | "Export";

export const ACTION_KEYS: ActionKey[] = ["View", "Create", "Update", "Delete", "Export"];

export function toMask(actions: ActionKey[]): number {
    return actions.reduce((mask, a) => mask | ActionsMask[a], 0);
}

export function fromMask(mask: number): ActionKey[] {
    return ACTION_KEYS.filter((k) => (mask & ActionsMask[k]) > 0);
}

export function maskHas(mask: number, key: ActionKey): boolean {
    return (mask & ActionsMask[key]) > 0;
}

export function maskToggle(mask: number, key: ActionKey): number {
    const bit = ActionsMask[key];
    return (mask & bit) > 0 ? (mask & ~bit) : (mask | bit);
}

// Numeric actions helpers (server may expect numeric enum values)
const ACTION_NUMS = [ActionsMask.View, ActionsMask.Create, ActionsMask.Update, ActionsMask.Delete, ActionsMask.Export];

export function toNumericActions(mask: number): number[] {
    return ACTION_NUMS.filter((bit) => (mask & bit) > 0);
}

export function numbersToMask(values: number[]): number {
    const allowed = new Set(ACTION_NUMS);
    return (values || []).reduce((acc, v) => acc | (allowed.has(v) ? v : 0), 0);
}


