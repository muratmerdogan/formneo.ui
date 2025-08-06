import {
  DepartmentsApi,
  TicketApi,
  UserApi,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
  TicketTeamApi,
  TicketTeamListDto,
  WorkCompanyApi,
  WorkCompanyDto,
  UserAppDtoOnlyNameId,
  TicketProjectsListDto,
  TicketProjectsApi,
} from "api/generated";
import MDBox from "components/MDBox";
import getConfiguration from "confiuration";
import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import "./index.css";
import { Icon } from "@mui/material";
import { useBusy } from "layouts/pages/hooks/useBusy";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import GlobalCell from "../allTickets/tableData/globalCell";
import { useNavigate } from "react-router-dom";
import HistoryDialog from "components/HistoryDialog/HistoryDialog";
import ShowHistory from "layouts/pages/WorkFlow/ShowHistory";
import DataTable from "examples/Tables/DataTable";
import { useTranslation } from "react-i18next";

interface AssigneeType {
  id: number;
  name: string;
}
interface TableFilters {
  company: string;
  creator: string;
  assignee: string;
  startDate: string;
  endDate: string;
  assignedTeam: string;
  assignedUser: string;
  status: string[];
  type: string;
  customer: string;
  closeInc: boolean;
  title: string;
  department: string[];
  ticketProject: string[];
}

// Add new interface for named cache
interface NamedCache {
  name: string;
  filters: TableFilters;
  selectedAssigneeType: AssigneeType | null;
  checkBox: boolean;
}

interface FilterTableMethodProps {
  ticketRowData: any[];
  setFilteredData: (data: any[]) => void;
  pageDesc: string;
  isSolveAllTicket?: boolean;
  handleSearch?: (data: any[]) => void;
  isrefresh?: boolean;
  setisrefresh?: (data: boolean) => void;
  skip?: number;
  top?: number;
  setPageCount?: (count: number) => void;
  setTotalCount?: (count: number) => void;
  excelAndGraphicData?: (data: any) => void;
  createGraph?: boolean;
  setcreateGraph?: (data: boolean) => void;
  setgraphicData?: (data: any[]) => void;
  onlyAll?: boolean;
  fromDashboard?: {
    workCompanyId: string;
    workCompanyName: string;
    projectId: string;
    projectName: string;
    projectSubName: string;
  }
}

function FilterTableMethod({
  ticketRowData,
  setFilteredData,
  pageDesc,
  isSolveAllTicket,
  handleSearch,
  isrefresh,
  setisrefresh,
  skip,
  top,
  setPageCount,
  setTotalCount,
  excelAndGraphicData,
  createGraph,
  setcreateGraph,
  setgraphicData,
  onlyAll,
  fromDashboard,
}: FilterTableMethodProps) {
  const [companyData, setCompanyData] = useState<WorkCompanyDto[]>([]);
  const [assigneeTypeData, setAssigneeTypeData] = useState<AssigneeType[]>([
    {
      id: 1,
      name: "Kullanıcı",
    },
    {
      id: 2,
      name: "Takım",
    },
    {
      id: 999999,
      name: "Atama Yok",
    },
  ]);
  const [selectedAssigneeType, setSelectedAssigneeType] = useState<AssigneeType | null>(null);
  const [teamData, setTeamData] = useState<TicketTeamListDto[]>([]);
  const [userData, setUserData] = useState<UserAppDtoOnlyNameId[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [creatorData, setCreatorData] = useState<UserAppDtoOnlyNameId[]>([]);
  const [isFirst, setIsFirst] = useState<Boolean>(true);

  var [checkBox, setCheckBox] = useState(false);

  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();

  const [sendData, setSendData] = useState<any[]>([]);

  var [filters, setFilters] = useState<TableFilters>({
    company: "",
    creator: "",
    assignee: "",
    startDate: "",
    endDate: "",
    assignedTeam: "",
    assignedUser: "",
    status: onlyAll ? ["2"] : ["1", "2", "3", "4", "5", "6", "7", "8"],
    type: "",
    customer: "",
    closeInc: false,
    title: "",
    department: [],
    ticketProject: [],
  });

  const [showFilters, setShowFilters] = useState(false);
  // Add new state for filter name and cached filters
  const [filterName, setFilterName] = useState<string>("");
  const [savedFilters, setSavedFilters] = useState<NamedCache[]>([]);

  const [hasPerm, setHasPerm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginUserCompany, setloginUserCompany] = useState("");

  //deneme excel ve grafik
  const [excelData, setexcelData] = useState<any>(null);

  //search icin
  const [openSearchDialog, setopenSearchDialog] = useState(false);
  const [searchTalepNo, setSearchTalepNo] = useState("");
  const [searchTalepBaslik, setSearchTalepBaslik] = useState("");
  const [selectedAprHis, setselectedAprHis] = useState<any>(null);
  const [aprHistoryOpen, setaprHistoryOpen] = useState(false);
  const [historyDialogOpen, sethistoryDialogOpen] = useState<boolean>(false);
  const [selectedTicket, setselectedTicket] = useState<any>(null);
  const [searchedData, setsearchedData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [ticketProjectData, setTicketProjectData] = useState<TicketProjectsListDto[]>([]);
  const [searchMsj, setSearchMsj] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if(fromDashboard && fromDashboard.workCompanyId && fromDashboard.projectId) {
      setFilters((prev) => ({
        ...prev,
        customer: fromDashboard.workCompanyId,
        ticketProject: [fromDashboard.projectId],
      }));
    }
  }, []); 

  const column = [
    {
      accessor: "actions",

      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İŞLEMLER</div>,
      Cell: ({ row }: any) => (
        <MDBox mx={2}>
          <Tooltip title="Onay Geçmişi">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                setselectedAprHis(row.original.workFlowHeadId);
                setaprHistoryOpen(true);
              }}
            >
              history
            </Icon>
          </Tooltip>

          <Tooltip title="Talep Geçmişi">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                setselectedTicket(row.original.id);
                sethistoryDialogOpen(true);
              }}
            >
              personSearch
            </Icon>
          </Tooltip>
          <Tooltip title="İncele">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                if (pageDesc == "solveAllTicket") {
                  sessionStorage.setItem("ticketId", row.original.id);
                  navigate("/solveAllTicket/solveTicket", {
                    state: { ticketId: row.original.id, review: true },
                  });
                } else {
                  sessionStorage.setItem("ticketId", row.original.id);
                  navigate("/tickets/detail/", {
                    state: { ticketId: row.original.id, review: true },
                  });
                }
              }}
            >
              visibility
            </Icon>
          </Tooltip>
          <Tooltip title="Talebi Düzenle">
            <Icon
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                if (pageDesc == "solveAllTicket") {
                  sessionStorage.setItem("ticketId", row.original.id);
                  navigate("/solveAllTicket/solveTicket", {
                    state: { ticketId: row.original.id },
                  });
                } else {
                  sessionStorage.setItem("ticketId", row.original.id);
                  navigate("/tickets/detail/", {
                    state: { ticketId: row.original.id },
                  });
                }
              }}
            >
              edit
            </Icon>
          </Tooltip>
        </MDBox>
      ),
    },
    {
      accessor: "ticketNumber",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Talep No</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "statusText",
      width: "10%",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Durum</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell
          value={value}
          statusId={row.original.status}
          columnName={column.id}
          testRow={row.original}
        />
      ),
    },
    {
      accessor: "title",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Başlık</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "customerRefName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Müşteri</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketAssigneText",
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          Atanan (KİŞİ/TAKIM)
        </div>
      ),
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "userAppName",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Oluşturan</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "createdDate",
      Header: <MDBox style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>TARİH</MDBox>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
    {
      accessor: "ticketDepartmentText",
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Departman</div>,
      Cell: ({ row, value, column }: any) => (
        <GlobalCell value={value} columnName={column.id} testRow={row.original} />
      ),
    },
  ];

  const saveFiltersToCache = () => {
    localStorage.setItem(
      "filterCache",
      JSON.stringify({
        filters,
        selectedAssigneeType,
        checkBox,
      })
    );
  };

  // const loadFiltersFromCache = () => {
  //   try {
  //     const cached = localStorage.getItem("filterCache");
  //     if (cached) {
  //       const parsedCache = JSON.parse(cached);
  //       setFilters(parsedCache.filters);
  //       setSelectedAssigneeType(parsedCache.selectedAssigneeType);
  //       setCheckBox(parsedCache.checkBox);
  //       setShow(true);
  //       sendFilter();
  //     }
  //   } catch (error) {
  //     console.error("Error loading cache:", error);
  //     localStorage.removeItem("filterCache"); // Clear corrupted cache
  //   }
  // };

  useEffect(() => {
    const fetchAllData = async () => {
      var conf = getConfiguration();
      // var api = new TicketDepartmentsApi(conf);
      // var data = await api.apiTicketDepartmentsAllOnlyNameGet();
      // setDepartmentData(data.data);
      var api2 = new WorkCompanyApi(conf);
      var data2 = await api2.apiWorkCompanyGet();
      setCompanyData(data2.data);
      var api3 = new TicketTeamApi(conf);
      var data3 = await api3.apiTicketTeamWithoutTeamGet();
      setTeamData(data3.data);
      var api4 = new TicketApi(conf);
      const response: any = await api4.apiTicketTicketStatusGet();
      //BURAYA CHECK AT
      var api5 = new UserApi(conf);
      var filterCheckData = await api5.apiUserCheckApplyDefaultFiltersGet();

      if (filterCheckData.data == true) {
        if (isSolveAllTicket) {
          setFilters((prev) => ({
            ...prev,
            status: ["2", "4", "5", "6", "7", "8", "9", "10"],
          }));
        } else {
          setFilters((prev) => ({
            ...prev,
            status: ["1", "2", "4", "5", "6", "7", "8", "9", "10", "12"],
          }));
        }
      }

      const filteredData = isSolveAllTicket
        ? response.data.filter((item: any) => item.id !== 12 && item.id !== 1)
        : response.data;

      setStatusData(filteredData);
      var data5 = await api4.apiTicketTicketTypeGet();
      setTypeData(data5.data as any);
      var data6 = await api5.apiUserGetAllUsersNameIdOnlyGet();
      setCreatorData(data6.data);
      setUserData(data6.data);
      // After loading all data, check for cache
      // const cached = localStorage.getItem("filterCache");
      // if (cached) {
      //   const parsedCache = JSON.parse(cached);
      //   setFilters(parsedCache.filters);
      //   setSelectedAssigneeType(parsedCache.selectedAssigneeType);
      //   setCheckBox(parsedCache.checkBox);
      //   await sendFilter();
      // }
      // setFirstFilterValues();

      //yetki kontrol - yetki yoksa filtrede sirket gosterilmeyecek
      const permData = await api4.apiTicketCheckOthercompanypermGet();
      setHasPerm(permData.data.perm);

      //admin kontrol - admin değilse filtrede sirket gosterilmeyecek
      const permData2 = await api5.apiUserCheckIsAdminGet();
      setIsAdmin(permData2.data);

      if (permData.data.perm == false) {
        var userData = await api5.apiUserUserCompanyGet();
        filters.company = userData.data.workCompanyId;
        setloginUserCompany(userData.data.workCompanyId);
      }
    };
    const fetchDepartments = async () => {
      var conf = getConfiguration();
      var api = new TicketDepartmentsApi(conf);
      var data = await api.apiTicketDepartmentsGetAllVisibleDepartmentsGet();
      setDepartmentData(data.data);
    };
    const fetchTicketProjectsData = async () => {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new TicketProjectsApi(conf);
      var data = await api.apiTicketProjectsGetActiveProjectsGet();
      setTicketProjectData(data.data as any);
      dispatchBusy({ isBusy: false });
    };
    fetchAllData();
    fetchDepartments();
    fetchTicketProjectsData();
  }, []);

  useEffect(() => {
    setFilteredData(ticketRowData);
  }, [ticketRowData, setFilteredData]);

  useEffect(() => {
    if (filters.startDate != "" && filters.endDate != "" && filters.status.length > 0 && isFirst) {
      sendFilter();

      setIsFirst(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isrefresh) {
      sendFilter();
      // isrefresh = false;
      setisrefresh(false);
      handleSearch(sendData);
    }
  }, [isrefresh]);

  const setFirstFilterValues = async () => {
    const today = new Date();
    const yyyytoday = today.getFullYear();
    const mmtoday = String(today.getMonth() + 1).padStart(2, "0"); // Ay (0-indexed, bu yüzden +1)
    const ddtoday = String(today.getDate()).padStart(2, "0"); // Gün
    const ddtwoDayBefore = String(today.getDate() - 7).padStart(2, "0"); // Gün

    const formattedToday = `${yyyytoday}-${mmtoday}-${ddtoday}`;
    const formattedBefore = `${yyyytoday}-${mmtoday}-${ddtwoDayBefore}`;
    setFilters((prev) => ({
      ...prev,
      startDate: formattedBefore,
      endDate: formattedToday,
      status: ["2"],
    }));
  };

  const handleFilterChange = (field: keyof TableFilters, value: any) => {
    if (field === "assignedUser") {
      setFilters((prev) => ({
        ...prev,
        assignedTeam: "",
        assignedUser: value || "",
      }));
    } else if (field === "assignedTeam") {
      setFilters((prev) => ({
        ...prev,
        assignedUser: "",
        assignedTeam: value || "",
      }));
    } else if (field === "status") {
      setFilters((prev) => ({
        ...prev,
        [field]: value || [],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };

  const sendFilter = async () => {
    try {
      dispatchBusy({ isBusy: true });

      if (isFirst == true) {
        var conf = getConfiguration();
        var api5 = new UserApi(conf);
        var filterCheckData = await api5.apiUserCheckApplyDefaultFiltersGet();

        if (filterCheckData.data == true) {
          if (isSolveAllTicket) {
            filters.status = ["2", "4", "5", "6", "7", "8", "9", "10"];
          } else {
            filters.status = ["1", "2", "4", "5", "6", "7", "8", "9", "10", "12"];
          }
        }

        setIsFirst(false);

        var api4 = new TicketApi(conf);
        const permData = await api4.apiTicketCheckOthercompanypermGet();
        setHasPerm(permData.data.perm);

        //admin kontrol - admin değilse filtrede sirket gosterilmeyecek
        const permData2 = await api5.apiUserCheckIsAdminGet();
        setIsAdmin(permData2.data);

        if (permData.data.perm == false) {
          var userData = await api5.apiUserUserCompanyGet();
          filters.company = userData.data.workCompanyId;
          setloginUserCompany(userData.data.workCompanyId);
        }
      }
      var formattedData: TableFilters = {
        ...filters,
        endDate: filters.endDate.replaceAll("-", ""),
        startDate: filters.startDate.replaceAll("-", ""),
      };

      var conf = getConfiguration();
      var api = new TicketApi(conf);

      if (selectedAssigneeType?.name == "Atama Yok") {
        formattedData.assignedUser = selectedAssigneeType!.id.toString();
      }

      var data = await api.apiTicketFilteredAllTicketsGet(
        skip,
        top,
        pageDesc,
        formattedData.status,
        formattedData.company,
        formattedData.assignedUser,
        formattedData.assignedTeam,
        formattedData.type,
        formattedData.endDate,
        formattedData.startDate,
        formattedData.creator,
        formattedData.customer,
        // formattedData.department,
        checkBox,
        formattedData.title,
        formattedData.department,
        formattedData.ticketProject
      );

      setFilteredData(data.data.ticketList);

      console.log(data.data.ticketList);
      setSendData(data.data.ticketList);
      setTotalCount(data.data.count!);
      setPageCount(Math.ceil(data.data.count! / top));

      // isrefresh = false;
      setisrefresh(false);
      // Save to cache after successful filter
      saveFiltersToCache();
    } catch (error) {
      console.error(error);
      dispatchBusy({ isBusy: false });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  useEffect(() => {
    if (createGraph) {
      sendFilter();
      setcreateGraph(false);
      getExcelAndGraphicData();
    }
  }, [createGraph]);

  const filterButton = async () => {
    skip = 0;
    await sendFilter();
  };

  const clearFilters = async () => {
    try {
      dispatchBusy({ isBusy: true });
      // Filtresiz veriyi almak için const oluşturuyoruz
      const emptyFilters = {
        company: loginUserCompany == "" ? "" : loginUserCompany,
        creator: "",
        assignee: "",
        startDate: "",
        endDate: "",
        assignedTeam: "",
        assignedUser: "",
        status: [] as string[],
        type: "",
        customer: "",
        closeInc: false,
        title: "",
        department: [] as string[],
        ticketProject: [] as string[],
      };

      // filtre seçenekleri için set ediyoruz
      setFilters(emptyFilters);
      setSearchTalepBaslik("");

      var conf = getConfiguration();
      var api = new TicketApi(conf);

      skip = 0;

      // boş api request atıyoruz ve tüm veriyi alıyoruz
      var data = await api.apiTicketFilteredAllTicketsGet(
        0,
        top,
        pageDesc,
        [],
        loginUserCompany == "" ? "" : loginUserCompany,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        checkBox,
        "",
        [],
        []
      );

      // tüm veriyi aldıktan sonra state'i güncelliyoruz
      setFilteredData(data.data.ticketList);
      // filtre seçeneklerini temizliyoruz
      setSelectedAssigneeType(null);
      setTotalCount(data.data.count!);
      setPageCount(Math.ceil(data.data.count! / top));
      localStorage.removeItem("filterCache");
    } catch (error) {
      console.error(error);
      dispatchBusy({ isBusy: false });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const addCache = () => {
    if (!filterName) {
      return;
    }

    const newCache: NamedCache = {
      name: filterName,
      filters,
      selectedAssigneeType,
      checkBox,
    };

    const updatedFilters = [...savedFilters, newCache];
    setSavedFilters(updatedFilters);
    localStorage.setItem("savedFilters", JSON.stringify(updatedFilters));
    setFilterName("");
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedFilters");
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  const isAnyFilterActive = () => {
    return Object.values(filters).some((value) => value !== "") || selectedAssigneeType !== null;
  };

  const isAnyCacheActive = () => {
    return localStorage.getItem("filterCache") !== null;
  };

  // Add a function to delete a saved filter
  const deleteSavedFilter = (filterToDelete: NamedCache) => {
    const updatedFilters = savedFilters.filter((filter) => filter.name !== filterToDelete.name);
    setSavedFilters(updatedFilters);
    localStorage.setItem("savedFilters", JSON.stringify(updatedFilters));
  };

  const getExcelAndGraphicData = async () => {
    try {
      var formattedData: TableFilters = {
        ...filters,
        endDate: filters.endDate.replaceAll("-", ""),
        startDate: filters.startDate.replaceAll("-", ""),
      };

      var conf = getConfiguration();
      var api = new TicketApi(conf);

      if (selectedAssigneeType?.name == "Atama Yok") {
        formattedData.assignedUser = selectedAssigneeType!.id.toString();
      }

      var res = await api.apiTicketExcelExportGet(
        pageDesc,
        formattedData.status,
        formattedData.company,
        formattedData.assignedUser,
        formattedData.assignedTeam,
        formattedData.type,
        formattedData.endDate,
        formattedData.startDate,
        formattedData.creator,
        formattedData.customer,
        checkBox,
        formattedData.title,
        formattedData.department,
        formattedData.ticketProject
      );
      setexcelData(res.data.excelData);
      setgraphicData(res.data.graphicData);
    } catch (error) {
      console.error(error);
    }
  };

  const exportCsv = async () => {
    try {
      var formattedData: TableFilters = {
        ...filters,
        endDate: filters.endDate.replaceAll("-", ""),
        startDate: filters.startDate.replaceAll("-", ""),
      };

      var conf = getConfiguration();
      var api = new TicketApi(conf);

      if (selectedAssigneeType?.name == "Atama Yok") {
        formattedData.assignedUser = selectedAssigneeType!.id.toString();
      }

      var res = await api.apiTicketExcelExportGet(
        pageDesc,
        formattedData.status,
        formattedData.company,
        formattedData.assignedUser,
        formattedData.assignedTeam,
        formattedData.type,
        formattedData.endDate,
        formattedData.startDate,
        formattedData.creator,
        formattedData.customer,
        checkBox,
        formattedData.title,
        formattedData.department,
        formattedData.ticketProject
      );

      setexcelData(res.data.excelData);
      var data = res.data.excelData as any;

      const byteCharacters = atob(data.fileContents);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // ByteArray oluşturma
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: data.contentType,
      });

      let fileName = `talep-listesi-${new Date().toLocaleDateString("tr-TR")}.xlsx`;
      // Blob'dan bir URL oluştur
      const blobUrl = window.URL.createObjectURL(blob);

      // İndirme işlemi
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  const onCloseSearchDialog = () => {
    setopenSearchDialog(false);
    setSearchTalepNo("");
    setsearchedData([]);
    setSearchMsj("");
  };
  const onSearchButton = async () => {
    if (searchTalepNo == "") {
      dispatchAlert({ message: "Lütfen talep numarası girin..!", type: MessageBoxType.Warning });
      return;
    }

    var conf = getConfiguration();
    var api = new TicketApi(conf);
    var data = await api.apiTicketSearchTicketGet(pageDesc, searchTalepNo, skip, 10);
    console.log("search resurlt>>>", data.data);
    setsearchedData(data.data.ticketList);
    if (data.data.ticketList.length == 0) {
      setSearchMsj("Girilen talep numarasına ait kayıt bulunamadı.");
    }
  };

  return (
    <>
      <MDBox
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <MDBox
          p={3}
          sx={{ paddingRight: "23px" }}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <MDButton
            onClick={() => setShowFilters(!showFilters)}
            variant="gradient"
            color="info"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: "8px",
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
            startIcon={showFilters ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
          >
            {showFilters
              ? t("ns1:TicketPage.TicketTablePage.FiltreleriGizle")
              : t("ns1:TicketPage.TicketTablePage.FiltreleriGoster")}
          </MDButton>
          {/* <FormControl>
          <FormControlLabel
            control={<Checkbox id="closedInc" checked={checkBox} />}
            label={
              <MDTypography fontWeight="medium" variant="caption" color="text">
                Kapalı Durumdakileri Dahil Et
              </MDTypography>
            }
            onChange={(event, newValue) => {
              setCheckBox(newValue);
              checkBox = newValue;
              handleFilterChange("closeInc", newValue.toString() || null);
              sendFilter();
            }}
          />
        </FormControl> */}
          <MDButton
            sx={{
              marginRight: "0.5rem",
              bottom: "11px",
              height: "2.25rem",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
              },
            }}
            startIcon={<Icon>search</Icon>}
            variant="contained"
            color="light"
            onClick={() => setopenSearchDialog(true)}
          >
            {t("ns1:TicketPage.TicketTablePage.AramaYap")}
          </MDButton>

          {isSolveAllTicket && (
            <MDButton
              sx={{
                marginRight: "0.5rem",
                bottom: "11px",
                height: "2.25rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
                },
              }}
              startIcon={<Icon>description</Icon>}
              variant="contained"
              color="dark"
              onClick={exportCsv}
            >
              {t("ns1:TicketPage.TicketTablePage.TalepListesiniIndir")}
            </MDButton>
          )}
        </MDBox>

        <MDBox
          sx={{
            maxHeight: showFilters ? "2000px" : "0px",
            opacity: showFilters ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
          }}
        >
          <MDBox
            className="filter-container"
            sx={{
              display: "grid",
              gap: 3,
              transform: showFilters ? "translateY(0)" : "translateY(-20px)",
              transition: "all 0.3s ease",
            }}
          >
            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <>
                <MDBox className="select-container">
                  <MDBox
                    component="label"
                    className="filter-label"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {t("ns1:TicketPage.TicketTablePage.FilterProps.FiltreAdi")}:
                  </MDBox>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t(
                      "ns1:TicketPage.TicketTablePage.FilterProps.FiltreAdiPlaceholder"
                    )}
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  />
                </MDBox>

                <MDBox className="select-container">
                  <MDBox
                    component="label"
                    className="filter-label"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {t("ns1:TicketPage.TicketTablePage.FilterProps.KayitliFiltreler")}:
                  </MDBox>
                  <Autocomplete
                    options={savedFilters}
                    getOptionLabel={(option) => option.name}
                    onChange={async (_, newValue) => {
                      if (newValue) {
                        setFilters(newValue.filters);
                        setSelectedAssigneeType(newValue.selectedAssigneeType);
                        setCheckBox(newValue.checkBox);

                        localStorage.setItem(
                          "filterCache",
                          JSON.stringify({
                            filters: newValue.filters,
                            selectedAssigneeType: newValue.selectedAssigneeType,
                            checkBox: newValue.checkBox,
                          })
                        );

                        // // Then send filter
                        // await sendFilter();
                      } else {
                        clearFilters();
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={t(
                          "ns1:TicketPage.TicketTablePage.FilterProps.KayitliFiltrelerPlaceholder"
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{option.name}</span>
                        <Icon
                          sx={{
                            cursor: "pointer",
                            color: "error.main",
                            "&:hover": {
                              color: "error.dark",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedFilter(option);
                          }}
                        >
                          delete
                        </Icon>
                      </li>
                    )}
                  />
                </MDBox>
              </>
            </MDBox>
            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.AtananTipi")}:
                </MDBox>
                <Autocomplete
                  options={assigneeTypeData}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={selectedAssigneeType}
                  onChange={(_, newValue) => {
                    if (!newValue) {
                      setFilters({ ...filters, assignedUser: "", assignedTeam: "" }); // filtreleri temizle
                      setSelectedAssigneeType(null);
                    } else {
                      setSelectedAssigneeType(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t(
                        "ns1:TicketPage.TicketTablePage.FilterProps.AtananTipiPlaceholder"
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                />
              </MDBox>
              {selectedAssigneeType?.name == "Kullanıcı" ? (
                <MDBox className="select-container">
                  <MDBox
                    component="label"
                    className="filter-label"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {t("ns1:TicketPage.TicketTablePage.FilterProps.AtananKullanici")}:
                  </MDBox>
                  <Autocomplete
                    options={userData} // users without photo gelicek id name
                    getOptionLabel={(option) => option.firstName + " " + option.lastName || ""}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={userData.find((user) => user.id === filters.assignedUser) || null}
                    onChange={(_, newValue) => {
                      handleFilterChange("assignedUser", newValue ? `${newValue.id}` : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={t(
                          "ns1:TicketPage.TicketTablePage.FilterProps.AtananKullaniciPlaceholder"
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                    )}
                  />
                </MDBox>
              ) : selectedAssigneeType?.name == "Takım" ? (
                <MDBox className="select-container">
                  <MDBox
                    component="label"
                    className="filter-label"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {t("ns1:TicketPage.TicketTablePage.FilterProps.AtananTakim")}:
                  </MDBox>
                  <Autocomplete
                    options={teamData}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={teamData.find((team) => team.id === filters.assignedTeam) || null}
                    onChange={(_, newValue) => {
                      handleFilterChange("assignedTeam", newValue?.id || null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={t(
                          "ns1:TicketPage.TicketTablePage.FilterProps.AtananTakimPlaceholder"
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                    )}
                  />
                </MDBox>
              ) : null}
            </MDBox>

            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.TalebiAcanSirket")}:
                </MDBox>
                <Autocomplete
                  disabled={!hasPerm && !isAdmin}
                  options={companyData}
                  getOptionLabel={(option) => option.name || ""}
                  value={companyData.find((company) => company.id === filters.company) || null}
                  onChange={(_, newValue) => handleFilterChange("company", newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t(
                        "ns1:TicketPage.TicketTablePage.FilterProps.TalebiAcanSirketPlaceholder"
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                />
              </MDBox>
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Olusturan")}:
                </MDBox>
                <Autocomplete
                  options={creatorData} // users without photo gelicek id name
                  getOptionLabel={(option) => option.firstName + " " + option.lastName || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={
                    creatorData.find((creator) => creator.userName === filters.creator) || null
                  }
                  onChange={(_, newValue) => {
                    handleFilterChange("creator", newValue ? `${newValue.userName}` : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t(
                        "ns1:TicketPage.TicketTablePage.FilterProps.OlusturanPlaceholder"
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                />
              </MDBox>
            </MDBox>

            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(1, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Durum")}:
                </MDBox>
                <Autocomplete
                  options={statusData}
                  multiple
                  getOptionLabel={(option) => option.description || ""}
                  value={
                    statusData.filter((status) => filters.status?.includes(status.id.toString())) ||
                    []
                  }
                  onChange={(_, newValue) => {
                    // Handle multiple values

                    const newStatusIds = newValue.map((item) => item.id.toString());

                    handleFilterChange("status", newStatusIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t("ns1:TicketPage.TicketTablePage.FilterProps.DurumPlaceholder")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.description}
                        {...getTagProps({ index })}
                        sx={{
                          m: 0.5,
                          borderRadius: "6px",
                          backgroundColor: "primary.light",
                          color: "primary.dark",
                        }}
                      />
                    ))
                  }
                />
              </MDBox>
            </MDBox>

            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Departman")}:
                </MDBox>
                <Autocomplete
                  options={departmentData}
                  multiple
                  getOptionLabel={(option) => option.departmentText || ""}
                  value={
                    departmentData.filter((department) =>
                      filters.department?.includes(department.id.toString())
                    ) || []
                  }
                  onChange={(_, newValue) => {
                    // Handle multiple values

                    const newStatusIds = newValue.map((item) => item.id.toString());

                    handleFilterChange("department", newStatusIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t(
                        "ns1:TicketPage.TicketTablePage.FilterProps.DepartmanPlaceholder"
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.departmentText}
                        {...getTagProps({ index })}
                        sx={{
                          m: 0.5,
                          borderRadius: "6px",
                          backgroundColor: "primary.light",
                          color: "primary.dark",
                        }}
                      />
                    ))
                  }
                />
              </MDBox>

              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Tip")}:
                </MDBox>
                <Autocomplete
                  options={typeData}
                  getOptionLabel={(option) => option.description || ""}
                  value={typeData.find((type) => type.id === filters.type) || null}
                  onChange={(_, newValue) => handleFilterChange("type", newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t("ns1:TicketPage.TicketTablePage.FilterProps.TipPlaceholder")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                />
              </MDBox>
            </MDBox>

            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Musteri")}:
                </MDBox>
                <Autocomplete
                  options={companyData}
                  getOptionLabel={(option) => option.name || ""}
                  value={companyData.find((company) => company.id === filters.customer) || null}
                  onChange={(_, newValue) => handleFilterChange("customer", newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t(
                        "ns1:TicketPage.TicketTablePage.FilterProps.MusteriPlaceholder"
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                />
              </MDBox>
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.TalepBasligi")}:
                </MDBox>
                <MDInput
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      height: "35px",
                      fontSize: "0.8rem",
                    },
                  }}
                  placeholder={t(
                    "ns1:TicketPage.TicketTablePage.FilterProps.TalepBasligiPlaceholder"
                  )}
                  value={searchTalepBaslik}
                  onChange={(e: any) => {
                    setSearchTalepBaslik(e.target.value);
                    handleFilterChange("title", e.target.value || null);
                  }}
                />
              </MDBox>
            </MDBox>

            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.BaslangicTarihi")}:
                </MDBox>
                <MDInput
                  type="date"
                  name="startDate"
                  fullWidth
                  value={filters.startDate}
                  onChange={(e: any) => handleFilterChange("startDate", e.target.value)}
                  inputProps={{
                    style: {
                      height: "14px",
                    },
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </MDBox>
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.BitisTarihi")}:
                </MDBox>
                <MDInput
                  type="date"
                  fullWidth
                  name="endDate"
                  value={filters.endDate}
                  onChange={(e: any) => handleFilterChange("endDate", e.target.value)}
                  inputProps={{
                    style: {
                      height: "14px",
                    },
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </MDBox>
            </MDBox>
            <MDBox
              className="filter-row"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MDBox className="select-container">
                <MDBox
                  component="label"
                  className="filter-label"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Proje:
                </MDBox>
                <Autocomplete
                  options={ticketProjectData}
                  multiple
                 getOptionLabel={(option) =>
                        option.subProjectName
                          ? `${option.name} - ${option.subProjectName}`
                          : option.name
                      }
                  value={
                    ticketProjectData.filter((ticketProject) =>
                      filters.ticketProject?.includes(ticketProject.id.toString())
                    ) || []
                  }
                  onChange={(_, newValue) => {
                    const newStatusIds = newValue.map((item) => item.id.toString());

                    handleFilterChange("ticketProject", newStatusIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Proje Seçiniz"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.name}
                        {...getTagProps({ index })}
                        sx={{
                          m: 0.5,
                          borderRadius: "6px",
                          backgroundColor: "primary.light",
                          color: "primary.dark",
                        }}
                      />
                    ))
                  }
                />
              </MDBox>
            </MDBox>

            <MDBox
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #eee",
                pt: 3,
              }}
            >
              <MDBox display="flex" gap={2}>
                {isAnyFilterActive() && (
                  <MDButton
                    onClick={clearFilters}
                    variant="outlined"
                    color="error"
                    sx={{
                      px: 2,
                      py: 1,
                      minWidth: "150px",
                      borderRadius: "8px",
                      opacity: 1,

                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "white",
                        transform: "translateY(-1px)",
                      },
                    }}
                    startIcon={<Icon>clear</Icon>}
                  >
                    {t("ns1:TicketPage.TicketTablePage.FilterProps.FiltreleriTemizle")}
                  </MDButton>
                )}
              </MDBox>

              <MDBox display="flex" gap={2}>
                <MDButton onClick={addCache} variant="outlined" color="success">
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.FiltreKaydet")}
                </MDButton>

                <MDButton
                  onClick={filterButton}
                  variant="gradient"
                  color="info"
                  sx={{
                    px: 2,
                    py: 1,
                    minWidth: "150px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
                    marginLeft: "auto",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                  startIcon={<Icon>filter_list</Icon>}
                >
                  {t("ns1:TicketPage.TicketTablePage.FilterProps.Filtrele")}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>

      <Dialog open={openSearchDialog} maxWidth="md" fullWidth>
        <DialogTitle>{t("ns1:TicketPage.TicketTablePage.AramaYapin")}</DialogTitle>
        <DialogContent dividers>
          <Grid item xs={12} sm={6} lg={5.75}>
            <MDInput
              fullWidth
              sx={{ mb: 3.2 }}
              label={t("ns1:TicketPage.TicketTablePage.TalepNumarasi")}
              value={searchTalepNo}
              onChange={(e: any) => setSearchTalepNo(e.target.value)}
            />
          </Grid>
          {searchedData.length === 0 ? (
            <Typography variant="body1" align="center">
              {searchMsj}
            </Typography>
          ) : (
            <>
              <DataTable
                table={{
                  columns: column,
                  rows: searchedData,
                }}
              ></DataTable>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton sx={{ mr: 2 }} variant="outlined" color="success" onClick={onSearchButton}>
            {t("ns1:TicketPage.TicketTablePage.AramaYap")}
          </MDButton>
          <MDButton sx={{ mr: 2 }} variant="outlined" color="primary" onClick={onCloseSearchDialog}>
            {t("ns1:TicketPage.TicketTablePage.Kapat")}
          </MDButton>
        </DialogActions>
      </Dialog>

      {historyDialogOpen && (
        <HistoryDialog
          ticketId={selectedTicket}
          isOpen={historyDialogOpen}
          onClose={() => sethistoryDialogOpen(false)}
        />
      )}

      {aprHistoryOpen && (
        <ShowHistory
          approveId={selectedAprHis}
          open={aprHistoryOpen}
          onClose={() => setaprHistoryOpen(false)}
        />
      )}
    </>
  );
}

export default FilterTableMethod;
