import { MessageBoxType, ObjectPageTitle } from "@ui5/webcomponents-react";
import { MessageBox, ObjectPage } from "@ui5/webcomponents-react";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DataTable from "examples/Tables/DataTable";
import { Card, Grid, Typography, Tooltip, alpha, Box } from "@mui/material";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FilterCalendar, { filterData } from "../components/filter/filter";
import getConfiguration from "confiuration";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import EventModal from "../components/eventmodal";
import "../list/index.css";

import {
  HolidaysAndLeavesDto,
  UserCalendarApi,
  UserCalendarListDto,
  UserWeeklyTasksDto,
  UserCalendarUpdateDto,
  TicketDepartmentsApi,
  PositionsApi,
  PositionListDto,
  UserApi,
} from "api/generated";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { getDateRangeFromWeek } from "../utils/utils";
import * as XLSX from "xlsx";
import { visibility } from "html2canvas/dist/types/css/property-descriptors/visibility";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { Check, Close } from "@mui/icons-material";

export const colors = {
  primary: "#4F46E5", // Indigo primary
  success: "#10B981", // Emerald green
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Modern red
  text: {
    primary: "#1E293B", // Slate 800
    secondary: "#64748B", // Slate 500
    disabled: "#94A3B8", // Slate 400
  },
  background: {
    paper: "#FFFFFF",
    default: "#F8FAFC", // Slate 50
    hover: "#F1F5F9", // Slate 100
  },
  border: "#E2E8F0", // Slate 200
};

function CalendarList() {
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const [modalEventOpen, setModalEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    start: "",
    end: "",
  });
  const navigate = useNavigate();
  const [hasPerm, setHasPerm] = useState(false);
  const [leavesAndHolidays, setLeavesAndHolidays] = useState<HolidaysAndLeavesDto>({
    leaves: [],
    holidays: [],
  });
  const [dataTableData, setDataTableData] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [positionsData, setPositionsData] = useState<any[]>([]);
  const [departmentsData, setDepatmentsData] = useState<any[]>([]);
  const [filterParams, setFilterParams] = useState({
    week: 0,
    year: new Date().getFullYear(),
    departmentId: "",
    userIds: [] as string[],
    levelId: 0,
    userMail: [],
    daysOfWeek: [] as string[],
    percentageId: [] as number[],
    isGetAll: false,
  });
  const [itemsPerPage, setItemsPerPage] = useState(50);
  useEffect(() => {
    fetchDepartmentsData();
    fetchPositionsData();
  }, []);
  useEffect(() => {
    if (filterParams.week > 0) {
      if (hasPerm == false && filterParams.departmentId != "" && filterParams.userIds.length > 0) {
        console.log("weekly istek atıldı");
        handleFetchTableData();
      } else if (hasPerm == true) {
        console.log("weekly istek atıldı");
        handleFetchTableData();
      } else {
      }
    }
  }, [filterParams]);
  const handleEditTask = async (updatedTask: UserCalendarListDto): Promise<void> => {
    try {
      let updateTask: UserCalendarUpdateDto = {
        id: updatedTask.id,
        name: updatedTask.name,
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        percentage: updatedTask.percentage,
        customerRefId: updatedTask.customerRefId,
        userAppId: updatedTask.userAppId,
        description: updatedTask.description,
        workLocation: updatedTask.workLocation,
      };
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      let data = await api.apiUserCalendarPut(updateTask);
      let customYear = new Date(updatedTask.startDate).getFullYear();
      let customMonth = new Date(updatedTask.startDate).getMonth() + 1;
      handleFetchTableData();
    } catch (error) {
      console.log("error", error);
    }
    // setEvents((prevEvents) =>
    //   prevEvents.map((event) => (event.id === updatedTask.id ? updatedTask : event))
    // );
  };

  // Function to get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const dayNum = now.getDay() === 0 ? 7 : now.getDay(); // Pazar'ı 7 yap
    const thursday = new Date(now);
    thursday.setDate(now.getDate() + (4 - dayNum)); // Haftanın Perşembesine git
    const yearStart = new Date(thursday.getFullYear(), 0, 1);
    const firstDayNum = yearStart.getDay() === 0 ? 7 : yearStart.getDay();
    const firstThursday = new Date(yearStart);
    firstThursday.setDate(yearStart.getDate() + (4 - firstDayNum));

    const diff = thursday.getTime() - firstThursday.getTime();
    const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
    return week;
  };

  const transformDataForTable = (
    data: UserWeeklyTasksDto[],
    leavesAndHolidayss: HolidaysAndLeavesDto
  ): any[] => {
    if (!data || data.length === 0) return [];

    const tableData: any[] = [];

    data.forEach((weeklyTask) => {
      const dayTaskMap = {
        monday: [] as any[],
        tuesday: [] as any[],
        wednesday: [] as any[],
        thursday: [] as any[],
        friday: [] as any[],
        saturday: [] as any[],
        sunday: [] as any[],
      };

      if (weeklyTask.tasks && weeklyTask.tasks.length > 0) {
        weeklyTask.tasks.forEach((task) => {
          if (!task.daysOfWeek) return;
          if (task.daysOfWeek[0]) dayTaskMap.monday.push(task);
          if (task.daysOfWeek[1]) dayTaskMap.tuesday.push(task);
          if (task.daysOfWeek[2]) dayTaskMap.wednesday.push(task);
          if (task.daysOfWeek[3]) dayTaskMap.thursday.push(task);
          if (task.daysOfWeek[4]) dayTaskMap.friday.push(task);
          if (task.daysOfWeek[5]) dayTaskMap.saturday.push(task);
          if (task.daysOfWeek[6]) dayTaskMap.sunday.push(task);
        });
      }

      const firstTask = weeklyTask.tasks?.[0];
      const userInfo = firstTask?.userAppDtoWithoutPhoto ?? {
        firstName: weeklyTask?.firstName || "",
        lastName: weeklyTask?.lastName || "",
        email: weeklyTask?.email || "",
        ticketDepartmentId: weeklyTask?.ticketDepartmentId || "",
        positionId: weeklyTask?.positionId || "",
      };

      tableData.push({
        id: weeklyTask.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        department: departmentsData.find(d => d.id === userInfo.ticketDepartmentId)?.departmentText || "",
        position: positionsData.find(d => d.id === userInfo.positionId)?.name || "",
        email: userInfo.email,
        monday: dayTaskMap.monday,
        tuesday: dayTaskMap.tuesday,
        wednesday: dayTaskMap.wednesday,
        thursday: dayTaskMap.thursday,
        friday: dayTaskMap.friday,
        saturday: dayTaskMap.saturday,
        sunday: dayTaskMap.sunday,
        leaves: leavesAndHolidayss.leaves,
        holidays: leavesAndHolidayss.holidays,
      });
    });

    return tableData;
  };

  useEffect(() => {
    const fetchDeptData = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckOtherDeptpermGet();
      setHasPerm(permData.data.perm);
      const week = getCurrentWeek();
      setCurrentWeek(week);

      if (permData.data.perm == false) {
        let api2 = new UserApi(conf);
        let response = await api2.apiUserUserDepartmentGet();
        const departmentId = response.data.id || null;

        setFilterParams((prev) => {
          const updated = {
            ...prev,
            week,
            departmentId,
          };
          return updated;
        });
      } else {
        setFilterParams((prev) => ({ ...prev, week }));
      }
    };
    fetchDeptData();
  }, []);

  useEffect(() => {
    if (filterParams.week > 0) {
      if (hasPerm == false && filterParams.departmentId != "" && filterParams.userIds.length > 0) {
        console.log("weekly istek atıldı");
        handleFetchTableData();
      } else if (hasPerm == true) {
        console.log("weekly istek atıldı");
        handleFetchTableData();
      } else {
      }
    }
  }, [filterParams]);

  const handleFetchTableData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      console.log("filterParams213213", filterParams);
      let response = await api.apiUserCalendarGetTasksByWeeklyGet(
        filterParams.year,
        filterParams.week,
        filterParams.userIds.length ? filterParams.userIds : undefined,
        filterParams.departmentId || undefined,
        filterParams.levelId || undefined,
        filterParams.daysOfWeek.length ? filterParams.daysOfWeek : undefined,
        filterParams.percentageId.length ? filterParams.percentageId : undefined,
        filterParams.isGetAll || undefined
      );
      console.log("responseweekly", response.data);
      let leavesResponse = await api.apiUserCalendarGetEmployeeLeavesByWeeklyGet(
        filterParams.year,
        filterParams.week,
        filterParams.userMail.length ? filterParams.userMail : undefined
      );

      if (response.data && leavesResponse.data) {
        const transformedData = transformDataForTable(response.data, leavesResponse.data);
        setDataTableData(transformedData);
        setLeavesAndHolidays(leavesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      dispatchAlert({
        message: "Haftalık görev verileri yüklenirken bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchPositionsData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new PositionsApi(conf);
      let response = await api.apiPositionsGetPositionsByCompanyGet(
        "2e5c2ba5-3eb8-414d-8bc7-08dd44716854"
      );
      setPositionsData(response.data);
      console.log("positionsdata", response.data);
    } catch (error) {
      dispatchAlert({
        message: "Pozisyon bilgisi çekilirken bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const fetchDepartmentsData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new TicketDepartmentsApi(conf);
      let response = await api.apiTicketDepartmentsAllFilteredCompanyGet(
        "2e5c2ba5-3eb8-414d-8bc7-08dd44716854"
      );
      setDepatmentsData(response.data);
      console.log("departmentssdata", response.data);
    } catch (error) {
      dispatchAlert({
        message: "Departman bilgisi çekilirken bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const handleFilterApply = (filterData: filterData) => {
    setFilterParams({
      week: parseInt(filterData.week) || currentWeek,
      year: parseInt(filterData.year) || currentYear,
      departmentId: filterData.selectedDepartmentForm || "",
      userIds: filterData.selectedUsers?.map((user: any) => user.id) || [],
      userMail: filterData.selectedUsers?.map((user: any) => user.email) || [],
      levelId: filterData.selectedLevelForm || null,
      daysOfWeek: (filterData.selectedDays || []).map(String),
      percentageId: (filterData.selectedPercentage || []).map(Number),
      isGetAll: filterData.showAll ?? false,
    });
  };

  const isTeamManager = () => {
    navigate("/calendar/detail");
  };

  // Define a consistent color palette

  const getTaskColor = (percentage: number) => {
    // Convert to number if it's a string
    const percentValue = Number(percentage);

    if (percentValue < 25) {
      return colors.success; // Low workload - good
    } else if (percentValue < 50) {
      return "#f9a825"; // Medium workload - caution - yellow
    } else if (percentValue < 75) {
      return colors.warning; // High workload - warning - orange
    } else if (percentValue <= 100) {
      return colors.error; // High workload - warning - red
    }
    return colors.primary; // Default
  };

  const renderTasksWithTooltip = (tasks: any, day: string, row?: any) => {
    if (!tasks || tasks.length === 0) {
      const holiday = leavesAndHolidays.holidays?.find((h: any) => h.dayOfWeek === day);
      const leave = leavesAndHolidays.leaves?.find(
        (l: any) => l.dayOfWeek === day && l.mail.toLowerCase() === row.original.email.toLowerCase()
      );

      if (holiday) {
        return (
          <div className="w-full">
            <div className="py-1 px-2 rounded bg-blue-50 border border-blue-100 flex items-center">
              <span className="text-blue-700 text-sm font-medium truncate">
                {holiday.resmi_Tatil}
              </span>
            </div>
          </div>
        );
      }

      if (leave) {
        return (
          <div className="w-full">
            <div className="py-1 px-2 rounded bg-purple-50 border border-purple-100 flex items-center">
              <span className="text-purple-700 text-sm font-medium truncate">{leave.atext}</span>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center w-full">
          <span className="text-slate-400">—</span>
        </div>
      );
    }

    const mainTask = tasks[0];
    const taskColor = getTaskColor(mainTask.percentage);

    const holiday = leavesAndHolidays.holidays?.find((h: any) => h.dayOfWeek === day);
    const leave = leavesAndHolidays.leaves?.find(
      (l: any) => l.dayOfWeek === day && l.mail.toLowerCase() === row.original.email.toLowerCase()
    );
    if (tasks.length === 1) {
      if (holiday) {
        return (
          <div className="w-full space-y-1">
            <div className="py-1 px-2 rounded bg-blue-50 border border-blue-100 flex items-center">
              <span className="text-blue-700 text-sm font-medium truncate">
                {holiday.resmi_Tatil}
              </span>
            </div>
            <div
              className="py-1 px-2 rounded-md text-sm flex items-center"
              style={{
                color: "#fff",
                backgroundColor: taskColor,
              }}
            >
              <span className="truncate">
                {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
              </span>
            </div>
          </div>
        );
      }

      if (leave) {
        return (
          <div className="w-full space-y-1">
            <div className="py-1 px-2 rounded bg-purple-50 border border-purple-100 flex items-center">
              <span className="text-purple-700 text-sm font-medium truncate">
                {" "}
                <span className="text-gray-800">İzinli - </span>
                {leave.atext}
              </span>
            </div>
            <div
              className="py-1 px-2 rounded-md text-sm flex items-center"
              style={{
                color: "#fff",
                backgroundColor: taskColor,
              }}
            >
              <span className="truncate">
                {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full">
          <div
            className="py-1 px-2 rounded-md text-sm flex items-center cursor-pointer"
            style={{
              color: "#fff",
              backgroundColor: taskColor,
            }}
            // onClick={(e: React.MouseEvent) => {
            //   e.stopPropagation();
            //   setSelectedEvent({
            //     id: mainTask.id,
            //     name: mainTask.name || "",
            //     startDate: mainTask.startDate || "",
            //     endDate: mainTask.endDate || "",
            //     color: mainTask.color || "",
            //     customerRef: mainTask.customerRef || null,
            //     description: mainTask.description || "",
            //     userAppDto: mainTask.userAppDto || null,
            //     userAppDtoWithoutPhoto: mainTask.userAppDtoWithoutPhoto || null,
            //     customerRefId: mainTask.customerRefId || null,
            //     userAppId: mainTask.userAppId || null,
            //     percentage: mainTask.percentage || "0",
            //     workLocation: mainTask.workLocation || null,
            //   });
            //   setModalEventOpen(true);
            // }}
          >
            <span className="truncate">
              {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
            </span>
            {mainTask.isAvailable ? (
              <div className="availability-indicator available ml-1">
                <Check sx={{ fontSize: "11px" }} />
                <span className="availability-text">Müsait</span>
              </div>
            ) : (
              <div
                className="availability-indicator unavailable ml-1"
                style={{ visibility: "hidden" }}
              >
                <Close sx={{ fontSize: "11px" }} />
                <span className="availability-text">Müsait Değil</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    const cardContent = () => {
      if (holiday) {
        return (
          <div className="w-full space-y-1">
            <div className="py-1 px-2 rounded bg-blue-50 border border-blue-100 flex items-center">
              <span className="text-blue-700 text-sm font-medium truncate">
                {holiday.resmi_Tatil}
              </span>
            </div>
            <div
              className="py-1 px-2 rounded-md text-sm flex items-center justify-between"
              style={{
                color: "#fff",
                backgroundColor: taskColor,
              }}
            >
              <span className="truncate mr-1">
                {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
              </span>
              <span
                className="flex-shrink-0 bg-white text-xs rounded px-1 py-0.5"
                style={{ color: taskColor }}
              >
                +{tasks.length - 1}
              </span>
            </div>
          </div>
        );
      }

      if (leave) {
        return (
          <div className="w-full space-y-1">
            <div className="py-1 px-2 rounded bg-purple-50 border border-purple-100 flex items-center">
              <span className="text-purple-700 text-sm font-medium truncate">{leave.atext}</span>
            </div>
            <div
              className="py-1 px-2 rounded-md text-sm flex items-center justify-between"
              style={{
                color: "#fff",
                backgroundColor: taskColor,
              }}
            >
              <span className="truncate mr-1">
                {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
              </span>
              <span
                className="flex-shrink-0 bg-white text-xs rounded px-1 py-0.5"
                style={{ color: taskColor }}
              >
                +{tasks.length - 1}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full">
          <div
            className="py-1 px-2 rounded-md text-sm flex items-center justify-between cursor-pointer"
            style={{
              color: "#fff",
              backgroundColor: taskColor,
            }}
          >
            <span className="truncate mr-1">
              {`${mainTask.name} - ${mainTask.customerRef?.name || ""}`}
            </span>
            <div className="flex items-center">
              {mainTask.isAvailable ? (
                <div className="availability-indicator available">
                  <Check sx={{ fontSize: "11px" }} />
                  <span className="availability-text">Müsait</span>
                </div>
              ) : (
                <div
                  className="availability-indicator unavailable"
                  style={{ visibility: "hidden" }}
                >
                  <Close sx={{ fontSize: "11px" }} />
                  <span className="availability-text">Müsait Değil</span>
                </div>
              )}
              <span
                className="flex-shrink-0 bg-white text-xs rounded px-1 py-0.5 ml-1"
                style={{ color: taskColor }}
              >
                +{tasks.length - 1}
              </span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <Tooltip
        title={
          <div className="p-1.5">
            {holiday && (
              <div className="mb-2 py-1 px-2 rounded bg-blue-50 border border-blue-100">
                <span className="text-blue-700 text-sm font-medium">{holiday.resmi_Tatil}</span>
              </div>
            )}

            {leave && (
              <div className="mb-2 py-1 px-2 rounded bg-purple-50 border border-purple-100">
                <span className="text-purple-700 text-sm font-medium">{leave.atext}</span>
              </div>
            )}

            <div className="font-medium text-sm text-gray-600 mb-1">Tasks:</div>

            {tasks.map((task: any, index: number) => {
              const color = getTaskColor(task.percentage);
              return (
                <div
                  key={index}
                  className="py-1 px-2 rounded-md mb-1 text-sm"
                  style={{
                    color: "#fff",
                    backgroundColor: color,
                  }}
                >
                  <span className="font-medium">
                    {`${task.name} - ${task.customerRef?.name || ""}`}
                  </span>
                  {task.isAvailable ? (
                    <div className="availability-indicator available ml-1">
                      <Check
                        sx={{
                          fontSize: "11px",
                          backgroundColor: "rgba(104, 216, 108, 0.9) !important",
                        }}
                      />
                      <span className="availability-text">Müsait</span>
                    </div>
                  ) : (
                    <div
                      className="availability-indicator unavailable ml-1"
                      style={{ visibility: "hidden" }}
                    >
                      <Close sx={{ fontSize: "11px" }} />
                      <span className="availability-text">Müsait Değil</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: colors.background.paper,
              color: colors.text.primary,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: `1px solid ${colors.border}`,
              p: 1,
              borderRadius: "6px",
              maxWidth: "300px",
            },
          },
          arrow: {
            sx: {
              color: colors.background.paper,
            },
          },
        }}
      >
        <div className="w-full cursor-pointer">{cardContent()}</div>
      </Tooltip>
    );
  };

  const [selectedEvent, setSelectedEvent] = useState<UserCalendarListDto | null>(null);

  const tableColumns = [
    // {
    //   Header: "email",
    //   accessor: "email",
    //   width: "0rem",
    // },
    {
      Header: "Ad",
      accessor: "firstName",
      width: "120px",
    },
    {
      Header: "Soyad",
      accessor: "lastName",
      width: "120px",
    },
    {
      Header: "Departman",
      accessor: "department",
      width: "120px",
    },
    {
      Header: "Pozisyon",
      accessor: "position",
      width: "120px",
    },
    {
      Header: "Pazartesi",
      accessor: "monday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "monday", row),
      width: "150px",
    },
    {
      Header: "Salı",
      accessor: "tuesday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "tuesday", row),
      width: "150px",
    },
    {
      Header: "Çarşamba",
      accessor: "wednesday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "wednesday", row),
      width: "150px",
    },
    {
      Header: "Perşembe",
      accessor: "thursday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "thursday", row),
      width: "150px",
    },
    {
      Header: "Cuma",
      accessor: "friday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "friday", row),
      width: "150px",
    },
    {
      Header: "Cumartesi",
      accessor: "saturday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "saturday", row),
      width: "150px",
    },
    {
      Header: "Pazar",
      accessor: "sunday",
      Cell: ({ value, row }: { value: any; row: any }) =>
        renderTasksWithTooltip(value, "sunday", row),
      width: "150px",
    },
  ];

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0-indexlidir
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const handleExcelExport = async () => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      let response = await api.apiUserCalendarGetTasksByWeeklyGet(
        filterParams.year,
        filterParams.week,
        filterParams.userIds.length ? filterParams.userIds : undefined,
        filterParams.departmentId || undefined,
        filterParams.levelId || undefined,
        filterParams.daysOfWeek.length ? filterParams.daysOfWeek : undefined,
        filterParams.percentageId || undefined
      );

      if (response.data) {
        type ExportRow = {
          Firstname: string;
          Lastname: string;
          Customer: string;
          Task: string;
          StartDate: string;
          EndDate: string;
          Description: string;
          WorkloadPercentage: string;
        };

        const columns: (keyof ExportRow)[] = [
          "Firstname",
          "Lastname",
          "Customer",
          "Task",
          "StartDate",
          "EndDate",
          "Description",
          "WorkloadPercentage",
        ];

        const dataToExport: ExportRow[] = response.data.flatMap((item) =>
          item.tasks.map((task) => ({
            Firstname: task.userAppDtoWithoutPhoto?.firstName ?? "",
            Lastname: task.userAppDtoWithoutPhoto?.lastName ?? "",
            Customer: task.customerRef?.name ?? "",
            Task: task.name ?? "",
            StartDate: formatDate(task.startDate) ?? "",
            EndDate: formatDate(task.endDate) ?? "",
            Description: task.description ?? "",
            WorkloadPercentage: task.percentage != null ? "%" + task.percentage : "",
          }))
        );

        const ws = XLSX.utils.json_to_sheet(dataToExport, { header: columns as string[] });

        const columnWidths = columns.map((col) => {
          const maxLength = Math.max(
            col.length,
            ...dataToExport.map((row) => (row[col] ?? "").toString().length)
          );
          return { wch: maxLength + 2 };
        });
        ws["!cols"] = columnWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Weekly Tasks");
        const fileName = `${filterParams.week}-${filterParams.year}_Tasks.xlsx`;
        XLSX.writeFile(wb, fileName);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      dispatchAlert({
        message: "Haftalık görev verileri yüklenirken bir hata oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <ObjectPage
        mode="Default"
        hidePinButton
        style={{
          height: "100%",
          marginTop: "-15px",
          backgroundColor: colors.background.paper,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
        titleArea={
          <ObjectPageTitle
            style={{
              paddingTop: "28px",
              paddingLeft: "28px",
              paddingRight: "28px",
              backgroundColor: colors.background.paper,
              cursor: "default",
            }}
            actionsBar={
              <MDBox style={{ marginTop: "15px", marginRight: "15px" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => isTeamManager()}
                  size="small"
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    marginRight: "0.5rem",
                    bottom: "11px",
                    height: "2.5rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 15px rgba(79, 70, 229, 0.4)",
                    },
                    py: 1.5,
                    px: 2.5,
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",
                  }}
                >
                  Yeni Görev Oluştur
                </MDButton>
              </MDBox>
            }
          >
            <MDBox>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: colors.text.primary,
                  marginBottom: "6px",
                  fontSize: "1.5rem",
                }}
              >
                Ekip Planlama
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  fontSize: "0.95rem",
                }}
              >
                Ekip planlama yapın, görevlerinizi planlayın ve daha fazlasını yapın
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <FilterCalendar
          initialWeek={currentWeek}
          initialYear={currentYear}
          onFilterApply={handleFilterApply}
        />
        <Grid container>
          <Grid item xs={12}>
            <Card
              sx={{
                height: "100%",
                margin: "20px 20px 20px 20px",
                borderRadius: "14px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                border: `1px solid ${colors.border}`,
                overflow: "hidden",
              }}
            >
              <MDBox
                p={3}
                pb={0}
                sx={{
                  "& .MuiTableRow-root": {
                    borderBottom: `1px solid ${colors.border} !important`,
                    transition: "background-color 0.2s ease",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: `${colors.background.hover} !important`,
                  },
                  "& .MuiTableCell-root": {
                    borderBottom: `1px solid ${colors.border} !important`,
                    borderColor: `${colors.border} !important`,
                    padding: "16px 12px",
                    fontSize: "0.875rem",
                    color: colors.text.primary,
                  },
                  "& .MuiTableHead-root .MuiTableRow-root": {
                    borderBottom: `1px solid ${colors.border} !important`,
                    backgroundColor: colors.background.default,
                  },
                  "& .MuiTableHead-root .MuiTableCell-root": {
                    borderBottom: `1px solid ${colors.border} !important`,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: colors.text.secondary,
                  },
                  "& .MuiTablePagination-root": {
                    borderTop: `1px solid ${colors.border}`,
                  },
                  "& .MuiInputBase-root": {
                    marginBottom: "16px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    "& .MuiInputBase-input": {
                      padding: "10px 14px",
                    },
                  },
                  "& .MuiTablePagination-select": {
                    border: `1px solid ${colors.border}`,
                    borderRadius: "6px",
                    paddingTop: "6px",
                    paddingBottom: "6px",
                  },
                }}
              >
                <MDBox
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <MDButton variant="gradient" color="info" onClick={handleExcelExport}>
                    Excel Export{" "}
                  </MDButton>
                </MDBox>
                <div style={{ overflowX: "auto", height: "100%" }}>
                  <div className="calendar-list-table">
                    <DataTable
                      table={{ columns: tableColumns, rows: dataTableData }}
                      entriesPerPage={{ defaultValue: 50, entries: [5, 10, 15, 20, 50, 100] }}
                      canSearch
                      isSorted
                      showTotalEntries
                      setItemsPerPage={setItemsPerPage}
                      noEndBorder
                      pagination={{
                        variant: "gradient",
                        color: "info",
                      }}
                    />
                  </div>
                </div>
              </MDBox>
            </Card>
          </Grid>
          {/* <EventModal
            open={modalEventOpen}
            onClose={() => setModalEventOpen(false)}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onEditEvent={handleEditTask}
          /> */}
        </Grid>
      </ObjectPage>
      <Footer />
    </DashboardLayout>
  );
}

export default CalendarList;
