import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, forwardRef, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  Divider,
  Tooltip,
  DialogContent,
  DialogTitle,
  Dialog,
  Pagination,
  Autocomplete,
} from "@mui/material";
import MDButton from "components/MDButton";
import QueryBuilder, { Field, formatQuery, RuleGroupType, ValueSelector } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Icon } from "@mui/material";
import "../css/queryDetail.css";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { MessageBoxType, RadioButton } from "@ui5/webcomponents-react";
import CustomMessageBox from "layouts/pages/Components/CustomMessageBox";
import { DragIndicator } from "@mui/icons-material";
import { content, fields, operators } from "../data/content";
import {
  TicketTeamApi,
  UserApi,
  UserAppDtoOnlyNameId,
  TicketTeamListDto,
  WorkFlowDefinationListDto,
  TicketDepartmensListDto,
  TicketRuleEngineInsertDto,
  TicketRuleEngineApi,
} from "api/generated/api";
import getConfiguration from "confiuration";
import {
  UserData,
  TeamData,
  WorkFlowData,
  TicketStatusData,
  TicketPriorityData,
  TicketTypeData,
  TicketSlaData,
  TicketSubjectData,
  TicketClientData,
  TicketCompanyData,
  WorkCompanyIdSystemData,
} from "../controller";
import MDInput from "components/MDInput";
import { TabMenu } from "primereact/tabmenu";
import {
  fetchTeamData,
  fetchTicketDepartmentData,
  fetchTicketRuleEngineData,
  fetchUserData,
  fetchWorkFlowData,
  fetchWorkCompanySystemData,
} from "../controller/custom/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function QueryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const { t } = useTranslation();
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [isQuestionMessageBoxOpenExport, setIsQuestionMessageBoxOpenExport] = useState(false);
  const [isQuestionMessageBoxOpenInfo, setIsQuestionMessageBoxOpenInfo] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCustomerRefId, setSelectedCustomerRefId] = useState("");

  const [userFields, setUserFields] = useState<Field[]>([]);
  const [teamFields, setTeamFields] = useState<Field[]>([]);
  const [workFlowFields, setWorkFlowFields] = useState<Field[]>([]);
  const [statusFields, setStatusFields] = useState<Field[]>([]);
  const [priorityFields, setPriorityFields] = useState<Field[]>([]);
  const [typeFields, setTypeFields] = useState<Field[]>([]);
  const [slaFields, setSlaFields] = useState<Field[]>([]);
  const [subjectFields, setSubjectFields] = useState<Field[]>([]);
  const [clientFields, setClientFields] = useState<Field[]>([]);
  const [companyFields, setCompanyFields] = useState<Field[]>([]);
  const [userMailFields, setUserMailFields] = useState<Field[]>([]);
  const [workCompanySystemInfo, setWorkCompanySystemInfo] = useState<Field[]>([]);

  const [queryName, setQueryName] = useState<string>("");
  const [actionUsers, setActionUsers] = useState<UserAppDtoOnlyNameId[] | null>(null);
  const [selectedActionUser, setSelectedActionUser] = useState<UserAppDtoOnlyNameId | null>(null);
  const [actionTeams, setActionTeams] = useState<TicketTeamListDto[] | null>(null);
  const [selectedActionTeam, setSelectedActionTeam] = useState<TicketTeamListDto | null>(null);
  const [actionWorkFlows, setActionWorkFlows] = useState<any[]>([]);
  const [selectedActionWorkFlow, setSelectedActionWorkFlow] = useState<any>(null);
  const [actionDepartments, setActionDepartments] = useState<TicketDepartmensListDto[] | null>(
    null
  );
  const [selectedActionDepartment, setSelectedActionDepartment] =
    useState<TicketDepartmensListDto | null>(null);
  const [userOrTeam, setUserOrTeam] = useState<string>("");

  const [activeIndex, setActiveIndex] = useState(0);

  const [querOrdNum, setQuerOrdNum] = useState<number>(1);

  const [selectedRBValue, setSelectedRBValue] = useState(1);

  const items = [
    {
      label: t("ns1:QueryPage.QueryDetail.Sorgu"),
      icon: "pi pi-search",
      className: "custom-tab-item",
    },
    {
      label: t("ns1:QueryPage.QueryDetail.Atama"),
      icon: "pi pi-cog",
      className: "custom-tab-item",
    },
  ];

  // default query props set edilebilir
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  // veriler için loader fonksiyonları kullanılıyor
  const loadActionData = async (
    fetchFunction: any | null,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      if (!fetchFunction || typeof fetchFunction == "undefined" || fetchFunction == null) return;
      switch (fetchFunction) {
        case fetchWorkFlowData:
          const workFlowData = (
            await (await fetchWorkFlowData()).apiWorkFlowDefinationGetWorkFlowListByMenuGet()
          ).data as any;
          setStateFunction(workFlowData.data);
          break;
        case fetchTeamData:
          const teamData = (await (await fetchTeamData()).apiTicketTeamWithoutTeamGet()).data;
          setStateFunction(teamData);
          break;
        case fetchUserData:
          const userData = (await (await fetchUserData()).apiUserGetAllUsersNameIdOnlyGet()).data;
          setStateFunction(userData);
          break;
        case fetchTicketDepartmentData:
          const departmentData = (
            await (await fetchTicketDepartmentData()).apiTicketDepartmentsGet()
          ).data;
          setStateFunction(departmentData);
          break;
        default:
          break;
      }
    } catch (error) {
      dispatchAlert({
        message: `Error loading action data: ${error}`,
        type: MessageBoxType.Error,
      });
    }
  };

  // veriler için loader fonksiyonları kullanılıyor
  const loadFieldData = async (
    fetchFunction: any,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>,
    isEmail?: boolean
  ) => {
    try {
      const data = await fetchFunction(isEmail);
      // field type olduğu için [data] şeklinde set ediliyor
      setStateFunction([data]);
    } catch (error) {
      dispatchAlert({
        message: `Error loading field data: ${error}`,
        type: MessageBoxType.Error,
      });
    }
  };

  // Promise yapısı kullanarak optimize edilmiş fetching
  const loadAllDataOptimized = async () => {
    dispatchBusy({ isBusy: true });

    const fieldDataLoader = [
      { fetch: WorkFlowData, setState: setWorkFlowFields },
      { fetch: UserData, setState: setUserFields },
      { fetch: TeamData, setState: setTeamFields },
      { fetch: TicketStatusData, setState: setStatusFields },
      { fetch: TicketPriorityData, setState: setPriorityFields },
      { fetch: TicketTypeData, setState: setTypeFields },
      { fetch: TicketSlaData, setState: setSlaFields },
      { fetch: TicketSubjectData, setState: setSubjectFields },
      { fetch: TicketClientData, setState: setClientFields },
      { fetch: TicketCompanyData, setState: setCompanyFields },
      { fetch: UserData, setState: setUserMailFields, isEmail: true },
      ...(selectedCustomerRefId !== ""
        ? [
            {
              fetch: () => WorkCompanyIdSystemData(selectedCustomerRefId),
              setState: setWorkCompanySystemInfo,
            },
          ]
        : []),
    ];

    await Promise.all(
      fieldDataLoader.map(({ fetch, setState, isEmail }) => loadFieldData(fetch, setState, isEmail))
    );

    // (await (await fetchUserData()).apiUserGetAllUsersNameIdOnlyGet()).data;
    const actionDataLoader = [
      { fetch: fetchWorkFlowData, setState: setActionWorkFlows },
      { fetch: fetchTeamData, setState: setActionTeams },
      { fetch: fetchUserData, setState: setActionUsers },
      { fetch: fetchTicketDepartmentData, setState: setActionDepartments },
    ];

    await Promise.all(
      actionDataLoader.map(({ fetch, setState }) => loadActionData(fetch, setState))
    );

    dispatchBusy({ isBusy: false });
  };

  useEffect(() => {
    loadAllDataOptimized();
  }, []);

  const handlePageChange = (event: any, value: any) => {
    setPage(value);
  };

  const handleQueryChange = (q: RuleGroupType) => {
    setQuery(q);
  };

  const exportQuery = () => {
    const queryData = {
      sql: formatQuery(query, "sql"),
      raw: query,
    };

    const blob = new Blob([JSON.stringify(queryData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query-export.json";
    a.click();
  };

  const resetQuery = () => {
    setQuery({
      combinator: "and",
      rules: [],
    });
    setSelectedActionDepartment(null);
    setSelectedActionTeam(null);
    setSelectedActionUser(null);
    setSelectedActionWorkFlow(null);
    setQueryName("");
    setQuerOrdNum(1);
  };

  useEffect(() => {
    let count = 0;
    let hasWorkCompanySystemId = false;
    for (const rule of query.rules) {
      if ("field" in rule && rule.field === "CustomerRefId") {
        count++;
        setSelectedCustomerRefId(rule.value);
      }
      if ("field" in rule && rule.field === "WorkCompanySystemInfoId") {
        hasWorkCompanySystemId = true;
      }
    }
    if (count == 0) {
      setSelectedCustomerRefId("");
      if (hasWorkCompanySystemId) {
        const filteredRules = query.rules.filter(
          (rule) => "field" in rule && rule.field !== "WorkCompanySystemInfoId"
        );

        setQuery((prev) => ({
          ...prev,
          rules: filteredRules,
        }));
      }
    }
  }, [query]);

  useEffect(() => {
    if (selectedCustomerRefId !== "") {
      WorkCompanyIdSystemData(selectedCustomerRefId).then((fieldData) => {
        if (fieldData) {
          setWorkCompanySystemInfo([fieldData]);
        } else {
          setWorkCompanySystemInfo([]);
        }
      });
    }
  }, [selectedCustomerRefId]);

  const saveQuery = async () => {
    try {
      dispatchBusy({ isBusy: true });

      if (queryName == null || queryName.trim() == "") {
        dispatchAlert({
          message: t("ns1:QueryPage.QueryDetail.SorguAdiBos"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }

      if (selectedActionDepartment?.id == null) {
        dispatchAlert({
          message: t("ns1:QueryPage.QueryDetail.DepartmanBos"),
          type: MessageBoxType.Warning,
        });
        dispatchBusy({ isBusy: false });
        return;
      }
      if (id) {
        await (
          await fetchTicketRuleEngineData()
        ).apiTicketRuleEnginePut({
          id: id,
          ruleName: queryName,
          ruleJson: JSON.stringify(query),
          isActive: true,
          assignedDepartmentId: selectedActionDepartment?.id,
          assignedTeamId: selectedActionTeam?.id,
          assignedUserId: selectedActionUser?.id,
          order: querOrdNum,
          workflowId: selectedActionWorkFlow?.id,
          createEnvironment: selectedRBValue,
        });
        dispatchAlert({
          message: t("ns1:QueryPage.QueryDetail.SorguBasariliGuncellendi"),
          type: MessageBoxType.Success,
        });
        navigate("/queryBuild");
        dispatchBusy({ isBusy: false });
        return;
      }
      await (
        await fetchTicketRuleEngineData()
      ).apiTicketRuleEnginePost({
        ruleName: queryName,
        ruleJson: JSON.stringify(query),
        isActive: true,
        assignedDepartmentId: selectedActionDepartment?.id,
        assignedTeamId: selectedActionTeam?.id,
        assignedUserId: selectedActionUser?.id,
        workflowId: selectedActionWorkFlow?.id,
        order: querOrdNum,
        createEnvironment: selectedRBValue,
      });
      dispatchAlert({
        message: t("ns1:QueryPage.QueryDetail.SorguBasariliKaydedildi"),
        type: MessageBoxType.Success,
      });
      navigate("/queryBuild");
    } catch (error) {
      dispatchAlert({
        message: t("ns1:QueryPage.QueryDetail.SorguKayitHata"),
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    if (id && actionDepartments && actionTeams && actionUsers && actionWorkFlows) {
      const fetchQuery = async () => {
        try {
          dispatchBusy({ isBusy: true });
          const response = await (await fetchTicketRuleEngineData()).apiTicketRuleEngineIdGet(id);
          setQuery(JSON.parse(response.data.ruleJson));
          setQueryName(response.data.ruleName);
          setQuerOrdNum(response.data.order);
          setSelectedRBValue(response.data.createEnvironment);
          setSelectedActionDepartment(
            actionDepartments.find(
              (department) => department.id === response.data.assignedDepartmentId
            )
          );
          setSelectedActionWorkFlow(
            actionWorkFlows.find((workflow) => workflow.id === response.data.workflowId)
          );
          if (
            response.data.assignedTeamId &&
            response.data.assignedUserId === "00000000-0000-0000-0000-000000000000"
          ) {
            setUserOrTeam("team");
            setSelectedActionTeam(
              actionTeams.find((team) => team.id === response.data.assignedTeamId)
            );
          }
          if (
            response.data.assignedUserId &&
            response.data.assignedTeamId === "00000000-0000-0000-0000-000000000000"
          ) {
            setUserOrTeam("user");
            setSelectedActionUser(
              actionUsers.find((user) => user.id === response.data.assignedUserId)
            );
          }
        } catch (error) {
          dispatchAlert({
            message: "Error fetching query data",
            type: MessageBoxType.Error,
          });
        } finally {
          dispatchBusy({ isBusy: false });
        }
      };
      fetchQuery();
    }
  }, [id, actionDepartments, actionTeams, actionUsers, actionWorkFlows]);

  const handleCloseQuestionBox = (action: string) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes" || action === "Evet") {
      resetQuery();
    }
  };

  const handleCloseQuestionBoxExport = (action: string) => {
    setIsQuestionMessageBoxOpenExport(false);
    if (action === "Yes" || action === "Evet") {
      exportQuery();
    }
  };

  const handleGoBack = () => {
    const previousUrl = document.referrer;
    if (previousUrl.includes("/queryBuild")) {
      // konntrollü navigate
      navigate("/queryBuild");
    } else {
      navigate(-1);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container mt={3} mx={0.4}>
        <Grid item xs={12} lg={12}>
          <Card>
            <MDBox p={3}>
              <MDBox mr={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">{t("ns1:QueryPage.QueryDetail.QueryBuilder")}</Typography>
                <Tooltip title={t("ns1:QueryPage.QueryDetail.SorguBilgi")} placement="bottom" arrow>
                  <MDButton
                    onClick={() => setIsQuestionMessageBoxOpenInfo(true)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    circular
                    iconOnly
                  >
                    <Icon>priority_high</Icon>
                  </MDButton>
                </Tooltip>
              </MDBox>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {t("ns1:QueryPage.QueryDetail.SorguBilgi")}
              </Typography>
            </MDBox>
            <MDBox mt={2} p={3}>
              <TabMenu
                model={items}
                className="custom-tab-menu"
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                }}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              />
              <Divider sx={{ opacity: 1 }} />
            </MDBox>
            <Divider />
            {activeIndex === 0 ? (
              <MDBox
                p={3}
                sx={{
                  backgroundColor: "rgba(248, 249, 250, 0.7)",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#334155",
                    mb: 3,
                    pb: 1,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {t("ns1:QueryPage.QueryDetail.SorguOlusturucu")}
                </Typography>

                <Grid container spacing={3} justifyContent="space-between">
                  <Grid item xs={12} md={4} lg={4}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>title</Icon>
                        {t("ns1:QueryPage.QueryDetail.SorguAdi")}
                      </Typography>
                      <MDInput
                        fullWidth
                        value={queryName}
                        onChange={(e: any) => setQueryName(e.target.value)}
                        placeholder={t("ns1:QueryPage.QueryDetail.SorguAdiPlaceholder")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#7dd3fc" },
                            "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                            borderRadius: "8px",
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "10px 14px",
                          },
                        }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>title</Icon>
                        {t("ns1:QueryPage.QueryDetail.TalepOlusturmaOrtami")}
                      </Typography>
                      <RadioButton
                        name="rbGroup"
                        text={t("ns1:QueryPage.QueryDetail.DestekSistemi")}
                        checked={selectedRBValue === 1}
                        onChange={() => setSelectedRBValue(1)}
                        valueState="None"
                      />
                      <RadioButton
                        name="rbGroup"
                        text={t("ns1:QueryPage.QueryDetail.Mail")}
                        checked={selectedRBValue === 2}
                        onChange={() => setSelectedRBValue(2)}
                        valueState="None"
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>title</Icon>
                        {t("ns1:QueryPage.QueryDetail.SorguSirasi")}{" "}
                        <span
                          style={{ fontWeight: "normal", fontStyle: "italic", fontSize: "16px" }}
                        >
                          {t("ns1:QueryPage.QueryDetail.SorguSirasiItalic")}
                        </span>
                      </Typography>
                      <MDInput
                        fullWidth
                        value={querOrdNum}
                        type="number"
                        placeholder={t("ns1:QueryPage.QueryDetail.SorguSirasiPlaceholder")}
                        onChange={(e: any) => setQuerOrdNum(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#7dd3fc" },
                            "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                            borderRadius: "8px",
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "10px 14px",
                          },
                        }}
                      />
                    </MDBox>
                  </Grid>
                </Grid>

                <MDBox
                  mt={3}
                  sx={{
                    backgroundColor: "#fff",
                    p: 2,
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#334155",
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ verticalAlign: "middle", mr: 1 }}>filter_alt</Icon>
                    {t("ns1:QueryPage.QueryDetail.SorguKriterleri")}
                  </Typography>

                  <QueryBuilder
                    fields={[
                      // ...userFields,
                      // ...userMailFields,
                      ...clientFields,
                      ...companyFields,
                      // ...teamFields,
                      // ...workFlowFields,
                      // ...statusFields,
                      ...priorityFields,
                      ...typeFields,
                      ...slaFields,
                      ...subjectFields,
                      ...(selectedCustomerRefId !== "" ? workCompanySystemInfo : []),
                    ]}
                    query={query}
                    onQueryChange={handleQueryChange}
                    resetOnOperatorChange={true}
                    controlClassnames={{
                      queryBuilder: "queryBuilder-branches custom-builder",
                      ruleGroup: "custom-rule-group",
                      rule: "custom-rule",
                    }}
                    controlElements={{
                      addRuleAction: ({ handleOnClick }) => (
                        <MDButton
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={handleOnClick}
                          startIcon={<Icon>add</Icon>}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            boxShadow: "none",
                            mr: 1,
                          }}
                        >
                          {t("ns1:QueryPage.QueryDetail.KuralEkle")}
                        </MDButton>
                      ),
                      addGroupAction: ({ handleOnClick }) => (
                        <MDButton
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={handleOnClick}
                          startIcon={<Icon>create_new_folder</Icon>}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            boxShadow: "none",
                          }}
                        >
                          {t("ns1:QueryPage.QueryDetail.GrupEkle")}
                        </MDButton>
                      ),
                      removeGroupAction: ({ handleOnClick }) => (
                        <MDButton
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleOnClick}
                          startIcon={<Icon>delete</Icon>}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            boxShadow: "none",
                          }}
                        >
                          {t("ns1:QueryPage.QueryDetail.Kaldir")}
                        </MDButton>
                      ),
                      removeRuleAction: ({ handleOnClick }) => (
                        <MDButton
                          variant="text"
                          color="error"
                          size="small"
                          onClick={handleOnClick}
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon>close</Icon>
                        </MDButton>
                      ),
                    }}
                    translations={{
                      fields: {
                        title: t("ns1:QueryPage.QueryDetail.AlanSeciniz"),
                      },
                      operators: {
                        title: t("ns1:QueryPage.QueryDetail.OperatorSeciniz"),
                      },
                      value: {
                        title: t("ns1:QueryPage.QueryDetail.DegerGiriniz"),
                      },
                      removeRule: {
                        label: t("ns1:QueryPage.QueryDetail.Kaldir"),
                        title: t("ns1:QueryPage.QueryDetail.Kaldir"),
                      },
                      removeGroup: {
                        label: t("ns1:QueryPage.QueryDetail.Kaldir"),
                        title: t("ns1:QueryPage.QueryDetail.Kaldir"),
                      },
                      addRule: {
                        label: t("ns1:QueryPage.QueryDetail.KuralEkle"),
                        title: t("ns1:QueryPage.QueryDetail.KuralEkle"),
                      },
                      addGroup: {
                        label: t("ns1:QueryPage.QueryDetail.GrupEkle"),
                        title: t("ns1:QueryPage.QueryDetail.GrupEkle"),
                      },
                    }}
                  />
                </MDBox>

                <MDBox
                  mt={3}
                  sx={{
                    backgroundColor: "#fff",
                    p: 2,
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#334155",
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ verticalAlign: "middle", mr: 1 }}>code</Icon>
                    {t("ns1:QueryPage.QueryDetail.SorguCiktisi")}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#64748b",
                          mb: 1,
                        }}
                      >
                        {t("ns1:QueryPage.QueryDetail.SQLFormati")}
                      </Typography>
                      <pre
                        style={{
                          background: "#f8fafc",
                          padding: "1rem",
                          borderRadius: "8px",
                          overflow: "auto",
                          border: "1px solid #e2e8f0",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          color: "#334155",
                        }}
                      >
                        {formatQuery(query, "sql")}
                      </pre>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "#64748b",
                          mb: 1,
                        }}
                      >
                        {t("ns1:QueryPage.QueryDetail.JSONFormati")}
                      </Typography>
                      <pre
                        style={{
                          background: "#f8fafc",
                          padding: "1rem",
                          borderRadius: "8px",
                          overflow: "auto",
                          border: "1px solid #e2e8f0",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          color: "#334155",
                        }}
                      >
                        {formatQuery(query, "json")}
                      </pre>
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox
                  display="flex"
                  gap={2}
                  justifyContent="flex-end"
                  mt={3}
                  p={2}
                  sx={{
                    borderTop: "1px solid #e2e8f0",
                    marginTop: "2rem",
                    paddingTop: "1rem",
                  }}
                >
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={handleGoBack}
                    startIcon={<Icon>arrow_back</Icon>}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("ns1:QueryPage.QueryDetail.GeriDon")}
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="error"
                    onClick={() => setIsQuestionMessageBoxOpen(true)}
                    startIcon={<Icon>refresh</Icon>}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("ns1:QueryPage.QueryDetail.Sifirla")}
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    color="dark"
                    onClick={() => setIsQuestionMessageBoxOpenExport(true)}
                    startIcon={<Icon>download</Icon>}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("ns1:QueryPage.QueryDetail.IceAktar")}
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={saveQuery}
                    startIcon={<Icon>save</Icon>}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 10px 0 rgba(14, 165, 233, 0.3)",
                    }}
                  >
                    {id
                      ? t("ns1:QueryPage.QueryDetail.MevcutSorguGuncelle")
                      : t("ns1:QueryPage.QueryDetail.YeniSorguKaydet")}
                  </MDButton>
                </MDBox>
              </MDBox>
            ) : (
              <MDBox
                p={3}
                sx={{
                  backgroundColor: "rgba(248, 249, 250, 0.7)",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)",
                }}
              >
                <MDBox
                  display="flex"
                  mb={4}
                  sx={{
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "#334155",
                      mb: 3,
                      pb: 1,
                      mr: 2,
                    }}
                  >
                    {t("ns1:QueryPage.QueryDetail.Atama")}
                  </Typography>
                  <Tooltip
                    title="Yapılıcak sorgu sonucunda mevcut ise atama işlemi yapılacak."
                    placement="bottom"
                    arrow
                  >
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      size="small"
                      circular
                      sx={{ mt: 0.7 }}
                      iconOnly
                    >
                      <Icon>priority_high</Icon>
                    </MDButton>
                  </Tooltip>
                </MDBox>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={3}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>groups</Icon>
                        {t("ns1:QueryPage.QueryDetail.AtanacakDepartman")}
                      </Typography>
                      <Autocomplete
                        options={actionDepartments || []}
                        value={selectedActionDepartment}
                        getOptionLabel={(option: TicketDepartmensListDto) =>
                          option ? option.departmentText : ""
                        }
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            placeholder={t("ns1:QueryPage.QueryDetail.DepartmanSeciniz")}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#7dd3fc" },
                                "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                              },
                            }}
                          />
                        )}
                        onChange={(event, newValue) => {
                          setSelectedActionDepartment(newValue);
                        }}
                      />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>group</Icon>
                        {t("ns1:QueryPage.QueryDetail.AtanacakTakim")}
                      </Typography>

                      <Autocomplete
                        disabled={userOrTeam === "user"}
                        options={actionTeams || []}
                        value={selectedActionTeam}
                        getOptionLabel={(option: TicketTeamListDto) => (option ? option.name : "")}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            placeholder={t("ns1:QueryPage.QueryDetail.TakimSeciniz")}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#7dd3fc" },
                                "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                              },
                            }}
                          />
                        )}
                        onChange={(event, newValue) => {
                          setSelectedActionTeam(newValue);
                          setUserOrTeam("team");
                          if (!newValue) {
                            setUserOrTeam("");
                          }
                        }}
                      />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>person</Icon>
                        {t("ns1:QueryPage.QueryDetail.AtanacakKisi")}
                      </Typography>

                      <Autocomplete
                        disabled={userOrTeam === "team"}
                        options={actionUsers || []}
                        value={selectedActionUser}
                        getOptionLabel={(option: UserAppDtoOnlyNameId) =>
                          option ? `${option.firstName} ${option.lastName}` : ""
                        }
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            placeholder={t("ns1:QueryPage.QueryDetail.KisiSeciniz")}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#7dd3fc" },
                                "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                              },
                            }}
                          />
                        )}
                        onChange={(event, newValue) => {
                          setSelectedActionUser(newValue);
                          setUserOrTeam("user");
                          if (!newValue) {
                            setUserOrTeam("");
                          }
                        }}
                      />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6} lg={3}>
                    <MDBox
                      sx={{
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          mb: 1.5,
                        }}
                      >
                        <Icon sx={{ verticalAlign: "middle", mr: 1 }}>account_tree</Icon>
                        {t("ns1:QueryPage.QueryDetail.IsAkisi")}
                      </Typography>

                      <Autocomplete
                        options={actionWorkFlows || []}
                        value={selectedActionWorkFlow}
                        getOptionLabel={(option: any) => (option ? option.workflowName : "")}
                        renderInput={(params) => (
                          <MDInput
                            {...params}
                            placeholder={t("ns1:QueryPage.QueryDetail.IsAkisiSeciniz")}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#7dd3fc" },
                                "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
                              },
                            }}
                          />
                        )}
                        onChange={(event, newValue) => {
                          setSelectedActionWorkFlow(newValue);
                        }}
                      />
                    </MDBox>
                  </Grid>
                </Grid>

                <MDBox display="flex" justifyContent="flex-end" mt={3}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    startIcon={<Icon>check_circle</Icon>}
                    sx={{ boxShadow: "0 4px 10px 0 rgba(0,0,0,0.15)" }}
                  >
                    {t("ns1:QueryPage.QueryDetail.GorevAta")}
                  </MDButton>
                </MDBox>
              </MDBox>
            )}
          </Card>
        </Grid>
      </Grid>
      <CustomMessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
        handleCloseQuestionBox={handleCloseQuestionBox}
        titleText={t("ns1:QueryPage.QueryDetail.Sifirla")}
        contentText={t("ns1:QueryPage.QueryDetail.SifirlaTeyit")}
        warningText={{
          text: t("ns1:QueryPage.QueryDetail.SifirlaTeyitAlt"),
          color: "#e74c3c",
        }}
        type="warning"
      />
      <CustomMessageBox
        isQuestionmessageBoxOpen={isQuestionMessageBoxOpenExport}
        handleCloseQuestionBox={handleCloseQuestionBoxExport}
        titleText={t("ns1:QueryPage.QueryDetail.IceAktar")}
        contentText={t("ns1:QueryPage.QueryDetail.IceAktarBasla")}
        warningText={{ text: t("ns1:QueryPage.QueryDetail.IceAktarUyari"), color: "#f39c12" }}
        type="info"
      />
      <Dialog
        open={isQuestionMessageBoxOpenInfo}
        onClose={() => setIsQuestionMessageBoxOpenInfo(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            background: "linear-gradient(to bottom, #f5f7fa, #f0f2f5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            typography: "h4",
            fontWeight: "bold",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 2,
            textAlign: "center",
          }}
        >
          {content[page - 1].title}
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 5 }}>
          {content[page - 1].text.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              paragraph
              sx={{
                mb: 2,
                p: 1,
                lineHeight: 1.6,
                color: "text.secondary",
              }}
              dangerouslySetInnerHTML={{
                __html: paragraph
                  .replace(/<strong>/g, '<span style="font-weight: 600; color: #1976d2;">')
                  .replace(/<\/strong>/g, "</span>"),
              }}
            />
          ))}

          <MDBox
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Pagination
              count={content.length}
              page={page}
              onChange={handlePageChange}
              //   color="primary"
              //   variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(45deg, #1976d2, #2196f3)",
                    color: "white",
                  },
                },
              }}
            />
          </MDBox>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default QueryDetail;
