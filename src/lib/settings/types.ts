export type SettingsScopeType = "global" | "tenant" | "environment" | "user";

export type SettingsScope = {
    type: SettingsScopeType;
    id?: string; // tenantId, envName, userId
};

export type SettingsCategory = {
    id: string; // slug
    name: string;
    description?: string;
    orderNo?: number;
};

export type ParameterType = "string" | "number" | "boolean" | "select" | "multiselect" | "json";

export type ParameterOption = { value: string; label: string };

export type SettingsParameter = {
    id: string; // slug
    categoryId: string;
    name: string;
    description?: string;
    type: ParameterType;
    required?: boolean;
    defaultValue?: unknown;
    options?: ParameterOption[]; // select/multiselect
    orderNo?: number;
};

export type ParameterValue = {
    parameterId: string;
    scope: SettingsScope;
    value: unknown;
    isOverridden?: boolean;
    updatedAt?: string;
    updatedBy?: string;
};

export type SettingsBundle = {
    category: SettingsCategory;
    parameters: SettingsParameter[];
    values: Record<string, ParameterValue | undefined>; // key: parameterId
};


