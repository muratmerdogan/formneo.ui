import { useQuery, useMutation, useQueryClient } from "react-query";
import { getCategoryBundle, listCategories, saveValues, listParameters, createCategory, updateCategory, deleteCategory, createParameter, updateParameter, deleteParameter } from "./service";
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

// Admin hooks
export function useListParameters(categoryId?: string) {
    return useQuery(["settings", "admin", "parameters", categoryId], () => listParameters(categoryId));
}

export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation(createCategory, {
        onSuccess: () => {
            qc.invalidateQueries(["settings", "categories"]);
        }
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation(({ id, changes }: { id: string; changes: any }) => updateCategory(id, changes), {
        onSuccess: () => {
            qc.invalidateQueries(["settings", "categories"]);
        }
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation(deleteCategory, {
        onSuccess: () => {
            qc.invalidateQueries(["settings", "categories"]);
        }
    });
}

export function useCreateParameter() {
    const qc = useQueryClient();
    return useMutation(createParameter, {
        onSuccess: () => {
            qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "settings" });
        }
    });
}

export function useUpdateParameter() {
    const qc = useQueryClient();
    return useMutation(({ id, changes }: { id: string; changes: any }) => updateParameter(id, changes), {
        onSuccess: () => {
            qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "settings" });
        }
    });
}

export function useDeleteParameter() {
    const qc = useQueryClient();
    return useMutation(deleteParameter, {
        onSuccess: () => {
            qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "settings" });
        }
    });
}


