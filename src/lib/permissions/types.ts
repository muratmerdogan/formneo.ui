export type PermissionLevel = "none" | "view" | "create_edit" | "delete" | "full";

export type ScreenPermission = {
    screenId: string;
    defaultLevel: PermissionLevel;
    overrides: Record<string, PermissionLevel>; // key: userId -> level
    updatedAt?: string;
    updatedBy?: string;
};

export type PermissionCheckAction = "view" | "create" | "edit" | "delete";


