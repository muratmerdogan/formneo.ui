import { useQuery, useMutation, useQueryClient } from "react-query";
import { getCategoryBundle, listCategories, saveValues } from "./service";
import { SettingsBundle, SettingsScope } from "./types";

export function useSettingsCategories() {
    return useQuery(["settings", "categories"], listCategories);
}

export function useSettingsBundle(categoryId: string, scope: SettingsScope) {
    return useQuery<SettingsBundle>(["settings", "bundle", categoryId, scope.type, scope.id], () => getCategoryBundle(categoryId, scope), {
        enabled: Boolean(categoryId),
    });
}

export function useSaveSettings(categoryId: string, scope: SettingsScope) {
    const qc = useQueryClient();
    return useMutation((data: Record<string, unknown>) => saveValues(categoryId, scope, data), {
        onSuccess: () => {
            qc.invalidateQueries(["settings", "bundle", categoryId, scope.type, scope.id]);
        }
    });
}


