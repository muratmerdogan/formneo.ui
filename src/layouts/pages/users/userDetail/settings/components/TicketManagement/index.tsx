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
    workCompanyId: workCompanyIdV,
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

  return null;
}

export default TicketManagement;
