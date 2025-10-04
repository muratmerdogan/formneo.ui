import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Calendar from "examples/Calendar";
import React, { useState, ChangeEvent, useMemo, useEffect, useCallback } from "react";
import calendarEventsData from "layouts/applications/calendar/data/calendarEventsData";
import {
  Modal,
  Grid,
  IconButton,
  Icon,
  Autocomplete,
  Tooltip,
  AutocompleteProps,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Check, Close, Edit, Person } from "@mui/icons-material";
import { Box } from "@mui/system";
import TaskModal from "./components/taskmodal";
import EventModal from "./components/eventmodal";
import {
  TicketApi,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
  TicketTeamApi,
  TicketTeamUserAppInsertDto,
  UserApp,
  WorkCompanyDto,
  DepartmentUserListDto,
  UserCalendarApi,
  UserCalendarListDto,
  UserCalendarUpdateDto,
  UserCalendarInsertDto,
  WorkLocation,
  UserApi,
  UserAppDto,
} from "api/generated/api";
import { getCurrentDate, getUserInitials } from "./utils/utils";
import { calendarOptions } from "./config/calendarConfig";
import MDAvatar from "components/MDAvatar";
import getConfiguration from "confiuration";
import "./css/styles.css";
import "./index.css";
import { useBusy } from "../hooks/useBusy";
import { useAlert } from "../hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import CustomMessageBox from "../Components/CustomMessageBox";
import { colors } from "./list";
import { useLocation, Link, useNavigate } from "react-router-dom";

export interface TaskEvent {
  title: string;
  start: string;
  end: string;
  className: string;
  client: WorkCompanyDto;
  description: string;
  // workName: string;
  id?: string | number;
}

// Define DateClickArg type
interface DateClickArg {
  AllDay: boolean;
  end: Date;
  endStr: string;
  jsEvent: MouseEvent;
  view: object;
  start: Date;
  startStr: string;
}

// Define SelectArg type for date selection/drag
interface SelectArg {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
  jsEvent: MouseEvent;
  view: object;
}

// Define DatesSetArg for date navigation events
interface DatesSetArg {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  view: {
    currentStart: Date;
    currentEnd: Date;
    type: string;
    [key: string]: any;
  };
}

// Define EventContentArg for custom rendering with more accurate types
interface EventContentArg {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;

    extendedProps: {
      className?: string;
      customerRef?: WorkCompanyDto;
      customerRefId?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      color?: string;
      userApp?: UserApp;
      userAppId?: string;
      workLocation?: WorkLocation;
      isLeave?: boolean;
      firstName?: string;
      lastName?: string;
      mail?: string;
      [key: string]: any;
      status?: string;
      isAvailable: boolean;
    };
  };
  timeText: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  isFuture: boolean;
  isToday: boolean;
  el: HTMLElement;
  view: object;
}

function CalendarPage(): JSX.Element {
  // Add IDs to events that don't have them
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    start: "",
    end: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<UserCalendarListDto | null>(null);
  const [modalEventOpen, setModalEventOpen] = useState(false);
  const [selfID, setSelfID] = useState<string>("");
  const [teamUsers, setTeamUsers] = useState<UserApp[]>([]);
  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<TicketDepartmensListDto | null>(
    null
  );
  // const [selectedUsers, setSelectedUsers] = useState<UserApp[]>([]);
  const [levelData, setLevelData] = useState<any[]>([]);
  const [levelledUsers, setLevelledUsers] = useState<UserApp[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserApp[]>([]);
  const [isQuestionmessageBoxOpen, setIsQuestionmessageBoxOpen] = useState(false);
  const [isQuestionmessageBoxOpenLeaveEvent, setIsQuestionmessageBoxOpenLeaveEvent] =
    useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventStartDate, setSelectedEventStartDate] = useState<string | null>(null);
  const [selectedEventEndDate, setSelectedEventEndDate] = useState<string | null>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [searchByName, setSearchByName] = useState<UserAppDto[]>([]);
  const [selectedFieldUsers, setSelectedFieldUsers] = useState<UserApp[]>([]);
  const [userData, setUserData] = useState<UserApp[]>([]);
  const [hasPerm, setHasPerm] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //     const mainTask = location.state?.mainTask;
  //     console.log(mainTask);
  //     if (mainTask) {
  //       setSelectedEvent(mainTask);
  //       setModalEventOpen(true);

  //       // URL'den state'i temizle
  //       navigate(location.pathname, { replace: true });
  //     }
  //   }, [location, navigate]);

  useEffect(() => {
    console.log("eventsss", events);
  }, [events]);

  const handleSearchByName = async (value: string) => {
    if (value === "") {
      setSearchByName([]);
    } else {
      dispatchBusy({ isBusy: true });

      var conf = getConfiguration();
      var api = new UserApi(conf);
      var data = await api.apiUserGetAllUsersAsyncWitNameGet(value);
      var pureData = data.data;
      setSearchByName(pureData);

      dispatchBusy({ isBusy: false });
    }
  };

  const handleMessageBoxOpen = (eventId: string, eventStartDate: string, eventEndDate: string) => {
    setIsQuestionmessageBoxOpen(true);
    setSelectedEventId(eventId);
    setSelectedEventStartDate(eventStartDate);
    setSelectedEventEndDate(eventEndDate);
  };

  const handleCloseQuestionBox = async (action: string) => {
    if (action === "Evet") {
      await handleDeleteTask(selectedEventId, selectedEventStartDate, selectedEventEndDate);
    }
    setIsQuestionmessageBoxOpen(false);
  };

  const handleCloseQuestionBoxLeaveEvent = async (action: string) => {
    if (action === "Evet") {
      setModalOpen(true);
    }
    setIsQuestionmessageBoxOpenLeaveEvent(false);
  };

  useEffect(() => {
    const fetchIsManager = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckUserIsManagerGet();
      setIsManager(permData.data.perm);
    };
    const fetchHasPerm = async () => {
      let conf = getConfiguration();
      let api1 = new UserCalendarApi(conf);
      const permData = await api1.apiUserCalendarCheckOtherDeptpermGet();
      setHasPerm(permData.data.perm);

      if (permData.data.perm == false) {
        fetchUserDepartmentData();
      } else {
        fetchDepartmentData();
      }
    };
    const fetchSelfID = async () => {
      let conf = getConfiguration();
      let api = new TicketApi(conf);
      let data = await api.apiTicketCheckPermGet();
      setSelfID(data.data.id);
    };
    const fetchDepartmentData = async () => {
      let conf = getConfiguration();
      let api3 = new TicketDepartmentsApi(conf);    
      let response = await api3.apiTicketDepartmentsAllOnlyNameGet();
      setDepartmentData(response.data);
    };
    const fetchLevelData = async () => {
      let conf = getConfiguration();
      let api = new UserApi(conf);
      let data = await api.apiUserUserLevelsGet();
      setLevelData(data.data as any);
    };
    const fetchUserData = async () => {
      let conf = getConfiguration();
      let api = new UserApi(conf);
      let data = await api.apiUserGetAllWithOuthPhotoGet();
      setUserData(data.data as any);
    };
    const fetchUserDepartmentData = async () => {
      setIsLoading(true);
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api2 = new UserApi(conf);
      let response = await api2.apiUserUserDepartmentGet();
      setSelectedDepartment(response.data);

      //Standart kullanıcı tipi ise kişi seçili gelir
      try {
        let api1 = new UserCalendarApi(conf);
        const permData = await api1.apiUserCalendarCheckUserIsManagerGet();

        if (permData.data.perm == false) {
          let conf = getConfiguration();
          let api = new UserCalendarApi(conf);
          let userIds;

          if (selectedFieldUsers) {
            userIds = selectedFieldUsers.map((user) => user.id);
          }

          let data = await api.apiUserCalendarGetUsersByDepartmentAndLevelGet(
            response.data.id,
            selectedLevel?.id,
            userIds
          );
          if (hasPerm == false && isManager == false) {
            setSelectedUsers(data.data);
          }
          const filteredUsers: UserApp[] = [];
          data.data.forEach((user: UserApp) => {
            if (user) {
              filteredUsers.push(user);
            }
          });
          setTeamUsers(data.data);
          console.log("teamusers", data.data);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
        dispatchBusy({ isBusy: false });
      }
    };
    fetchIsManager();
    fetchHasPerm();
    fetchSelfID();
    fetchLevelData();
    fetchUserData();
  }, []);

  const handleDateClick = (info: DateClickArg): void => {
    let startDate = info.startStr;
    let endDate = info.endStr;

    setSelectedDate({
      start: startDate,
      end: endDate,
    });
    setModalOpen(true);
  };

  const handleDateSelect = (info: SelectArg): void => {
    let startDate = info.startStr;
    let endDate = info.endStr;

    const selectedDate = new Date(endDate);
    selectedDate.setDate(selectedDate.getDate() - 1);
    const adjustedDate = selectedDate.toISOString().split("T")[0];

    setSelectedDate({
      start: startDate,
      end: adjustedDate,
    });

    console.log("events", events);

    // Check if leave or holiday events exist in the selected date range
    const hasEventInRange = events.some((event) => {
      if (event.color === "leave-event" || event.color === "holiday-event") {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(adjustedDate);

        // Aralık çakışması kontrolü
        return eventStart <= rangeEnd && eventEnd > rangeStart;
      }
      return false;
    });

    if (hasEventInRange) {
      setIsQuestionmessageBoxOpenLeaveEvent(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleAddTask = async (newTask: UserCalendarInsertDto): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("addhandle");
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      console.log("newtask",newTask)
      let data = await api.apiUserCalendarPost(newTask);
      let customYear = new Date(newTask.startDate).getFullYear();
      let customMonth = new Date(newTask.startDate).getMonth() + 1;
      fetchEvents(customYear, customMonth);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false); // Set loading complete
    }
    // setEvents((prevEvents) => [...prevEvents, newTask]);
  };

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
        isAvailable: updatedTask.isAvailable,
      };
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      let data = await api.apiUserCalendarPut(updateTask);
      let customYear = new Date(updatedTask.startDate).getFullYear();
      let customMonth = new Date(updatedTask.startDate).getMonth() + 1;
      fetchEvents(customYear, customMonth);
    } catch (error) {
      console.log("error", error);
    }
    // setEvents((prevEvents) =>
    //   prevEvents.map((event) => (event.id === updatedTask.id ? updatedTask : event))
    // );
  };

  const handleDeleteTask = async (
    eventId: string | number,
    eventStartDate: string,
    eventEndDate: string
  ): Promise<void> => {
    try {
      dispatchBusy({ isBusy: true });
      let conf = getConfiguration();
      let api = new UserCalendarApi(conf);
      let data = await api.apiUserCalendarDelete(eventId.toString());
      dispatchAlert({
        message: "Görev başarıyla silindi",
        type: MessageBoxType.Success,
      });
      let customYear = new Date(eventStartDate).getFullYear();
      let customMonth = new Date(eventStartDate).getMonth() + 1;
      fetchEvents(customYear, customMonth);
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // özelleştirilmiş event rendering
  const renderEventContent = (eventInfo: EventContentArg) => {
    const formatDate = (date: Date | null | undefined) => {
      if (!date) {
        // tekli günlerde end date null olduğu için start date kullanılıyor
        return eventInfo.event.extendedProps.start || eventInfo.event.startStr;
      }

      try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        return eventInfo.event.extendedProps.start || eventInfo.event.startStr;
      }
    };

    // add disable for not expanding the event
    if (eventInfo.event.extendedProps.isLeave) {
      return (
        <Box className="leave-event-simple">
          <span className="leave-name-reason">
            <Tooltip title={`${eventInfo.event.title} - ${eventInfo.event.extendedProps.status}`}>
              <strong>
                {eventInfo.event.extendedProps.firstName} {eventInfo.event.extendedProps.lastName}
              </strong>
            </Tooltip>
            : {eventInfo.event.title}
          </span>
        </Box>
      );
    }

    // Check if this is a holiday event
    if (eventInfo.event.extendedProps.isHoliday) {
      return (
        <Box className="holiday-event-simple">
          <Tooltip title={eventInfo.event.title}>
            <span className="holiday-name">{eventInfo.event.title}</span>
          </Tooltip>
        </Box>
      );
    }

    // Create a TaskMngListDto from the event data
    const taskData: UserCalendarListDto = {
      id: eventInfo.event.id,
      name: eventInfo.event.title,
      startDate: eventInfo.event.extendedProps.startDate || formatDate(eventInfo.event.start),
      endDate: eventInfo.event.extendedProps.endDate || formatDate(eventInfo.event.end),
      description: eventInfo.event.extendedProps.description || "",
      customerRef: eventInfo.event.extendedProps.customerRef || null,
      color: eventInfo.event.extendedProps.color || "",
      userAppDto: eventInfo.event.extendedProps.userAppDto || null,
      customerRefId: eventInfo.event.extendedProps.customerRefId || null,
      userAppId: eventInfo.event.extendedProps.userAppId || null,
      percentage: eventInfo.event.extendedProps.percentage || "0",
      workLocation: eventInfo.event.extendedProps.workLocation || null,
      userAppDtoWithoutPhoto: eventInfo.event.extendedProps.userAppDtoWithoutPhoto || null,
      isAvailable: eventInfo.event.extendedProps.isAvailable || false,
    };

    return (
      <Box className="custom-event-container" style={{ backgroundColor: taskData.color }}>
        <Box className="available-button">
          <Box className="available-status-indicator">
            {taskData.isAvailable ? (
              <Box className="available-status available">
                <Check
                  sx={{ fontSize: "12px", backgroundColor: "rgba(104, 216, 108, 0.9) !important" }}
                />
                <Typography variant="caption">Müsait</Typography>
              </Box>
            ) : (
              <Box className="available-status unavailable" style={{ visibility: "hidden"}}>
                <Close sx={{ fontSize: "12px" }} />
                <Typography variant="caption">Müsait Değil</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box className="action-buttons">
          <Box
            className="action-button edit"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedEvent({
                id: taskData.id,
                name: taskData.name || "",
                startDate: taskData.startDate || "",
                endDate: taskData.endDate || "",
                color: taskData.color || "",
                customerRef: taskData.customerRef || null,
                description: taskData.description || "",
                userAppDto: taskData.userAppDto || null,
                customerRefId: taskData.customerRefId || null,
                userAppId: taskData.userAppId || null,
                percentage: taskData.percentage || "0",
                workLocation: taskData.workLocation || null,
                isAvailable: taskData.isAvailable || false,
              });
              console.log("selectedeventttt", taskData.isAvailable);
              console.log("taskData", taskData);
              setModalEventOpen(true);
            }}
          >
            <Edit sx={{ fontSize: "10px" }} />
          </Box>

          <Box
            className="action-button delete"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleMessageBoxOpen(
                eventInfo.event.id,
                eventInfo.event.extendedProps.startDate || formatDate(eventInfo.event.start),
                eventInfo.event.extendedProps.endDate || formatDate(eventInfo.event.end)
              );
            }}
          >
            <Close sx={{ fontSize: "10px" }} />
          </Box>
        </Box>

        <Box className="event-content">
          {eventInfo.timeText && <Box className="event-time">{eventInfo.timeText}</Box>}
          <Box className="event-title">
            {taskData.userAppDto && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "2px" }}>
                <MDAvatar
                  src={`data:image/jpeg;base64,${taskData.userAppDto.photo}`}
                  alt={`${taskData.userAppDto.firstName || ""} ${
                    taskData.userAppDto.lastName || ""
                  }`}
                  size="xs"
                  sx={{
                    width: "28px",
                    height: "28px",
                    mr: "4px",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Box component="span" sx={{ fontSize: "11px", fontWeight: 650, opacity: 0.95 }}>
                  {taskData.userAppDto.firstName} {taskData.userAppDto.lastName}
                </Box>
              </Box>
            )}
            {taskData.name}
          </Box>
          {taskData.customerRef && <Box className="event-client">{taskData.customerRef.name}</Box>}
        </Box>
      </Box>
    );
  };

  const handleUserClick = (user: UserApp) => {
    // Mevcut render cycle'dan çıktıktan sonra state'i güncelleyelim
    setTimeout(() => {
      setSelectedUsers((prevUsers) => {
        const isAlreadySelected = prevUsers.some((u) => u.id === user.id);
        if (isAlreadySelected) {
          return prevUsers.filter((u) => u.id !== user.id);
        } else {
          return [...prevUsers, user];
        }
      });
    }, 0);
  };

  const fetchEvents = useCallback(
    async (customYear?: number, customMonth?: number) => {
      if (!selectedDepartment && !selectedLevel && selectedFieldUsers.length === 0) return;

      try {
        dispatchBusy({ isBusy: true });

        const conf = getConfiguration();
        const api = new UserCalendarApi(conf);

        // Filtre kullanıcıları
        const userIds =
          selectedUsers.length > 0
            ? selectedUsers.map((user) => user.id)
            : teamUsers.map((user) => user.id);

        const userEmails = selectedUsers.map((user) => user.email);

        if (userIds.length === 0) {
          setEvents([]);
          return;
        }

        const now = new Date();
        const year = customYear;
        const month = customMonth;

        console.log("year and month", year, month);

        const { data: userLeavesAndHolidays } =
          (await api.apiUserCalendarGetEmployeeLeavesByMonthlyGet(year, month, userEmails)) as any;
        console.log("userLeavesAndHolidays raw response:", userLeavesAndHolidays);

        // Updated Leave interface to correctly match the API response structure
        interface LeaveItem {
          pernr: string;
          atext: string;
          begda: string;
          endda: string;
          vorna: string;
          nachn: string;
          mail: string;
          status: string;
        }

        interface HolidayItem {
          tarih: string;
          resmi_Tatil: string;
        }

        // Extract leaves from response
        const leaveItems: LeaveItem[] = [];
        const holidayItems: HolidayItem[] = [];

        // Direct extraction from the format shown in the screenshot
        if (userLeavesAndHolidays && typeof userLeavesAndHolidays === "object") {
          // Look for a 'holidays' property directly on the response
          if (userLeavesAndHolidays.holidays && Array.isArray(userLeavesAndHolidays.holidays)) {
            console.log("Found holidays array:", userLeavesAndHolidays.holidays);
            holidayItems.push(...userLeavesAndHolidays.holidays);
          }

          // Check if there are keys like 'leaves' or 'holidays' that might be arrays
          for (const key in userLeavesAndHolidays) {
            console.log(`Checking key: ${key}`, userLeavesAndHolidays[key]);

            if (key === "holidays" && Array.isArray(userLeavesAndHolidays[key])) {
              holidayItems.push(...userLeavesAndHolidays[key]);
            } else if (key === "leaves" && Array.isArray(userLeavesAndHolidays[key])) {
              leaveItems.push(...userLeavesAndHolidays[key]);
            }
          }
        }

        // Also check for the nested structure we expected before
        if (userLeavesAndHolidays && Array.isArray(userLeavesAndHolidays)) {
          userLeavesAndHolidays.forEach((response: any) => {
            // Extract leaves
            if (response.leaves && Array.isArray(response.leaves)) {
              leaveItems.push(...response.leaves);
            } else if (Array.isArray(response)) {
              // If response itself is an array of leaves
              leaveItems.push(...response);
            }

            // Extract holidays from nested structure if present
            if (response.holidays && Array.isArray(response.holidays)) {
              holidayItems.push(...response.holidays);
            }
          });
        }

        console.log("Extracted leave items:", leaveItems);
        console.log("Extracted holiday items:", holidayItems);

        // Filter out duplicate leave entries by creating a unique key for each leave
        const uniqueLeaves = new Map<string, LeaveItem>();
        leaveItems.forEach((leave: LeaveItem) => {
          const key = `${leave.pernr}-${leave.begda}-${leave.endda}`;
          if (!uniqueLeaves.has(key)) {
            uniqueLeaves.set(key, leave);
          }
        });

        const uniqueHolidays = new Map<string, HolidayItem>();
        holidayItems.forEach((holiday: HolidayItem) => {
          if (!uniqueHolidays.has(holiday.tarih)) {
            uniqueHolidays.set(holiday.tarih, holiday);
          }
        });

        const leaveEvents = Array.from(uniqueLeaves.values()).map((leave: LeaveItem) => {
          const endDate = new Date(leave.endda);
          endDate.setDate(endDate.getDate() + 1);
          const adjustedEndDate = endDate.toISOString().split("T")[0];

          return {
            id: `leave-${leave.pernr}-${leave.begda}`,
            title: leave.atext,
            start: leave.begda,
            end: adjustedEndDate,
            allDay: true,
            color: "leave-event",
            extendedProps: {
              isLeave: true,
              mail: leave.mail,
              firstName: leave.vorna,
              lastName: leave.nachn,
              status: leave.status,
            },
          };
        });

        const holidayEvents = Array.from(uniqueHolidays.values()).map((holiday: HolidayItem) => {
          const startDate = holiday.tarih;
          const endDate = new Date(holiday.tarih);
          endDate.setDate(endDate.getDate() + 1);
          const adjustedEndDate = endDate.toISOString().split("T")[0];

          return {
            id: `holiday-${holiday.tarih}`,
            title: holiday.resmi_Tatil,
            start: startDate,
            end: adjustedEndDate,

            allDay: true,
            color: "holiday-event",
            extendedProps: {
              isHoliday: true,
              holidayName: holiday.resmi_Tatil,
            },
          };
        });

        const { data } = await api.apiUserCalendarGetByUsersGet(year, month, userIds);

        // Takvim etkinliklerini hazırla
        const calendarEvents = data.map((task: any) => {
          // const endDate = task.endDate || task.startDate;
          const selectedDate = new Date(task.endDate);
          selectedDate.setDate(selectedDate.getDate() + 1);
          const adjustedDate = selectedDate.toISOString();
          var endDate = task.endDate == task.startDate ? task.endDate : adjustedDate;

          return {
            id: task.id,
            title: task.name,
            start: task.startDate,
            end: endDate,
            allDay: true,
            className: task.color,
            isAvailable: task.isAvailable,
            extendedProps: {
              customerRef: task.customerRef,
              customerRefId: task.customerRefId,
              description: task.description,
              startDate: task.startDate,
              endDate: endDate,
              color: task.color,
              userAppDto: task.userAppDto,
              userAppId: task.userAppId,
              percentage: task.percentage,
              workLocation: task.workLocation,
            },
          };
        });

        // Render döngüsünden kaçınmak için state'i asenkron güncelleyelim
        setTimeout(() => {
          setEvents([...calendarEvents, ...leaveEvents, ...holidayEvents]);
        }, 0);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    },
    [selectedUsers, teamUsers, dispatchBusy, setEvents]
  );

  useEffect(() => {
    // Sadece selectedUsers değiştiğinde ve length > 0 olduğunda fetchEvents'i çağıralım
    if (selectedUsers.length > 0) {
      // Render döngüsünü bloke etmemek için asenkron olarak çağıralım
      console.log("calıştı");
      const timer = setTimeout(() => {
        let customYear = new Date(selectedEventDate.start).getFullYear();
        let customMonth = new Date(selectedEventDate.start).getMonth() + 1;
        fetchEvents(customYear, customMonth);
        console.log("calıştı gitti");
      }, 0);

      // Cleanup function
      return () => clearTimeout(timer);
    } else {
      // 0 ise tüm etkinlikleri sıfırla
      setEvents([]);
    }
  }, [selectedUsers, fetchEvents]);

  const handleGetUsers = async () => {
    if (!selectedDepartment && !selectedLevel && selectedFieldUsers.length === 0) {
      dispatchAlert({
        message: "Lütfen bir departman veya seviye veya kullanıcı seçin",
        type: MessageBoxType.Error,
      });
      return;
    }

    if (selectedDepartment || selectedLevel || selectedFieldUsers) {
      try {
        dispatchBusy({ isBusy: true });
        let conf = getConfiguration();
        let api = new UserCalendarApi(conf);
        let userIds;

        if (selectedFieldUsers) {
          userIds = selectedFieldUsers.map((user) => user.id);
        }

        let data = await api.apiUserCalendarGetUsersByDepartmentAndLevelGet(
          selectedDepartment?.id,
          selectedLevel?.id,
          userIds
        );
        if (hasPerm == false && isManager == false) {
          setSelectedUsers(data.data);
        }
        const filteredUsers: UserApp[] = [];
        data.data.forEach((user: UserApp) => {
          if (user) {
            filteredUsers.push(user);
          }
        });

        setTeamUsers(data.data);
      } catch (erorr) {
        dispatchAlert({
          message: "Bir hata oluştu" + erorr,
          type: MessageBoxType.Error,
        });
        dispatchBusy({ isBusy: false });
      } finally {
        dispatchBusy({ isBusy: false });
      }
    } else {
      setTeamUsers([]);
    }
    setSelectedUsers([]); // Departman değişince seçili kullanıcıları sıfırla
  };

  const resetSelections = () => {
    setSelectedUsers([]);
    setTeamUsers([]);

    if (hasPerm) {
      setSelectedDepartment(null);
      setSelectedLevel(null);
      setSelectedFieldUsers([]);
    } else if (isManager) {
      setSelectedLevel(null);
      setSelectedFieldUsers([]);
    }
  };

  const MemoizedCalendar = useMemo(
    () => (
      <MDBox className="calendar-container">
        <Calendar
          initialView="dayGridMonth"
          initialDate={getCurrentDate()}
          events={events}
          selectable
          editable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          select={handleDateSelect}
          // options={calendarOptions}
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            // right: "dayGridMonth,timeGridWeek", //,timeGridDay
            right: "",
          }}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "18:00",
          }}
          weekends={true}
          allDaySlot={true}
          // Scroll optimize
          handleWindowResize={false}
          // Fast render için throttle
          rerenderDelay={10}
          datesSet={(dateInfo: DatesSetArg) => {
            const currentDate = dateInfo.view.currentStart;
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // JavaScript ay indeksi 0-11 arasında, API 1-12 bekliyor
            setSelectedEventDate({
              start: currentDate.toISOString(),
              end: currentDate.toISOString(),
            });
            if (selectedUsers.length > 0) {
              fetchEvents(year, month);
            }
          }}
        />
      </MDBox>
    ),
    [events, selectedUsers, fetchEvents]
  );

  useEffect(() => {
    console.log("selectedUsers", selectedUsers);
  }, [selectedUsers]);

  const goToCalendar = () => {
    navigate("/calendar");
  };

  return (
    <DashboardLayout>
      <MDBox className="dashboard-content">
        <DashboardNavbar />

        <div className="team-members">
          <div className="team-members__header">
            <h5 className="team-members__title">
              <MDButton
                variant="gradient"
                color="info"
                onClick={goToCalendar}
                sx={{
                  mr: 2,
                  borderRadius: "8px",
                  px: 1.25,
                  py: 1.25,
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 3px 6px rgba(64, 138, 236, 0.25)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Icon sx={{ mr: 1, fontSize: "1.1rem" }}>arrow_back_ios</Icon>
              </MDButton>
              Departman Üyeleri
            </h5>
            <div className="team-members__count">{teamUsers.length} Üye</div>
          </div>

          <div className="team-members__department-select">
            <Autocomplete<TicketDepartmensListDto, false, false, false>
              disabled={hasPerm == false}
              options={departmentData}
              value={selectedDepartment}
              onChange={(event, newValue) => {
                setSelectedDepartment(newValue);
              }}
              getOptionLabel={(option) => option.departmentText}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  label="Departman"
                  className="team-members__department-input"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(33, 150, 243, 0.5)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2196F3",
                      borderWidth: "2px",
                    },
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-endAdornment": {
                  color: "#2196F3",
                },
                "& .MuiAutocomplete-option:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.08)",
                },
                "& .MuiAutocomplete-option.Mui-focused": {
                  backgroundColor: "rgba(33, 150, 243, 0.12)",
                },
                "& .MuiAutocomplete-option.Mui-selected": {
                  backgroundColor: "rgba(33, 150, 243, 0.16)",
                },
              }}
            />
          </div>
          {(hasPerm == true || isManager == true) && (
            <div className="team-members__department-select">
              <Autocomplete
                options={levelData}
                value={selectedLevel}
                onChange={(event, newValue) => {
                  setSelectedLevel(newValue);
                }}
                getOptionLabel={(option) => option.description}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    label="Seviye"
                    className="team-members__department-input"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(33, 150, 243, 0.5)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2196F3",
                        borderWidth: "2px",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-endAdornment": {
                    color: "#2196F3",
                  },
                  "& .MuiAutocomplete-option:hover": {
                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                  },
                  "& .MuiAutocomplete-option.Mui-focused": {
                    backgroundColor: "rgba(33, 150, 243, 0.12)",
                  },
                  "& .MuiAutocomplete-option.Mui-selected": {
                    backgroundColor: "rgba(33, 150, 243, 0.16)",
                  },
                }}
              />
            </div>
          )}
          {hasPerm == true && (
            <div>
              <Autocomplete
                sx={{ mb: 3.2 }}
                options={userData}
                multiple
                getOptionLabel={(option) => {
                  if (option.firstName && option.lastName) {
                    return `${option.firstName} ${option.lastName}`;
                  }
                  return option.userName || "";
                }}
                value={selectedFieldUsers}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option.id === value.id || option.userName === value.userName;
                }}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setSelectedFieldUsers(newValue);
                  } else {
                    setSelectedFieldUsers([]);
                  }
                }}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    size="large"
                    placeholder="Kullanıcı"
                    label="Kullanıcı"
                    inputProps={{ ...params.inputProps, sx: { height: "12px" } }}
                  />
                )}
                // renderOption={(props, option) => {
                //   return (
                //     <li {...props} key={option.id} style={{ listStyle: "none" }}>
                //       {" "}
                //       <MDBox
                //         sx={{
                //           display: "flex",
                //           alignItems: "center",
                //           py: 1,
                //           mb: 1,
                //           mx: 1,
                //           cursor: "pointer",
                //         }}
                //       >
                //         <MDBox mr={2}>
                //           <MDAvatar
                //             src={`data:image/png;base64,${option.photo}`}
                //             alt={option.firstName}
                //             shadow="md"
                //           />
                //         </MDBox>
                //         <MDBox
                //           display="flex"
                //           flexDirection="column"
                //           alignItems="flex-start"
                //           justifyContent="center"
                //         >
                //           <MDTypography variant="button" fontWeight="medium">
                //             {option.firstName} {option.lastName}
                //           </MDTypography>
                //           <MDTypography variant="caption" color="text">
                //             {option.email}
                //           </MDTypography>
                //         </MDBox>
                //       </MDBox>
                //     </li>
                //   );
                // }}
              />
            </div>
          )}
          <MDBox sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            {(selectedDepartment || selectedLevel || selectedFieldUsers.length > 0) && (
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => resetSelections()}
                sx={{
                  mx: "10px",
                  borderRadius: "8px",
                  px: 4,
                  py: 1.25,
                  background: "linear-gradient(195deg, #EC407A, #D81B60)",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 3px 6px rgba(236, 64, 122, 0.25)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(236, 64, 122, 0.35)",
                    background: "linear-gradient(195deg, #F06292, #EC407A)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(236, 64, 122, 0.4)",
                  },
                }}
              >
                Sıfırla
              </MDButton>
            )}

            <MDButton
              variant="gradient"
              color="info"
              onClick={() => handleGetUsers()}
              sx={{
                borderRadius: "8px",
                px: 4,
                py: 1.25,
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 3px 6px rgba(64, 138, 236, 0.25)",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Getir
            </MDButton>

            {teamUsers.length > 0 && (
              <MDButton
                variant="outlined"
                color="info"
                onClick={() => {
                  if (selectedUsers.length === teamUsers.length) {
                    // If all are selected, deselect all
                    setSelectedUsers([]);
                  } else {
                    // Otherwise, select all
                    setSelectedUsers([...teamUsers]);
                  }
                }}
                sx={{
                  ml: 2,
                  borderRadius: "8px",
                  px: 3,
                  py: 1.25,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 10px rgba(64, 138, 236, 0.15)",
                  },
                }}
              >
                {selectedUsers.length === teamUsers.length ? "Tümünü Kaldır" : "Tümünü Seç"}
              </MDButton>
            )}
          </MDBox>

          <div className="team-members__scroll-container">
            <div className="team-members__grid">
              {teamUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                const initials = getUserInitials(user.firstName, user.lastName);
                const hasPhoto = user.photo && user.photo.length > 0;

                return (
                  <div key={user.id} className="team-members__avatar">
                    <Tooltip
                      title={
                        <div className="member-tooltip">
                          <div className="member-tooltip__name">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.department && (
                            <div className="member-tooltip__department">{user.department}</div>
                          )}
                        </div>
                      }
                      placement="bottom"
                      arrow
                    >
                      <div>
                        <div
                          className={`avatar-container ${isSelected ? "selected" : ""}`}
                          onClick={() => handleUserClick(user)}
                          tabIndex={0}
                          aria-label={`Select ${user.firstName} ${user.lastName}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleUserClick(user);
                            }
                          }}
                        >
                          {hasPhoto ? (
                            <MDAvatar
                              src={`data:image/jpeg;base64,${user.photo}`}
                              alt={`${user.firstName} ${user.lastName}`}
                              size="md"
                              sx={{
                                transition: "all 0.3s ease",
                                border: isSelected ? "2px solid #EC407A" : "2px solid transparent",
                              }}
                            />
                          ) : (
                            <MDAvatar
                              bgColor={isSelected ? "info" : "light"}
                              size="md"
                              sx={{
                                transition: "all 0.3s ease",
                                color: isSelected ? "white" : "text",
                                border: isSelected ? "2px solid #2196F3" : "2px solid #E0E0E0",
                              }}
                            >
                              {initials}
                            </MDAvatar>
                          )}
                          {isSelected && (
                            <div className="avatar-check-icon">
                              <i className="pi pi-check" style={{ fontSize: "10px" }}></i>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: hasPhoto ? "2px" : "10px",
                          }}
                        >
                          <p> {user.firstName}</p>
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>

            {teamUsers.length === 0 && (
              <div className="team-members__empty-state">
                <Icon className="team-members__empty-icon">group</Icon>
                <p className="team-members__empty-text">Henüz Departman Üyeleri bulunmamaktadır.</p>
                <p className="team-members__empty-subtext">
                  Departman seçimi yaptıktan sonra üyeleri görüntüleyebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Memoized Calendar'ı kullanıyoruz */}
        {MemoizedCalendar}

        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          onAddTask={handleAddTask}
          selectedUsers={selectedUsers.length == 1 ? selectedUsers[0] : null}
        />
        <EventModal
          open={modalEventOpen}
          onClose={() => setModalEventOpen(false)}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onEditEvent={handleEditTask}
        />
      </MDBox>
      <CustomMessageBox
        titleText="Silme İşlemi"
        contentText="Mevcut Event Silinecektir."
        type="warning"
        isQuestionmessageBoxOpen={isQuestionmessageBoxOpen}
        warningText={{ text: "Bu işlem geri alınamaz. Emin misiniz?", color: "red" }}
        handleCloseQuestionBox={handleCloseQuestionBox}
      />
      <CustomMessageBox
        titleText="İzin veya Tatil Çakışması"
        contentText="Bu tarihte izin veya resmi tatil bulunmaktadır. Devam etmek istiyor musunuz?"
        type="question"
        isQuestionmessageBoxOpen={isQuestionmessageBoxOpenLeaveEvent}
        handleCloseQuestionBox={handleCloseQuestionBoxLeaveEvent}
      />
    </DashboardLayout>
  );
}

export default CalendarPage;
