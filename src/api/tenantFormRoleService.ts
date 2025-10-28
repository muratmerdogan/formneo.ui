import axios from "axios";
import getConfiguration, { getAccessToken } from "confiuration";
import { FormDataApi, RoleTenantFormApi } from "api/generated";

function getAuthHeaders() {
  const token = getAccessToken();
  const tenantId = localStorage.getItem("selectedTenantId") || "";
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "X-Tenant-Id": tenantId,
  } as any;
}

export async function fetchLatestFormsPerFamily(): Promise<any[]> {
  const api = new FormDataApi(getConfiguration());
  const res = await api.apiFormDataLatestPerFamilyGet();
  return (res as any)?.data || [];
}

export async function fetchTenantFormAssignments(roleId: string, tenantId: string): Promise<string[]> {
  // Yeni yapıda doğrudan role/tenant bazlı get olmayabilir; list'ten filtrele
  const all = await fetchTenantFormRoleList();
  const role = (all as any[]).find((x) => String(x.id || x.formTenantRoleId) === String(roleId));
  if (!role) return [];
  const perms = role.formPermissions || [];
  return perms.map((p: any) => String(p.formId)).filter(Boolean);
}

// Not: Eski bulk-save kaldırıldı; insert/update kullanılıyor

// Yeni yapı: explicit insert/update uçları
export async function insertTenantFormAssignments(params: { roleName: string; formIds: string[]; }): Promise<void> {
  const base = process.env.REACT_APP_BASE_PATH || "";
  const url = `${base}/api/RoleTenantForm/insert`;
  const body = {
    roleName: params.roleName,
    formPermissions: (params.formIds || []).map((formId) => ({ formId, canView: true })),
  } as any;
  await axios.post(url, body, { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } });
}

export async function updateTenantFormAssignments(params: { roleId: string; roleName: string; formIds: string[]; roleDescription?: string; roleIsActive?: boolean; }): Promise<void> {
  // Generated API: RoleTenantFormUpdateDto
  const api = new RoleTenantFormApi(getConfiguration());
  const dto: any = {
    formTenantRoleId: params.roleId,
    roleName: params.roleName,
    roleDescription: params.roleDescription ?? undefined,
    roleIsActive: params.roleIsActive ?? true,
    formPermissions: (params.formIds || []).map((formId) => ({ formId, canView: true })),
  };
  await api.apiRoleTenantFormUpdatePost(dto as any);
}

export async function fetchTenantFormRoleList(): Promise<any[]> {
  const base = process.env.REACT_APP_BASE_PATH || "";
  // Tek controller: GET /api/RoleTenantForm (tenant context header ile)
  const url = `${base}/api/RoleTenantForm`;
  const res = await axios.get(url, { headers: getAuthHeaders() });
  const data = (res as any)?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function fetchTenantFormRoleDetail(formTenantRoleId: string): Promise<any> {
  const api = new RoleTenantFormApi(getConfiguration());
  const res = await api.apiRoleTenantFormFormTenantRoleIdGet(formTenantRoleId);
  // Generated type shows Array<RoleTenantFormListDto>; if backend returns DetailDto, map accordingly
  return (res as any)?.data;
}


