import { PermissionsApi } from "api/generated/api";
import getConfiguration from "confiuration";

export type UpsertAllPayload = {
    resource: {
        resourceKey: string;
        actions?: ("View" | "Create" | "Update" | "Delete" | "Export")[];
        mask?: number;
    };
    users: { userId: string; allowedMask: number; deniedMask: number }[];
};

export async function upsertAllPermissions(payload: UpsertAllPayload): Promise<void> {
    const api = new PermissionsApi(getConfiguration());
    await api.apiPermissionsUpsertAllPost(payload as any);
}

export async function getPermissionsByResource(resourceKey: string): Promise<any | null> {
    try {
        const api = new PermissionsApi(getConfiguration());
        const res = await api.apiPermissionsByResourceResourceKeyGet(resourceKey);
        return (res as any)?.data || null;
    } catch {
        return null;
    }
}


