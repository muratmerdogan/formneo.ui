import { PermissionLevel, ScreenPermission } from "./types";

type PermissionState = Record<string, ScreenPermission>; // key: screenId

// In-memory, volatile state (design-time only)
let memoryState: PermissionState = {};

export function getScreenPermission(screenId: string): ScreenPermission | undefined {
    return memoryState[screenId];
}

export function upsertScreenPermission(entry: ScreenPermission): void {
    memoryState = { ...memoryState, [entry.screenId]: entry };
}

export function listAllScreenPermissions(): ScreenPermission[] {
    return Object.values(memoryState);
}

export function removeScreenPermission(screenId: string): void {
    const { [screenId]: _, ...rest } = memoryState;
    memoryState = rest;
}

export function resolveUserLevel(screenId: string, userId?: string): PermissionLevel {
    const entry = getScreenPermission(screenId);
    if (!entry) return "full"; // fallback: full if not configured
    if (userId && entry.overrides[userId]) return entry.overrides[userId];
    return entry.defaultLevel;
}


