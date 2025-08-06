import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  ExcelExport,
  Filter,
  Inject,
  PdfExport,
  Reorder,
  Resize,
  Selection,
  Sort,
  TaskFieldsModel,
  Toolbar,
  DayMarkers,
  EditSettingsModel,
  PdfExportProperties,
  ColumnMenu,
  RowDD,
  RowDropEventArgs,
  ContextMenu,
  ContextMenuItem,
  LabelSettingsModel,
  PageOrientation,
  EditDialogFieldsDirective,
  EditDialogFieldDirective,
  ResourceFieldsModel,
  EditDialogFieldSettingsModel,
  DialogFieldType,
  AddDialogFieldSettingsModel,
  AddDialogFieldsDirective,
  AddDialogFieldDirective,
} from "@syncfusion/ej2-react-gantt";
import { PdfFontStyle, PdfTrueTypeFont } from "@syncfusion/ej2-pdf-export";
import { GanttComponent } from "@syncfusion/ej2-react-gantt";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-layouts/styles/material.css";
import "@syncfusion/ej2-grids/styles/material.css";
import "@syncfusion/ej2-treegrid/styles/material.css";
import "@syncfusion/ej2-react-gantt/styles/material.css";
import { registerLicense } from "@syncfusion/ej2-base";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useRef, useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

import getConfiguration from "confiuration";
import {
  ProjectTasksApi,
  ProjectTasksInsertDto,
  ProjectTasksListDto,
  ProjectTasksUpdateDto,
  TicketProjectsApi,
  TicketProjectsListDto,
  UserAppDtoOnlyNameId,
  WorkCompanyApi,
  WorkCompanyDto,
} from "api/generated";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Grid,
  Card,
  Tooltip,
} from "@mui/material";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { useLocation, useNavigate } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { font, photoBase64 } from "./font";

// force css ile rich text editori gizleme
const customStyles = `
  .e-rte-hidden{
    display: none;
  }
`;

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXlcd3RSRWRdUERxXENWYEk="
);

function ProjectChart() {
  const ganttRef = useRef<GanttComponent>(null);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const location = useLocation();
  const workCompanyId = location.state?.workCompanyId;
  const workCompanyName = location.state?.workCompanyName;
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;
  const projectSubName = location.state?.projectSubName;
  const [pdfSettings, setPdfSettings] = useState({
    fileName: ``,
    pageSize: "A0",
    includeHiddenColumn: true,
    enableFooter: false,
    enableHeader: true,
    predecessorLines: true,
  });
  const dispatch = useBusy();
  const dispatchAlert = useAlert();
  const navigate = useNavigate();
  const [resources, setResources] = useState<UserAppDtoOnlyNameId[]>([
    {
      id: "",
      userName: "",
      firstName: "",
      lastName: "",
    },
  ]);

  const resourceFields: ResourceFieldsModel = {
    id: "id",
    name: "fullName", //yaklasık line 226 da resourcesWithFullName oluşturuluyor. sonrasında buraya binding ediliyor
  };

  let isProcessingTask = false; // * burada flag-based locking yapıyoruz bu sayede aynı anda birden fazla task oluşturulamaz.

  useEffect(
    function pdfFileName() {
      if (workCompanyName && projectName) {
        // subName zorunlu alan olmadığı için boş gelebilir
        const { fileName, ...rest } = pdfSettings;
        if (projectSubName) {
          setPdfSettings({
            ...rest,
            fileName: `${workCompanyName}_${projectName}_${projectSubName}`,
          });
        } else {
          setPdfSettings({
            ...rest,
            fileName: `${workCompanyName}_${projectName}`,
          });
        }
      }
    },
    [workCompanyName, projectName, projectSubName]
  );

  useEffect(() => {
    if (
      workCompanyId === undefined ||
      workCompanyId === null ||
      projectId === undefined ||
      projectId === null
    ) {
      dispatchAlert({
        message:
          "Şirket ve proje seçimi yapılmadığı için, dashboard sayfasına yönlendiriliyorsunuz.",
        type: MessageBoxType.Error,
      });
      navigate("/projectManagement");
      return;
    }
    fetchProjectUsersData();
  }, [workCompanyId, projectId, dispatchAlert, navigate]);

  const handlePdfDialogClose = () => {
    setPdfDialogOpen(false);
  };

  const handlePdfSettingsChange = (prop: string) => (event: any) => {
    setPdfSettings({
      ...pdfSettings,
      [prop]:
        prop === "enableFooter" || prop === "enableHeader" || prop === "predecessorLines"
          ? event.target.checked
          : event.target.value,
    });
  };

  const handleExportPDF = async () => {
    if (ganttRef.current) {
      try {
        let widthLogo, heightLogo;

        const exportProperties: PdfExportProperties = {
          fileName: `${pdfSettings.fileName}.pdf`, // Dosya adında da Türkçe karakter olabilir
          pageSize: pdfSettings.pageSize as any,
          includeHiddenColumn: pdfSettings.includeHiddenColumn,
          enableFooter: pdfSettings.enableFooter,
          enableHeader: true,
          fitToWidthSettings: {
            isFitToWidth: pdfSettings.pageSize == "A0" ? true : false,
          },
          showPredecessorLines: pdfSettings.predecessorLines,
          pageOrientation: "Landscape",
          header: {
            fromTop: 0,
            height: pdfSettings.pageSize == "A0" ? 350 : 200,
            contents: [
              {
                type: "Image",
                src: photoBase64,
                position: {
                  x:
                    pdfSettings.pageSize == "A0" ? 4400 : pdfSettings.pageSize == "A4" ? 970 : null,
                  y: 0,
                },
                size: {
                  height: pdfSettings.pageSize == "A0" ? 350 : 200,
                  width: pdfSettings.pageSize == "A0" ? 1000 : 500,
                },
                style: {},
              },
            ],
          },
          ganttStyle: {
            font: new PdfTrueTypeFont(font, 12, PdfFontStyle.Bold),
          },
        };

        ganttRef.current.pdfExport(exportProperties);
        handlePdfDialogClose();
      } catch (error) {
        console.error("PDF'ye dışa aktarma sırasında hata:", error);
        dispatchAlert({
          message: "PDF dışa aktarma işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
          type: MessageBoxType.Error,
        });
      }
    }
  };

  const toolbarClick = (args: any) => {
    if (ganttRef.current) {
      if (args.item.id === ganttRef.current.element.id + "_pdfexport") {
        setPdfDialogOpen(true);
      } else if (args.item.id === ganttRef.current.element.id + "_excelexport") {
      }
    }
  };

  /**
   * Replaces duplicate TaskIDs in a dataset with new, unique IDs.
   * NOTE: This function does not update ParentID references. If a task with a
   * duplicated ID is a parent to other tasks, those relationships will be broken.
   * This should be used carefully, ideally when duplicated tasks are leaf nodes.
   * @param {object[]} data Array of task objects.
   * @returns {object[]} A new array of tasks with unique IDs.
   */
  const getUniqueId = (data: any) => {
    const seenTaskIds = new Set();
    // Find the maximum existing TaskID to serve as a starting point for new IDs.
    const maxIdValue = data.reduce(
      (max: number, task: any) => ((task.TaskID || 0) > max ? task.TaskID : max),
      0
    );
    let maxId = maxIdValue;

    return data.map((task: any) => {
      if (task.TaskID != null && seenTaskIds.has(task.TaskID)) {
        // If the ID is a duplicate, generate a new one.
        maxId++;
        return { ...task, TaskID: maxId };
      }

      if (task.TaskID != null) {
        seenTaskIds.add(task.TaskID);
      }

      // Return the task, which is either original or has a new ID.
      return task;
    });
  };

  const fetchProjectUsersData = async () => {
    try {
      if (!projectId) {
        dispatchAlert({
          message: "Proje ID'si bulunamadı. Kullanıcı verileri yüklenemedi.",
          type: MessageBoxType.Error,
        });
        return;
      }

      dispatch({ isBusy: true });
      const config = getConfiguration();
      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksGetProjectUsersGet(projectId);

      if (!response.data || !Array.isArray(response.data)) {
        dispatchAlert({
          message: "Proje kullanıcıları yüklenirken bir hata oluştu.",
          type: MessageBoxType.Error,
        });
        return;
      }

      const resourcesWithFullName = response.data.map((user) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
      }));

      setResources(resourcesWithFullName);
    } catch (error) {
      console.error("Error fetching project users data:", error);
      dispatchAlert({
        message: "Proje kullanıcıları yüklenirken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatch({ isBusy: false });
    }
  };

  const turkishToLatin = (text: string) => {
    const turkishToLatinMap = {
      İ: "I",
      ı: "i",
      Ş: "S",
      ş: "s",
      Ğ: "G",
      ğ: "g",
      Ü: "U",
      ü: "u",
      Ö: "O",
      ö: "o",
      Ç: "C",
      _: " ",
    };
    return text.replace(
      /[İıŞşĞğÜüÖöÇç_]/g,
      (match) => turkishToLatinMap[match as keyof typeof turkishToLatinMap] || match
    );
  };

  const fetchProjectData = async () => {
    try {
      if (!projectId || !workCompanyId) {
        dispatchAlert({
          message: "Proje ve şirket seçimi zorunludur.",
          type: MessageBoxType.Error,
        });
        return;
      }

      dispatch({ isBusy: true });
      const config = getConfiguration();
      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksGet(projectId);
      console.log("response", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        dispatchAlert({
          message: "Proje verileri yüklenirken bir hata oluştu.",
          type: MessageBoxType.Error,
        });
        return;
      }

      const transformedData = response.data.map((task: any) => {
        // Ensure users is always defined, even if it comes as null or undefined
        const users = task.Users || task.users || [];
        return {
          Id: task.id,
          TaskID: task.taskId,
          TaskName: turkishToLatin(task.name),
          StartDate: task.startDate,
          Duration: task.duration,
          Progress: task.progress,
          Predecessor: task.predecessor,
          ParentID: task.parentId,
          Notes: task.notes,
          IsManual: task.isManual,
          resources: users, // Use the safely handled users array
        };
      });
      const ascendingData = transformedData.sort((a: any, b: any) => a.TaskID - b.TaskID);
      console.log("ascendingData", ascendingData);
      setProjectData(ascendingData);
    } catch (error) {
      console.error("Error fetching project data:", error);
      dispatchAlert({
        message: "Proje verileri yüklenirken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatch({ isBusy: false });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (projectId && workCompanyId) {
        await fetchProjectData();
      } else {
        console.log("projectId geçersiz");
      }
    };

    fetchData();
  }, [projectId, workCompanyId]);

  const taskFields: TaskFieldsModel = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    duration: "Duration",
    endDate: "EndDate",
    progress: "Progress",
    dependency: "Predecessor",
    parentID: "ParentID", // buraya parentId alanı gösterilir
    milestone: "Milestone",
    notes: "Notes",
    manual: "IsManual",
    resourceInfo: "resources",

    // taskId: "TaskID",
  };

  const labelSettings: LabelSettingsModel = {
    rightLabel: "${taskData.TaskName}",
    taskLabel: "${Progress}%",
  };

  const editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
    allowNextRowEdit: true,
    mode: "Dialog",
    newRowPosition: "Child",
  };

  const editDialogFields: EditDialogFieldSettingsModel[] = [
    { type: "General" as DialogFieldType, headerText: "General" },
    { type: "Dependency" as DialogFieldType, headerText: "Dependency" },
    {
      type: "Resources" as DialogFieldType,
      headerText: "Assignees",
      additionalParams: {
        columns: [
          { field: "checkbox", headerText: "", width: 30, textAlign: "Center" },
          { field: "fullName", headerText: "Kullanıcı", width: 450 },
          { field: "id", headerText: "ID", width: 1, maxWidth: 1 },
          { field: "unit", headerText: "Birim", width: 1, maxWidth: 1 },
        ],
        allowFiltering: false,
      },
    },
    { type: "Notes" as DialogFieldType, headerText: "Notes" },
  ];
  const addDialogFields: AddDialogFieldSettingsModel[] = [
    { type: "General" as DialogFieldType, headerText: "General" },
    { type: "Dependency" as DialogFieldType, headerText: "Dependency" },
    {
      type: "Resources" as DialogFieldType,
      headerText: "Assignees",
      additionalParams: {
        columns: [
          { field: "checkbox", headerText: "", width: 30, textAlign: "Center" },
          { field: "fullName", headerText: "Kullanıcı", width: 450 },
          { field: "id", headerText: "ID", width: 1, maxWidth: 1 },
          { field: "unit", headerText: "Birim", width: 1, maxWidth: 1 },
        ],
        allowFiltering: false,
      },
    },
    { type: "Notes" as DialogFieldType, headerText: "Notes" },
  ];
  const toolbarOptions = [
    "Add",
    "Edit",
    "Delete",
    "Update",
    "Cancel",
    "ExpandAll",
    "CollapseAll",
    "Search",
    "ZoomIn",
    "ZoomOut",
    "ZoomToFit",
    "PrevTimeSpan",
    "NextTimeSpan",
    // "ExcelExport",
    "PdfExport",
  ];

  const createTask = async (args: any) => {
    try {
      if (isProcessingTask) {
        dispatchAlert({
          message: "Bir görev oluşturulurken hata oluştu. Lütfen daha sonra tekrar deneyin.",
          type: MessageBoxType.Error,
        });
        return;
      }
      if (!projectId) {
        dispatchAlert({
          message: "Proje ID'si bulunamadı. Görev oluşturulamadı.",
          type: MessageBoxType.Error,
        });
        return;
      }

      if (!args.taskData) {
        dispatchAlert({
          message: "Görev verileri eksik. Görev oluşturulamadı.",
          type: MessageBoxType.Error,
        });
        return;
      }
      if(args.taskData.ParentID){
        // ! KRİTİK : Eğer Alt Alan eklenmek istiyorsa ve herhangi bir hatadan dolayı parentId null ise, alert ver yoksa proje patlar.
        const parentTask = projectData.find((task: any) => task.TaskID === Number(args.taskData.ParentID));
        if (!parentTask) {
          dispatchAlert({
            message: "Üst görev bulunamadı. Görev oluşturulamadı.",
            type: MessageBoxType.Error,
          });
          return;
        }
      }
      if (args.taskData.TaskID) {
        // ! KRİTİK : Eğer oluşturulmak istenen göreve ait taskId varsa yani duplicate durumu söz konusu ise, alert ver yoksa proje patlar.
        const task = projectData.find((task: any) => task.TaskID === args.taskData.TaskID);
        if (task) {
          dispatchAlert({
            message: "Oluşturulmak istenen göreve ait Id zaten mevcut. Görev oluşturulamadı.",
            type: MessageBoxType.Error,
          });
          return;
        }
      }
      isProcessingTask = true;

      const config = getConfiguration();
      let body: ProjectTasksInsertDto = {
        duration: args.taskData.Duration,
        isManual: args.taskData.IsManual,
        name: args.taskData.TaskName, // Burada dönüştürmeye gerek yok çünkü TaskName zaten dönüştürülmüş olarak gelecek
        parentId: args.taskData.ParentID,
        startDate: args.taskData.StartDate,
        predecessor: args.taskData.Predecessor,
        progress: args.taskData.Progress,
        notes: args.taskData.Notes,
        projectId: projectId,
        milestone: args.taskData.Milestone,
        taskId: args.taskData.TaskID,
        users: args.taskData.resources, // Add resource IDs
      };

      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksPost(body);
      await fetchProjectData();
      dispatchAlert({
        message: "Görev başarıyla oluşturuldu.",
        type: MessageBoxType.Success,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      dispatchAlert({
        message: "Görev oluşturulurken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    } finally {
      isProcessingTask = false;
    }
  };

  const updateTask = async (args: any) => {
    try {
      if (!projectId) {
        dispatchAlert({
          message: "Proje ID'si bulunamadı. Görev güncellenemedi.",
          type: MessageBoxType.Error,
        });
        return;
      }

      if (!args.taskData || !args.taskData.Id) {
        dispatchAlert({
          message: "Görev verileri eksik. Görev güncellenemedi.",
          type: MessageBoxType.Error,
        });
        return;
      }

      const config = getConfiguration();
      let body: ProjectTasksUpdateDto = {
        id: args.taskData.Id,
        name: args.taskData.TaskName, // Burada dönüştürmeye gerek yok çünkü TaskName zaten dönüştürülmüş olarak gelecek
        startDate: args.taskData.StartDate,
        projectId: projectId,
        duration: args.taskData.Duration,
        progress: args.taskData.Progress,
        predecessor: args.taskData.Predecessor ?? "",
        parentId: args.taskData.ParentID,
        milestone: args.taskData.Milestone ?? false,
        notes: args.taskData.Notes,
        isManual: args.taskData.IsManual,
        taskId: args.taskData.TaskID,
        users: args.taskData.resources, // Add resource IDs
      };

      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksPut(body);
      await fetchProjectData();
      // dispatchAlert({
      //   message: "Görev başarıyla güncellendi.",
      //   type: MessageBoxType.Success,
      // });
    } catch (error) {
      console.error("Error updating task:", error);
      dispatchAlert({
        message: "Görev güncellenirken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    }
  };

  const deleteTask = async (args: any) => {
    try {
      if (!Array.isArray(args) || args.length === 0) {
        dispatchAlert({
          message: "Silinecek görev bulunamadı.",
          type: MessageBoxType.Error,
        });
        return;
      }

      const idArray = args.map((obj: any) => {
        if (!obj || !obj.taskData || !obj.taskData.Id) {
          throw new Error("Geçersiz görev verisi");
        }
        return obj.taskData.Id;
      });

      if (idArray.length === 0) {
        dispatchAlert({
          message: "Silinecek görev bulunamadı.",
          type: MessageBoxType.Error,
        });
        return;
      }

      console.log("idArray", idArray);
      const config = getConfiguration();
      let api = new ProjectTasksApi(config);
      let response = await api.apiProjectTasksDelete(idArray);
      await fetchProjectData();
      dispatchAlert({
        message: "Görev(ler) başarıyla silindi.",
        type: MessageBoxType.Success,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      dispatchAlert({
        message: "Görev silinirken bir hata oluştu.",
        type: MessageBoxType.Error,
      });
    }
  };

  // Add custom date format handler
  const handleDateFormat = (args: any) => {
    if (args.columnName === "StartDate" && args.value) {
      try {
        // Ensure proper date format handling
        const date = new Date(args.value);
        if (!isNaN(date.getTime())) {
          // Format as yyyy-MM-dd
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          args.value = `${year}-${month}-${day}`;
        }
      } catch (error) {
        console.error("Error formatting date:", error);
      }
    }
  };

  const actionBegin = async (args: any) => {
    // Handle date format for edit dialog
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      handleDateFormat(args);
    }

    // console.log("Action begin:", args);

    if (args.requestType === "beforeAdd") {
      await createTask(args.data);
      args.cancel = true;
    } else if (args.requestType === "beforeDelete") {
      console.log("Deleting task:", args.data);
      await deleteTask(args.data);
      args.cancel = true;
    } else if (args.requestType === "beforeSave") {
      console.log("saving task (after)", args.data);
      await updateTask(args.data);
      args.cancel = true;
    } else if (args.requestType === "beforeCancel") {
      console.log("Cancelling task edit:", args.data);
      if (window.confirm("Are you sure you want to cancel this task edit?")) {
        // Allow the cancel operation
      } else {
        args.cancel = true;
      }
    } else if (args.requestType === "taskbarEditing") {
      console.log("Taskbar editing:", args.data);
    } else if (args.requestType === "taskbarEdited") {
      console.log("Taskbar edited:", args.data);
    } else if (args.requestType === "progressBarEditing") {
      console.log("Progress bar editing:", args.data);
    } else if (args.requestType === "progressBarEdited") {
      console.log("Progress bar edited:", args.data);
    }
  };

  const actionComplete = (args: any) => {
    // Handle date format after edit completion
    if (args.requestType === "save" || args.requestType === "add") {
      if (args.data && args.data.StartDate) {
        handleDateFormat(args.data);
      }
    }

    if (args.requestType === "save") {
    } else if (args.requestType === "delete") {
    } else if (args.requestType === "add") {
    }
  };

  const contextMenuItems = [
    "AutoFitAll",
    "AutoFit",
    "TaskInformation",
    "DeleteTask",
    "Save",
    "Cancel",
    "SortAscending",
    "SortDescending",
    "Add",
    "DeleteDependency",
    "Convert",
    { text: "Collapse the Row", target: ".e-content", id: "collapserow" },
    { text: "Expand the Row", target: ".e-content", id: "expandrow" },
    { text: "Hide Column", target: ".e-gridheader", id: "hidecols" },
  ];
  const contextMenuClick = (args: any) => {
    let record = args.rowData;
    if (args.item.id === "collapserow") {
      ganttRef.current?.collapseByID(Number(record.ganttProperties.taskId));
    }
    if (args.item.id === "expandrow") {
      ganttRef.current?.expandByID(Number(record.ganttProperties.taskId));
    }
    if (args.item.id === "hidecols") {
      ganttRef.current?.hideColumn(args.column.headerText);
    }
  };
  const contextMenuOpen = (args: any) => {
    let record = args.rowData;
    if (args.type !== "Header") {
      if (!record.hasChildRecords) {
        args.hideItems.push("Collapse the Row");
        args.hideItems.push("Expand the Row");
      } else {
        if (record.expanded) {
          args.hideItems.push("Expand the Row");
        } else {
          args.hideItems.push("Collapse the Row");
        }
      }
    }
  };
  const handleTaskbarInfo = (args: any) => {
    const progress = args.data.Progress;

    if (progress >= 50) {
      args.taskbarBgColor = "#BCCCDC";
    }
  };
  const handleBackClick = () => {
    const workCompany: WorkCompanyDto = {
      id: workCompanyId,
      name: workCompanyName,
    };
    navigate("/projectManagement", {
      state: {
        showTest: true,
        workCompany,
        projectId,
        

      },
    });
  };

  const formatOption = { type: "date", format: "dd.MM.yyyy" };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <style>{customStyles}</style>
      <Card sx={{ px: 2, py: 1, mb: 2 }}>
        {/* <MDBox>
          <Autocomplete
            options={ticketProjectData}
            getOptionLabel={(option: TicketProjectsListDto) => option.name}
            renderInput={(params) => <MDInput {...params} label="Projeler" />}
            onChange={(event, value) => {
              setSelectedTicketProject(value);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedTicketProject}
          />
        </MDBox> */}
        <MDBox display="flex" alignItems="center" gap={1}>
          <MDButton
            onClick={handleBackClick}
            variant="contained"
            color="light"
            sx={{
              minWidth: "auto",
              p: 1.5,
              borderRadius: "12px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            ←
          </MDButton>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            {workCompanyName}
            <ChevronRightIcon sx={{ mx: 1 }} />
            {projectName}
            {projectSubName && (
              <>
                <ChevronRightIcon sx={{ mx: 1 }} />
                {projectSubName}
              </>
            )}
          </Typography>
        </MDBox>
      </Card>
      <div
        style={{ height: "calc(100vh - 180px)", width: "100%", overflow: "hidden" }}
        className="gantt-chart-container"
      >
        <GanttComponent
          key={projectData?.length}
          ref={ganttRef}
          // created={onGanttCreated}

          locale="en-US"
          height="100%"
          width="100%"
          actionBegin={actionBegin}
          actionComplete={actionComplete}
          allowFiltering={true}
          allowSorting={true}
          allowParentDependency
          allowReordering
          allowResizing
          allowPdfExport={true}
          resources={resources}
          resourceFields={resourceFields}
          // allowExcelExport={true}
          highlightWeekends={true}
          editSettings={editSettings}
          toolbar={toolbarOptions}
          toolbarClick={toolbarClick}
          dataSource={projectData}
          taskFields={taskFields}
          taskType="FixedDuration"
          enableContextMenu={true}
          queryTaskbarInfo={handleTaskbarInfo}
          tooltipSettings={{
            showTooltip: true,
            taskbar: "true",
          }}
          timelineSettings={{
            showTooltip: true,
            timelineUnitSize: 50,
            topTier: {
              unit: "Week",
              format: "MMM dd, yyyy",
            },
            bottomTier: {
              unit: "Day",
              format: "dd",
            },
          }}
          dateFormat="dd.MM.yyyy" // Add explicit date format
          splitterSettings={{ position: "31.5%" }}
          workWeek={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
          selectionSettings={{ mode: "Row", type: "Multiple" }}
          durationUnit="Day"
          dayWorkingTime={[{ from: 9, to: 18 }]}
          contextMenuItems={contextMenuItems as ContextMenuItem[]}
          contextMenuClick={contextMenuClick}
          contextMenuOpen={contextMenuOpen}
          labelSettings={labelSettings}
          editDialogFields={editDialogFields}
          addDialogFields={addDialogFields}
        >
          <AddDialogFieldsDirective>
            <AddDialogFieldDirective type="General" headerText="General"></AddDialogFieldDirective>
            <AddDialogFieldDirective
              type="Dependency"
              headerText="Dependency"
            ></AddDialogFieldDirective>
            <AddDialogFieldDirective
              type="Resources"
              headerText="Resources"
              additionalParams={{
                columns: [
                  { field: "checkbox", headerText: "", width: 30, textAlign: "Center" },
                  { field: "fullName", headerText: "Kullanıcı", width: 450 },
                  { field: "id", headerText: "ID", width: 1, maxWidth: 1 },
                  { field: "unit", headerText: "Birim", width: 1, maxWidth: 1 },
                ],
                allowFiltering: false,
              }}
            ></AddDialogFieldDirective>
          </AddDialogFieldsDirective>
          <EditDialogFieldsDirective>
            <EditDialogFieldDirective
              type="General"
              headerText="General"
            ></EditDialogFieldDirective>
            <EditDialogFieldDirective
              type="Dependency"
              headerText="Dependency"
            ></EditDialogFieldDirective>
            <EditDialogFieldDirective
              type="Resources"
              headerText="Resources"
              additionalParams={{
                columns: [
                  { field: "checkbox", headerText: "", width: 30, textAlign: "Center" },
                  { field: "fullName", headerText: "Kullanıcı", width: 450 },
                  { field: "id", headerText: "ID", width: 1, maxWidth: 1 },
                  { field: "unit", headerText: "Birim", width: 1, maxWidth: 1 },
                ],
                allowFiltering: false,
              }}
            ></EditDialogFieldDirective>
            <EditDialogFieldDirective type="Notes" headerText="Notes"></EditDialogFieldDirective>
          </EditDialogFieldsDirective>
          <Inject
            services={[
              Toolbar,
              Edit,
              Selection,
              ContextMenu,
              Sort,
              Filter,
              Resize,
              Reorder,
              PdfExport,
              DayMarkers,
              ColumnMenu,
              RowDD,
            ]}
          />
          <ColumnsDirective>
            {/* <ColumnDirective field="Id" headerText="ID" width="80" /> */}
            <ColumnDirective field="TaskID" headerText="ID" />
            <ColumnDirective
              field="TaskName"
              headerText="Task Name"
              template={(props: any) => {
                return <div>{props.TaskName}</div>;
              }}
            />
            <ColumnDirective
              field="resources"
              headerText="Assignees"
              template={(props: any) => {
                if (props.resources.length === 0 || !props.resources) {
                  return <>-</>;
                }
                const assigneesWithSplitted = props.resources.split(",");

                if (assigneesWithSplitted.length === 1) {
                  return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {assigneesWithSplitted[0]}
                    </div>
                  );
                } else if (assigneesWithSplitted.length > 1) {
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      {assigneesWithSplitted[0]}
                      <br />
                      <Tooltip
                        title={assigneesWithSplitted
                          .slice(1)
                          .map((user: any) => user)
                          .join(", ")}
                      >
                        <div
                          style={{
                            border: "1px solid black",
                            padding: "2px",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            backgroundColor: "black",
                          }}
                        >
                          {" "}
                          +{assigneesWithSplitted.length - 1}
                        </div>
                      </Tooltip>
                    </div>
                  );
                }
              }}
            />
            <ColumnDirective
              field="StartDate"
              headerText="Start Date"
              width="150"
              format={formatOption}
              type="date"
              edit={{ params: { format: "dd.MM.yyyy" } }}
            />

            <ColumnDirective field="Duration" headerText="Duration (days)" />
            <ColumnDirective field="EndDate" headerText="End Date" allowEditing={false} />
            <ColumnDirective field="Progress" headerText="Progress (%)" />

            {/* <ColumnDirective field="Customer" headerText="Customer" width="200" />{" "} */}
          </ColumnsDirective>
        </GanttComponent>
      </div>
      <Footer />

      {/* PDF Export Dialog */}
      <Dialog
        open={pdfDialogOpen}
        onClose={handlePdfDialogClose}
        maxWidth="lg"
        // sx={{
        //   "& .MuiDialog-paper": {
        //     minWidth: "500px",
        //   },
        // }}
      >
        <DialogTitle>
          <MDTypography variant="h5">PDF Dışa Aktarma Ayarları</MDTypography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="Dosya Adı"
                  value={pdfSettings.fileName}
                  onChange={handlePdfSettingsChange("fileName")}
                />
              </MDBox>

              <MDBox mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="page-size-label">Sayfa Boyutu</InputLabel>
                  <Select
                    labelId="page-size-label"
                    value={pdfSettings.pageSize}
                    label="Sayfa Boyutu"
                    onChange={handlePdfSettingsChange("pageSize")}
                    sx={{
                      height: "45px",
                    }}
                  >
                    <MenuItem value="A0">A0</MenuItem>

                    <MenuItem value="A4">A4</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={12} m={2}>
              <MDBox mb={2} display="flex" alignItems="center">
                <MDTypography variant="button" fontWeight="regular" mr={3}>
                  Alt Bilgiyi Göster
                </MDTypography>
                <Switch
                  checked={pdfSettings.enableFooter}
                  onChange={handlePdfSettingsChange("enableFooter")}
                />
              </MDBox>
              <MDBox mb={2} display="flex" alignItems="center">
                <MDTypography variant="button" fontWeight="regular" mr={3}>
                  Bağımlılık Çizgilerini Göster
                </MDTypography>
                <Switch
                  checked={pdfSettings.predecessorLines}
                  onChange={handlePdfSettingsChange("predecessorLines")}
                />
              </MDBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton color="secondary" onClick={handlePdfDialogClose}>
            İptal
          </MDButton>
          <MDButton color="info" onClick={handleExportPDF}>
            PDF Dışa Aktar
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ProjectChart;
