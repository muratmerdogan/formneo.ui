import { useCallback, useMemo, useState } from "react";
import { PermissionCheckAction, PermissionLevel, ScreenPermission } from "./types";
import { getScreenPermission, resolveUserLevel, upsertScreenPermission } from "./storage";
import { ActionsMask } from "./actions";

export function usePermissions(screenId: string, currentUserId?: string) {
    const [permission, setPermission] = useState<ScreenPermission | undefined>(() => getScreenPermission(screenId));

    const level: PermissionLevel = useMemo(() => resolveUserLevel(screenId, currentUserId), [screenId, currentUserId, permission]);

    // Geçici: seviye bazlı değerlendirme (mask backend’e taşındı)
    const can = useMemo(() => ({
        view: level === "view" || level === "create_edit" || level === "delete" || level === "full",
        create: level === "create_edit" || level === "full",
        edit: level === "create_edit" || level === "full",
        delete: level === "delete" || level === "full",
        full: level === "full",
    }), [level]);

    const check = useCallback((action: PermissionCheckAction) => {
        switch (action) {
            case "view": return can.view;
            case "create": return can.create;
            case "edit": return can.edit;
            case "delete": return can.delete;
            default: return false;
        }
    }, [can]);

    const save = useCallback((entry: ScreenPermission) => {
        upsertScreenPermission(entry);
        setPermission(entry);
    }, []);

    return { level, can, check, permission, save };
}


