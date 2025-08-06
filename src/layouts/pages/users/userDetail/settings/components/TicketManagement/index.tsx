import { jsx } from "@emotion/react";
import { Autocomplete, Card, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { MessageBoxType } from "@ui5/webcomponents-react";
import {
  IdentityRole,
  PositionListDto,
  PositionsApi,
  RoleMenuApi,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
  UserApi,
  UserAppDtoWithoutPhoto,
  WorkCompanyApi,
  WorkCompanyDto,
} from "api/generated";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import getConfiguration from "confiuration";
import { useFormikContext } from "formik";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import React, { useEffect, useState } from "react";

interface ILevels {
  id: number;
  name: string;
  description: string;
}

function TicketManagement({ formData }: any): JSX.Element {
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const { setFieldValue } = useFormikContext();
  const { values } = formData;
  const {
    roleIds: roleIdsV,
    ticketDepartmentId: ticketDepartmentIdV,
    workCompanyId: workCompanyIdV,
    hasTicketPermission: hasTicketPermissionV,
    hasDepartmentPermission: hasDepartmentPermissionV,
    hasOtherCompanyPermission: hasOtherCompanyPermissionV,
    hasOtherDeptCalendarPerm: hasOtherDeptCalendarPermV,
    canEditTicket: canEditTicketV,
    dontApplyDefaultFilters: dontApplyDefaultFiltersV,
    positionId: positionIdV,
    userLevel: userLevelV,
    mainManagerUserAppId: mainManagerUserAppIdV,
  } = values;

  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [usersData, setUsersData] = useState<UserAppDtoWithoutPhoto[]>([]);
  const [roleData, setRoleData] = useState<IdentityRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const [companies, setCompanies] = useState<WorkCompanyDto[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<WorkCompanyDto | null>(null);
  const [positionData, setPositionData] = useState<PositionListDto[]>([]);
  const [userLevelData, setUserLevelData] = useState<ILevels[]>([]);

  const fetchDepartment = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new TicketDepartmentsApi(conf);
      const response = await api.apiTicketDepartmentsAllOnlyNameGet();
      setDepartmentData(response.data);
    } catch (error) {
      dispatchAlert({ message: "Departman alınamadı, " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchUsers = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new UserApi(conf);
      const response = await api.apiUserGetAllUsersNameIdOnlyGet();
      setUsersData(response.data);
    } catch (error) {
      dispatchAlert({ message: "Kullanıcılar alınamadı, " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchRoles = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new RoleMenuApi(conf);
      const response = await api.apiRoleMenuAllOnlyHeadGet();

      setRoleData(response.data);
    } catch (error) {
      dispatchAlert({ message: "Yetki seviyesi alınamadı, " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchCompany = async () => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyApi(conf);
      var response = await api.apiWorkCompanyGet();
      setCompanies(response.data);
    } catch (error) {
      dispatchAlert({ message: "Şirket alınamadı, " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchPosition = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new PositionsApi(conf);
      const response = await api.apiPositionsGet();
      setPositionData(response.data);
    } catch (error) {
      dispatchAlert({ message: "Pozisyon alınamadı, " + error, type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const fetchUserLevel = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new UserApi(conf);
      const response = await api.apiUserUserLevelsGet();
      setUserLevelData(response.data as any);


    } catch (error) {
      console.log("error", error)
    }
  }

  const handleTicketLevel = (event: any, newValues: any) => {
    if (!newValues) {
      dispatchAlert({ message: "Yetki seviyesi seçilemedi", type: MessageBoxType.Error });
      return;
    }
    setFieldValue("roleIds", newValues);
  };

  const handleDepartment = (event: any, newValue: any) => {
    if (newValue === null) {
      dispatchAlert({ message: "Departman seçilemedi", type: MessageBoxType.Error });
      return;
    }
    setFieldValue("ticketDepartmentId", newValue);
  };

  const handleManagers = (event: any, newValue: any) => {
    if (newValue === null) {
      setFieldValue("mainManagerUserAppId", null);
      return;
    }
    setFieldValue("mainManagerUserAppId", newValue.id);
  };

  const handleUserLevel = (event: any, newValue: any) => {
    if (newValue === null) {
      dispatchAlert({ message: "Yetki seviyesi seçilemedi", type: MessageBoxType.Error });
      return;
    }
    setFieldValue("userLevel", newValue.id);
  }

  const handleCompany = (event: any, newValue: any) => {
    if (newValue === null) {
      dispatchAlert({ message: "Şirket seçilemedi", type: MessageBoxType.Error });
      return;
    }
    setFieldValue("workCompanyId", newValue.id);
  };

  const handlePosition = (event: any, newValue: any) => {
    if (newValue === null) {
      setFieldValue("positionId", null);
      return;
    }
    setFieldValue("positionId", newValue.id);


  };


  useEffect(() => {

  }, [values]);

  useEffect(() => {
    if (companies.length > 0 && values.workCompanyId) {
      setSelectedCompany(companies.find((company: any) => company.id === values.workCompanyId));
    }
  }, [companies, values.workCompanyId]);

  useEffect(() => {
    const newRoleIdsNames = roleData
      .map((icon: any) => {
        const foundRole = values.roleIds.find((role: any) => role.roleId === icon.id);
        return foundRole ? { roleId: icon.id, roleName: icon.name } : null;
      })
      .filter(Boolean);
    setSelectedRoles(newRoleIdsNames.map((role: any) => role.roleName));
  }, [values.roleIds]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        dispatchBusy({ isBusy: true });
        await Promise.all([fetchCompany(), fetchDepartment(), fetchUsers(), fetchRoles(), fetchPosition(), fetchUserLevel()]);
      } catch (error) {
        dispatchAlert({ message: "Veriler yüklenirken hata oluştu", type: MessageBoxType.Error });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };

    fetchAllData();
  }, []);

  return (
    <Card id="ticket-management">
      <MDBox p={3} lineHeight={1}>
        <MDBox>
          <MDTypography variant="h5">Ticket Management</MDTypography>
        </MDBox>

        <MDTypography variant="button" color="text">
          In this card you can control management roles of tickets.
        </MDTypography>
        <MDBox mt={4}>
          <MDTypography variant="button" color="text">
            <MDTypography component="span">{values.firstName}</MDTypography>&nbsp; için görüntüleme
            yetkisi seviyesini belirleyebilirsiniz.:
          </MDTypography>
          <MDBox mt={2}>
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              multiple
              options={roleData.map((role) => role.name)} // Options olarak sadece isimleri veriyoruz
              getOptionLabel={(option) => option} // İsimleri geri döndürüyoruz
              value={selectedRoles}
              onChange={(event, newValues) => {
                if (!newValues) return;

                const newRoleIdsNames = newValues
                  .map((roleName) => {
                    const foundRole = roleData.find((role) => role.name === roleName);
                    return foundRole ? { roleId: foundRole.id, roleName: roleName } : null;
                  })
                  .filter(Boolean);

                console.log("newRoleIds", newRoleIdsNames);
                handleTicketLevel(event, newRoleIdsNames);

                // 1. Önceki seçimleri koru
                const currentSelectedRoles = [...selectedRoles];

                // 2. Yeni seçilenleri ekle (eğer zaten seçilmemişse)
                newValues.forEach((newValue) => {
                  if (!currentSelectedRoles.includes(newValue)) {
                    currentSelectedRoles.push(newValue);
                  }
                });

                // 3. Çıkarılanları temizle
                const updatedSelectedRoles = currentSelectedRoles.filter((selectedValue) =>
                  newValues.includes(selectedValue)
                );

                setSelectedRoles(updatedSelectedRoles);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Yetki Seviyesi"
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
            />
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              options={departmentData}
              getOptionLabel={(option) => option.departmentText}
              value={departmentData.find((dept) => dept.id === values.ticketDepartmentId) || null}
              onChange={(event, newValue) => {
                if (!newValue) return;
                handleDepartment(event, newValue.id);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Departman"
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
            />
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              options={usersData}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              value={usersData.find((user) => user.id === values.mainManagerUserAppId) || null}
              onChange={(event, newValue) => {

                handleManagers(event, newValue);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Asıl Yönetici"
                  fullWidth
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
            />
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              options={companies}
              getOptionLabel={(option: any) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedCompany || null}
              onChange={(event, newValue) => {
                if (!newValue) return;
                handleCompany(event, newValue);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Şirket Adı"
                  fullWidth
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}

                />
              )}
            />
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              options={positionData}
              getOptionLabel={(option) => option.name}
              value={positionData.find((position) => position.id === values.positionId) || null}
              onChange={(event, newValue) => {

                handlePosition(event, newValue);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Pozisyon Adı"
                  fullWidth
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
            />
            <Autocomplete
              sx={{
                mb: 3.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              options={userLevelData}
              getOptionLabel={(option) => option.description}
              value={userLevelData.find((level) => level.id === values.userLevel) || null}
              onChange={(event, newValue) => {
                if (!newValue) return;
                handleUserLevel(event, newValue);
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  variant="outlined"
                  label="Kullanıcı Seviyesi"
                  inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                />
              )}
            />

            <FormControlLabel
              label="Başkası adına ticket oluşturma yetkisi"
              control={
                <Checkbox
                  checked={hasTicketPermissionV}
                  onChange={(event, newValue) => {
                    setFieldValue("hasTicketPermission", newValue);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Departmanımda oluşturulan tüm talepleri görebilme"
              control={
                <Checkbox
                  checked={hasDepartmentPermissionV}
                  onChange={(event, newValue) => {
                    setFieldValue("hasDepartmentPermission", newValue);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Başka şirketlerdeki talepleri görebilme yetkisi"
              control={
                <Checkbox
                  checked={hasOtherCompanyPermissionV}
                  onChange={(event, newValue) => {
                    setFieldValue("hasOtherCompanyPermission", newValue);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Ekip planlama sayfasında departman seçebilme yetkisi"
              control={
                <Checkbox
                  checked={hasOtherDeptCalendarPermV}
                  onChange={(event, newValue) => {
                    setFieldValue("hasOtherDeptCalendarPerm", newValue);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Talep düzenleyebilme yetkisi (Oluşturulan talepler için)"
              control={
                <Checkbox
                  checked={canEditTicketV}
                  onChange={(event, newValue) => {
                    setFieldValue("canEditTicket", newValue);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Varsayılan filtreleri uygulama"
              control={
                <Checkbox
                  checked={dontApplyDefaultFiltersV}
                  onChange={(event, newValue) => {
                    setFieldValue("dontApplyDefaultFilters", newValue);
                  }}
                />
              }
            />
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default TicketManagement;
