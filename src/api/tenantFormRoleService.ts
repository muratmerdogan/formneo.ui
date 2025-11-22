import axios from "axios";
import getConfiguration, { getAccessToken } from "confiuration";
import { FormDataApi, RoleTenantFormApi, UserApi, UserTenantFormRolesApi } from "api/generated";

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


// Kullanıcının FormTenantRole’lerinden türetilen erişilebilir form listesini getirir
export async function fetchUserAllowedFormsViaRoles(userId?: string): Promise<Array<{ formId: string; formName: string }>> {
  try {
    const conf = getConfiguration();
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const ua = new UserApi(conf);
      const me = await ua.apiUserGetLoginUserDetailGet();
      effectiveUserId = String((me as any)?.data?.id || (me as any)?.data?.userId || "");
      if (!effectiveUserId) return [];
    }

    const utfApi = new UserTenantFormRolesApi(conf);
    const assigned = await utfApi.apiUserTenantFormRolesByUserIdGet(effectiveUserId);
    const roleIds: string[] = ((assigned as any)?.data || []).map((x: any) => String(x.formTenantRoleId)).filter(Boolean);
    if (!roleIds.length) return [];

    // Her rol için detay çek ve formId’leri topla
    const roleDetails = await Promise.all(
      roleIds.map((id: string): Promise<any> => fetchTenantFormRoleDetail(id).catch((e: any): any => null))
    );
    const formIdsSet = new Set<string>();
    for (const d of roleDetails) {
      const perms = Array.isArray(d?.formPermissions) ? d.formPermissions : [];
      perms.forEach((p: any) => {
        const fid = String(p?.formId || "");
        if (fid) formIdsSet.add(fid);
      });
    }
    const formIds = Array.from(formIdsSet);
    if (!formIds.length) return [];

    // Form adlarını almak için tek tek detail çek (alternatif toplu uç yoksa)
    const fapi = new FormDataApi(conf);
  const forms: Array<{ formId: string; formName: string }> = await Promise.all(
      formIds.map(async (fid) => {
        try {
          const res = await fapi.apiFormDataIdGet(fid);
          const name = String((res as any)?.data?.formName || (res as any)?.data?.name || fid);
          return { formId: fid, formName: name };
        } catch {
          return { formId: fid, formName: fid };
        }
      })
    );
    // İsme göre sıralı döndür
    return forms.sort((a: { formId: string; formName: string }, b: { formId: string; formName: string }) => a.formName.localeCompare(b.formName, "tr"));
  } catch {
    return [];
  }
}


