import React, { useState, useRef, createRef, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  SelectionMode,
} from "reactflow";

import "reactflow/dist/style.css";
import { ProgressSpinner } from "primereact/progressspinner";
import Sidebar from "./components/Sidebar.jsx";
import SmartMenuNode from "./components/SmartMenuNode.jsx";
import SetFieldNode from "./components/SetFieldNode.jsx";
import TeamNode from "./components/TeamNode.jsx";
import ApproverNode from "./components/ApproverNode.jsx";
import ServiceNoteNode from "./components/ServiceNoteNode.jsx";
import StartNode from "./components/StartNode.jsx";
import StopNode from "./components/StopNode.jsx";
import AudioMessageNode from "./components/AudioMessageNode.jsx";
import InputDataNode from "./components/InputDataNode.jsx";
import { Splitter, SplitterPanel } from "primereact/splitter";
import StartTab from "./propertiespanel/StartTab.jsx";
import StopTab from "./propertiespanel/StopTab.jsx";
import AprroveTab from "./propertiespanel/AprroveTab.jsx";
import { useLocation } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import { useBusy } from "../hooks/useBusy";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import WorkflowWizard from "./components/WorkflowWizard.jsx";
import WorkflowFormSelector from "./components/WorkflowFormSelector.jsx";
import FormStopNode from "./components/FormStopNode.jsx";
import FormStopTab from "./propertiespanel/FormStopTab.jsx";

import {
  AnalyticalTable,
  Avatar,
  Badge,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  ButtonType,
  CheckBox,
  DatePicker,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  Form,
  FormBackgroundDesign,
  FormGroup,
  FormItem,
  Icon,
  Input,
  Label,
  Link,
  List,
  MessageBox,
  MessageStrip,
  ObjectPage,
  ObjectPageSection,
  ObjectPageSubSection,
  ObjectStatus,
  Select,
  ShellBar,
  ShellBarItem,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  StandardListItem,
  Table,
  TableCell,
  TableColumn,
  TableRow,
  TextAlign,
  TextArea,
  ThemeProvider,
  Title,
  ToolbarSpacer,
  VerticalAlign,
} from "@ui5/webcomponents-react";
import {
  Configuration,
  WorkFlowDefinationListDto,
  WorkFlowDefinationApi,
  FormDataApi,
} from "api/generated";
import { TextField } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MuiIcon from "@mui/material/Icon";
import { MessageBoxType, MessageBoxAction } from "@ui5/webcomponents-react";
import { getConfig } from "@testing-library/react";
import getConfiguration from "confiuration";
import MDInput from "components/MDInput";
import CustomInputComponent from "./CustomInput";
import SqlConditionNode from "./components/SqlConditionNode.jsx";
import SqlConditionTab from "./propertiespanel/SqlConditionTab.jsx";
import QueryConditionNode from "./components/QueryConditionNode.jsx";
import QueryConditionTab from "./propertiespanel/QueryConditionTab";
import SetFieldTab from "./propertiespanel/SetFieldTab";
import MailNode from "./components/MailNode.jsx";
import MailTab from "./propertiespanel/MailTab.jsx";
import HttpPostNode from "./components/HttpPostNode.jsx";
import HttpPostTab from "./propertiespanel/HttpPostTab.jsx";
const nodeTypes = {
  smartMenuNode: SmartMenuNode,
  teamNode: TeamNode,
  approverNode: ApproverNode,
  serviceNoteNode: ServiceNoteNode,
  audioMessageNode: AudioMessageNode,
  inputDataNode: InputDataNode,
  startNode: StartNode,
  stopNode: StopNode,
  sqlConditionNode: SqlConditionNode,
  queryConditionNode: QueryConditionNode,
  mailNode: MailNode,
  httpPostNode: HttpPostNode,
  formStopNode: FormStopNode, // Form dur node'u
  setFieldNode: SetFieldNode,
};

const initialNodes = [
  {
    id: "1",
    type: "startNode",
    position: { x: 0, y: 0 },
    className: "noHaveEdges",
    data: { name: "Varsayılan İsim", text: "Varsayılan Metin" },
  },
];

const initialEdges = [];

let id = 1;
const getId = generateUUID(); //
const flowKey = "example-flow";

const txtname = createRef();

function generateUUID() {
  let d = new Date().getTime(); // Zaman tabanlı bir değer kullan
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

var globalArray = [];

function Flow(props) {
  const { onRegisterActions, isPropertiesOpen } = props;
  const navigate = useNavigate();
  const dispatchBusy = useBusy();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { parsedFormDesign, selectedForm, setSelectedForm, setParsedFormDesign } = props;

  const [isHovered, setIsHovered] = useState(false);
  const reactFlowWrapper = useRef(null);
  // const initialZoom = 0.7; // Başlangıç yakınlaştırma seviyesi
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // const [zoom, setZoom] = useState(initialZoom);
  const [firstNode, setFirstNode] = useState(1);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  var [workflowName, setworkflowName] = useState("");
  const [selecteNodeType, setselecteNodeType] = useState({});
  const [selecteNodeData, setselecteNodeData] = useState(1);
  const [selectedNode, setselectedNode] = useState(1);
  const [isLoadingProperties, setisLoadingProperties] = useState(false);

  const [isEdit, setisEdit] = useState(false);
  const [msgOpen, setmsgOpen] = useState(false);

  const [workflowData, setWorkflowData] = useState({
    metadata: {
      workflowId: null,
      startTime: null,
      currentStep: null,
      formId: null,
      formName: null,
    },
    nodeResults: {}, // Her node'un sonuçları
    formData: null, // Form verileri
    executionLog: [], // Adım adım log
  });
  const dispatchAlert = useAlert();
  const [count, setCount] = useState(0);
  const { setViewport } = useReactFlow();
  const { id } = useParams();
  useEffect(() => {
    dispatchBusy({ isBusy: true });

    if (id) {
      setisEdit(true);
      var conf = getConfiguration();
      let api = new WorkFlowDefinationApi(conf);
      var data = api
        .apiWorkFlowDefinationIdGet(id)
        .then((response) => {
          let flow = JSON.parse(response.data.defination);
          if (flow) {
            setworkflowName(response.data.workflowName);
            txtname.current?.setValue(response.data.workflowName);
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });

            // ✅ Önce queryConditionNode'dan dene (mevcut mantık)
            const queryNodes = flow.nodes?.filter((n) => n.type === "queryConditionNode") || [];
            if (queryNodes.length > 0) {
              const firstQueryNode = queryNodes[0];
              if (firstQueryNode.data?.selectedFormId && firstQueryNode.data?.parsedFormDesign) {
                setSelectedForm({
                  id: firstQueryNode.data.selectedFormId,
                  formName: firstQueryNode.data.selectedFormName,
                  formDesign: JSON.stringify(firstQueryNode.data.parsedFormDesign?.raw || {}),
                  formType: firstQueryNode.data.workflowFormInfo?.formType || "workflow",
                });
                setParsedFormDesign(firstQueryNode.data.parsedFormDesign);
                console.log(
                  "✅ Form restored from queryConditionNode:",
                  firstQueryNode.data.selectedFormName
                );

                // Form bulundu, çık
                return;
              }
            }

            // ✅ QueryConditionNode'da yoksa, diğer node'lardan dene
            const allNodes = flow.nodes || [];
            const nodeWithForm = allNodes.find(
              (n) => n.data?.selectedFormId && n.type !== "queryConditionNode"
            );

            if (nodeWithForm) {
              console.log("✅ Form restored from other node:", nodeWithForm.data.selectedFormName);

              setSelectedForm({
                id: nodeWithForm.data.selectedFormId,
                formName: nodeWithForm.data.selectedFormName,
                formDesign: JSON.stringify(nodeWithForm.data.parsedFormDesign?.raw || {}),
                formType: nodeWithForm.data.workflowFormInfo?.formType || "workflow",
              });
              setParsedFormDesign(nodeWithForm.data.parsedFormDesign);
            } else {
              console.log("⚠️ Hiçbir node'da form bilgisi bulunamadı");
              setSelectedForm(null);
              setParsedFormDesign(null);
            }
          }
        })
        .catch((error) => {
          console.error("Workflow yükleme hatası:", error);
        });
    }
    dispatchBusy({ isBusy: false });
  }, [id, setSelectedForm, setParsedFormDesign, dispatchBusy]);
  const handleWorkFlowName = (event) => {
    alert(txtname.current?.current);
    setworkflowName(event.target.value);
  };

  const handleUserInput = (e) => {
    setworkflowName(e.target.value);
    workflowName = e.target.value;
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = generateUUID();

      // ✅ Temel form bilgisi (tüm node'lara eklenecek)
      const baseFormInfo = selectedForm
        ? {
            selectedFormId: selectedForm.id,
            selectedFormName: selectedForm.formName,
            parsedFormDesign: parsedFormDesign,
            workflowFormInfo: {
              formId: selectedForm.id,
              formName: selectedForm.formName,
              formType: selectedForm.formType,
              timestamp: new Date().toISOString(),
            },
          }
        : {};

      // ✅ Node tipine göre özel data + form bilgisi
      let nodeData = {};

      switch (type) {
        case "queryConditionNode":
          nodeData = {
            label: "Yeni Sorgu Kriteri",
            criteria: [{ field: "Şirket", operator: "Equal to", value: "Vesa Danışmanlık" }],
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;
        case "setFieldNode":
          nodeData = {
            actions: [],
            summary: "",
            ...baseFormInfo,
          };
          break;

        case "mailNode":
          nodeData = {
            to: "",
            subject: "",
            body: "",
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;

        case "httpPostNode":
          nodeData = {
            url: "",
            method: "POST",
            headers: "{}",
            body: "{}",
            timeout: 30000,
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;

        case "startNode":
          nodeData = {
            name: "Varsayılan İsim",
            text: "Varsayılan Metin",
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;

        case "stopNode":
          nodeData = {
            name: "Varsayılan İsim",
            text: "Varsayılan Metin",
            stoptype: {
              code: "FINISH", // ya da "DRAFT"
              name: "Akışı Bitir", // gösterim için
            },
            ...baseFormInfo,
          };
          break;

        case "approverNode":
          nodeData = {
            name: "Varsayılan İsim",
            text: "Varsayılan Metin",
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;

        case "sqlConditionNode":
          nodeData = {
            name: "Varsayılan İsim",
            text: "Varsayılan Metin",
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;
        // onDrop metodunda switch statement'a ekle:
        case "formStopNode":
          nodeData = {
            name: "Form Dur",
            text: "Form Workflow Bitir",
            stoptype: {
              code: "FINISH",
              name: "Form Workflow Tamamla",
            },
            ...baseFormInfo,
          };
          break;

        default:
          nodeData = {
            name: "Varsayılan İsim",
            text: "Varsayılan Metin",
            ...baseFormInfo, // ✅ Form bilgisi eklendi
          };
          break;
      }

      const newNode = {
        id,
        type,
        position,
        className: "noHaveEdges",
        data: nodeData,
      };

      console.log("🔧 Yeni node oluşturuldu:", {
        type: type,
        hasFormInfo: !!nodeData.selectedFormId,
        formName: nodeData.selectedFormName,
      });

      if (id == 1) {
        props.parentCallback(false);
        setFirstNode(newNode);
      }

      // StartNode/StopNode kontrolleri
      if (type === "startNode" && globalArray.some((node) => node.type === "startNode")) {
        // Helper.showError("Başlangıç node'u yalnız bir kez eklenebilir.");
        // return;
      }

      if (type === "stopNode" && globalArray.some((node) => node.type === "stopNode")) {
        // Helper.showError("Bitiş node'u yalnız bir kez eklenebilir.");
        // return;
      }

      globalArray.push(newNode);
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, selectedForm, parsedFormDesign] // ✅ Dependencies eklendi
  );
  const updateWorkflowData = useCallback((nodeId, nodeType, data, status = "completed") => {
    setWorkflowData((prev) => {
      const newData = {
        ...prev,
        metadata: {
          ...prev.metadata,
          currentStep: nodeType,
          lastUpdate: new Date().toISOString(),
        },
        nodeResults: {
          ...prev.nodeResults,
          [nodeId]: {
            type: nodeType,
            data: data,
            status: status,
            timestamp: new Date().toISOString(),
          },
        },
        executionLog: [
          ...prev.executionLog,
          {
            nodeId,
            nodeType,
            action: status,
            timestamp: new Date().toISOString(),
            data: data,
          },
        ],
      };

      console.log("Workflow Data Updated:", newData);
      return newData;
    });
  }, []);
  const prepareWorkflowDataForHttp = useCallback(() => {
    const preparedData = {
      // Workflow metadata
      workflow: {
        id: workflowData.metadata.workflowId || generateUUID(),
        name: workflowName,
        startTime: workflowData.metadata.startTime || new Date().toISOString(),
        currentTime: new Date().toISOString(),
        status: "in_progress",
        currentStep: workflowData.metadata.currentStep,
      },

      // Form bilgileri
      form: {
        id: workflowData.metadata.formId,
        name: workflowData.metadata.formName,
        design: parsedFormDesign,
        submittedData: workflowData.formData,
      },

      // Node sonuçları
      steps: Object.entries(workflowData.nodeResults).map(([nodeId, result]) => ({
        nodeId: nodeId,
        nodeType: result.type,
        result: result.data,
        status: result.status,
        timestamp: result.timestamp,
      })),

      // Execution log
      executionLog: workflowData.executionLog,

      // Özet veriler
      summary: {
        totalSteps: Object.keys(workflowData.nodeResults).length,
        completedSteps: Object.values(workflowData.nodeResults).filter(
          (r) => r.status === "completed"
        ).length,
        lastActivity: workflowData.executionLog[workflowData.executionLog.length - 1]?.timestamp,
      },

      // Özel alanlar (HttpPost'un kullanabileceği)
      variables: {
        // Query condition sonuçları
        queryResults: Object.values(workflowData.nodeResults)
          .filter((r) => r.type === "queryConditionNode")
          .map((r) => r.data),

        // Approval sonuçları
        approvals: Object.values(workflowData.nodeResults)
          .filter((r) => r.type === "approverNode")
          .map((r) => r.data),

        // Mail gönderim sonuçları
        mailResults: Object.values(workflowData.nodeResults)
          .filter((r) => r.type === "mailNode")
          .map((r) => r.data),
      },
    };

    return preparedData;
  }, [workflowData, workflowName, parsedFormDesign]);

  // Workflow başlatma (mevcut useEffect'lerden sonra ekleyin)
  useEffect(() => {
    if (nodes.length > 0 && selectedForm) {
      const startNode = nodes.find((n) => n.type === "startNode");
      if (startNode && !workflowData.metadata.workflowId) {
        setWorkflowData((prev) => ({
          ...prev,
          metadata: {
            workflowId: generateUUID(),
            startTime: new Date().toISOString(),
            currentStep: "start",
            formId: selectedForm?.id || null,
            formName: selectedForm?.formName || null,
          },
          formData: parsedFormDesign || null,
        }));
      }
    }
  }, [nodes, selectedForm, parsedFormDesign]);

  const handlePropertiesChange = (newValue) => {
    // alert(newValue);
    let obje = nodes.find((o) => o.id === newValue.id);
    if (obje) {
      obje.data = newValue.data;

      // ✅ YENİ: Workflow verilerini güncelle
      updateWorkflowData(obje.id, obje.type, newValue.data, "updated");

      updateNodeText("1", "Updated Node 1");
      // onRestore();
    }
  };

  const onDelete = (newValue) => {
    let index = nodes.findIndex((o) => o.id === selectedNode.id);

    // Eğer obje bulunursa, silme işlemi yapma
    if (index !== -1) {
      nodes.splice(index, 1);
    }
  };

  const onSave = useCallback(() => {
    const haveNodeWithoutEdge = reactFlowInstance
      .getNodes()
      .filter((node) => node.className.includes("noHaveEdges"));

    if (txtname.current?.current.toString().trim() === "") {
      dispatchAlert({ message: "Akış Adı Boş Bırakılamaz", type: MessageBoxType.Error });
      return;
    }

    if (!reactFlowInstance || haveNodeWithoutEdge.length) return;

    const flow = { ...reactFlowInstance.toObject(), firstNode };
    const workflowName = txtname.current?.current;
    const conf = getConfiguration();
    const api = new WorkFlowDefinationApi(conf);

    if (isEdit) {
      const dto = {
        id,
        workflowName,
        defination: JSON.stringify(flow),
        isActive: false,
        revision: 0,
        formId: selectedForm?.id || null, // ✅ FormId eklendi
      };

      api
        .apiWorkFlowDefinationPut(dto)
        .then(() => {
          dispatchAlert({ message: "Kayıt Güncelleme Başarılı", type: MessageBoxType.Success });
        })
        .catch((error) => {
          dispatchAlert({
            message: error.response?.data || "Bilinmeyen bir hata oluştu",
            type: MessageBoxType.Error,
          });
        });
    } else {
      const dto = {
        workflowName,
        defination: JSON.stringify(flow),
        isActive: false,
        revision: 0,
        formId: selectedForm?.id || null, // ✅ FormId eklendi
      };

      api
        .apiWorkFlowDefinationPost(dto)
        .then(async (response) => {
          dispatchAlert({ message: "Kayıt Ekleme Başarılı", type: MessageBoxType.Success });

          // ❌ Form tablosunu güncelleme kısmı KALDIRILDI

          navigate("/WorkFlowList");
        })
        .catch((error) => {
          dispatchAlert({
            message: error.response?.data || "Bilinmeyen bir hata oluştu",
            type: MessageBoxType.Error,
          });
        });
    }
  }, [reactFlowInstance, isEdit, id, selectedForm]);

  useEffect(() => {
    if (typeof onRegisterActions === "function") {
      onRegisterActions({
        onSave,
        onCancel: () => setmsgOpen(true),
      });
    }
  }, [onRegisterActions, onSave]);

  const onRestore = useCallback(() => {
    globalArray.pop();
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      console.log(JSON.parse(localStorage.getItem(flowKey)));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;

        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);

        var nodesCopy = JSON.parse(JSON.stringify(flow.nodes));

        nodesCopy.forEach(function (node) {
          globalArray.push(node);
        });
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const updateNodeText = (id, newText) => {
    setNodes((els) =>
      els.map((el) => {
        if (el.id === id) {
          el.data = { ...el.data };
        }
        return el;
      })
    );
  };
  const onRefresh = useCallback(
    (nodes) => {
      const restoreFlow = async () => {
        console.log(JSON.stringify(nodes));

        let flow = JSON.parse(JSON.stringify(nodes));

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });

          var nodesCopy = JSON.parse(JSON.stringify(flow.nodes));

          nodesCopy.forEach(function (node) {
            globalArray.push(node);
          });
          setViewport({ x, y, zoom });
        }
      };

      restoreFlow();
    },
    [setNodes, setViewport]
  );

  const onEdgeClick = (event, edge) => {
    console.log("Tıklanan bağlantı:", edge);
    // alert(`Bağlantı Bilgileri: ID=${edge.id}`);
  };
  const onNodeClick = (event, node) => {
    setisLoadingProperties(true);
    setselecteNodeType(node.type);
    setselecteNodeData(node.data);
    setselectedNode(node);

    // ✅ YENİ: Workflow metadata güncelle
    updateWorkflowData(node.id, node.type, node.data, "selected");

    setisLoadingProperties(false);
  };
  const onConnect = useCallback(
    (params) => {
      const getNodes = reactFlowInstance.getNodes();
      // Kaynak ve hedef node'ları bul
      const sourceNode = getNodes.find((node) => node.id === params.source);
      const targetNode = getNodes.find((node) => node.id === params.target);

      // Eğer kaynak 'startNode' ve hedef 'stopNode' ise bağlantıyı engelle
      if (sourceNode.type === "startNode" && targetNode.type === "stopNode") {
        //  Helper.showError("Başlangıç node\'u doğrudan bitiş node\'una bağlanamaz!");aler
        return; // Bağlantıyı engelle ve fonksiyondan çık
      }
      let flowNodes = getNodes.map((node) => {
        if (node.id === params.source || node.id === params.target) {
          node.className = "";
        }
        return node;
      });

      setNodes(flowNodes || []);

      params.animated = true;
      params.style = { stroke: "#000" };
      setEdges((eds) => addEdge(params, eds));
    },
    [setNodes, reactFlowInstance]
  );

  async function handleMsgDialog(event) {
    setmsgOpen(false);
    if (event === MessageBoxAction.Yes) {
      navigate("/WorkFlowList");
    } else {
      return;
    }
  }
  return (
    <Splitter style={{ height: "100%", width: "100%" }} layout="horizontal">
      <SplitterPanel size={isPropertiesOpen ? 70 : 100} minSize={20} style={{ overflow: "hidden" }}>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: "100%" }}>
          {nodes.length > 0 && (
            <ReactFlow
              onMouseEnter={() => setIsHovered(true)}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              selectionMode={SelectionMode.Full}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              snapToGrid
              snapGrid={[16, 16]}
            >
              <MiniMap />
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          )}
          <MessageBox
            open={msgOpen}
            onClose={handleMsgDialog}
            titleText="DİKKAT"
            actions={[MessageBoxAction.Yes, MessageBoxAction.No]}
          >
            Verileriniz kaydedilmeyecektir, devam edilsin mi?
          </MessageBox>
        </div>
      </SplitterPanel>

      {isPropertiesOpen && (
      <SplitterPanel size={30} minSize={10} style={{ overflow: "auto" }}>
        {isLoadingProperties ? (
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        ) : (
          renderComponent(
            selecteNodeType,
            selecteNodeData,
            selectedNode,
            handlePropertiesChange,
            parsedFormDesign,
            selectedForm,
            prepareWorkflowDataForHttp()
          )
        )}
      </SplitterPanel>
      )}
    </Splitter>
  );
}

const renderComponent = (
  type,
  data,
  node,
  handlePropertiesChange,
  parsedFormDesign,
  selectedForm,
  fullWorkflowData // ← 7. parametre eklendi
) => {
  if (type === "queryConditionNode") {
    console.log("parsedFormDesign gönderildi:", parsedFormDesign);
  }

  switch (type) {
    case "startNode":
      return data ? (
        <StartTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
          selectedForm={selectedForm}
        />
      ) : null;

    case "stopNode":
      return data ? (
        <StopTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
          selectedForm={selectedForm}
        />
      ) : null;

    case "approverNode":
      return data ? (
        <AprroveTab
          key={node.id}
          initialValues={data}
          node={node}
          selectedForm={selectedForm}
          parsedFormDesign={parsedFormDesign}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;
    case "formStopNode":
      return data ? (
        <FormStopTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
          selectedForm={selectedForm}
        />
      ) : null;
    case "sqlConditionNode":
      return data ? (
        <SqlConditionTab
          key={node.id}
          initialValues={data}
          node={node}
          selectedForm={selectedForm}
          parsedFormDesign={parsedFormDesign}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;

    case "queryConditionNode":
      console.log("🧩 parsedFormDesign fields:", parsedFormDesign?.fields);
      const nodeFormDesign = node?.data?.parsedFormDesign || parsedFormDesign;

      return data ? (
        <QueryConditionTab
          key={node.id}
          initialValues={data}
          node={node}
          parsedFormDesign={nodeFormDesign} // ← Form tasarımını buradan al
          workflowData={fullWorkflowData} // ← Workflow verileri eklendi
          selectedForm={selectedForm}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;

    case "setFieldNode":
      return data ? (
        <SetFieldTab
          key={node.id}
          initialValues={data}
          node={node}
          parsedFormDesign={parsedFormDesign}
          selectedForm={selectedForm}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;

    case "mailNode":
      return data ? (
        <MailTab
          key={node.id}
          initialValues={data}
          node={node}
          selectedForm={selectedForm}
          parsedFormDesign={parsedFormDesign}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;

    case "httpPostNode":
      console.log("HttpPostNode case - data:", data, "node:", node);
      console.log("HttpPostNode Workflow Data:", fullWorkflowData);
      return data ? (
        <HttpPostTab
          key={node.id}
          initialValues={data}
          node={node}
          workflowData={fullWorkflowData} // ← Workflow verileri eklendi
          onButtonClick={handlePropertiesChange}
          parsedFormDesign={parsedFormDesign} // ← Form tasarımını buradan al
          selectedForm={selectedForm} // ← Seçilen form bilgisi eklendi
        />
      ) : (
        <div>No data for HttpPostNode</div>
      );

    default:
      return null;
  }
};

function WorkFlowDetail(props) {
  const { id } = useParams();
  const [disabled, setDisabled] = useState(!id);
  const [showWizard, setShowWizard] = useState(!id);
  const [workflowType, setWorkflowType] = useState(null);
  const [formListOpen, setFormListOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [saveFlow, setSaveFlow] = useState(null);
  const [cancelFlow, setCancelFlow] = useState(null);

  // 👇 Bu state seçilen formun tüm verisini tutar
  const [selectedForm, setSelectedForm] = useState(null);
  const [parsedFormDesign, setParsedFormDesign] = useState(null);
  const navigate = useNavigate();

  const handleWizardConfirm = (selectedType) => {
    setWorkflowType(selectedType);
    setShowWizard(false);
    setFormListOpen(true); // Wizard sonrası form listesini aç
  };

  const handleFormConfirm = (form) => {
    setSelectedForm(form);
    setFormListOpen(false);

    try {
      console.log("🔍 Form Type:", form.formType);
      console.log("🔍 Form Name:", form.formName);

      const parsedForm = JSON.parse(form.formDesign);
      console.log("🔍 Form Components:", parsedForm.components);

      // ✅ Düzeltilmiş extraction fonksiyonunu kullan
      const fields = extractFieldsFromComponents(parsedForm.components || []);

      console.log("=== ÇIKARILAN ALANLAR ===");
      fields.forEach((field) => {
        console.log(`📝 ${field.label}:`);
        console.log(`   Name: ${field.name}`);
        console.log(`   Type: ${field.type}`);
        console.log(`   ValueEditorType: ${field.valueEditorType}`);
        console.log(`   Operators: ${JSON.stringify(field.operators)}`);
        console.log(`   Values: ${field.values ? JSON.stringify(field.values) : "undefined"}`);
        console.log("");
      });

      setParsedFormDesign({
        fields: fields,
        raw: parsedForm,
      });
      console.log("✅ parsedFormDesign güncellendi!");
      navigate(`/workflow/start-list/${workflowId}`, {
        state: {
          selectedForm: {
            formId: form.id,
            formName: form.formName,
            formDesign: form.formDesign,
          },
        },
      });
    } catch (err) {
      console.error("❌ Form design JSON parse edilemedi:", err);
    }
  };
  function extractFieldsFromComponents(components) {
    const fields = [];

    const typeMap = {
      // ✅ Mevcut DS tipleri
      dsradio: "radio",
      dsdatetime: "datetime",
      dstime: "time",
      dssignature: "signature",
      dscheckbox: "checkbox",
      dstextarea: "textarea",
      dsapproval: "approval",
      dsselect: "select",
      dsselectboxes: "selectboxes",
      dsnumber: "number",
      dscurrency: "currency",
      dsemail: "email",
      dsphone: "phoneNumber",
      dspassword: "password",
      dsurl: "url",
      dsday: "day",
      dsdate: "date",
      dsbutton: "button",
      dstext: "textfield",
      dstextfield: "textfield",

      // ✅ Ek DS tipleri
      dssurvey: "survey",
      dstable: "table",
      dsusername: "textfield",
      dshtml: "html",
      dsrange: "range",
      dscolor: "color",
      dssearch: "search",
      dstel: "phoneNumber",
      dsmonth: "month",
      dsweek: "week",
      dsfile: "file",
      dshidden: "hidden",

      // ✅ Standard HTML Input Types
      textfield: "textfield",
      text: "textfield",
      textarea: "textarea",
      number: "number",
      email: "email",
      password: "password",
      checkbox: "checkbox",
      radio: "radio",
      select: "select",
      button: "button",
      submit: "button",
      reset: "button",
      date: "date",
      datetime: "datetime",
      "datetime-local": "datetime",
      time: "time",
      url: "url",
      tel: "phoneNumber",
      search: "textfield",
      range: "range",
      color: "color",
      file: "file",
      hidden: "hidden",
      month: "month",
      week: "week",

      // ✅ Form.io spesifik tipler
      phoneNumber: "phoneNumber",
      currency: "currency",
      selectboxes: "selectboxes",
      survey: "survey",
      signature: "signature",
      table: "table",
      day: "day",
      tags: "textfield",
      address: "textfield",
      html: "html",
    };

    const traverse = (items) => {
      for (const item of items) {
        const isInput = item.input !== false && item.key;

        if (isInput) {
          // ✅ Genişletilmiş excluded types
          const excludedTypes = [
            "button",
            "submit",
            "reset",
            "dsbutton",
            "hidden",
            "dshidden",
            "file",
            "dsfile",
          ];
          const excludedKeys = ["submit", "kaydet", "save", "button", "reset", "cancel", "iptal"];

          if (excludedTypes.includes(item.type) || excludedKeys.includes(item.key?.toLowerCase())) {
            continue;
          }

          const labelLower = (item.label || "").toLowerCase();
          if (
            labelLower.includes("kaydet") ||
            labelLower.includes("submit") ||
            labelLower.includes("gönder") ||
            labelLower.includes("cancel") ||
            labelLower.includes("iptal")
          ) {
            continue;
          }

          const values = item.values || item.data?.values || [];
          const rawType = item.type;
          const mappedType = typeMap[rawType] || rawType;

          let type = "string";
          let valueEditorType = "text";
          let operators = ["=", "!=", "contains"];

          console.log(`🔍 DEBUG Field: ${item.label}`);
          console.log(`   - rawType: ${rawType}`);
          console.log(`   - mappedType: ${mappedType}`);
          console.log(`   - typeMap[${rawType}]: ${typeMap[rawType]}`);

          switch (mappedType) {
            case "number":
            case "currency":
            case "range":
              type = "number";
              valueEditorType = "text";
              operators = ["=", "!=", "<", "<=", ">", ">="];
              break;

            case "datetime":
            case "date":
            case "day":
            case "month":
            case "week":
              type = "date";
              valueEditorType = "date";
              operators = ["=", "!=", "<", "<=", ">", ">="];
              break;

            case "time":
              type = "string";
              valueEditorType = "time";
              operators = ["=", "!=", "<", "<=", ">", ">="];
              break;

            case "checkbox":
              type = "string";
              valueEditorType = "checkbox";
              operators = ["=", "!="];
              break;

            case "radio":
              type = "string";
              valueEditorType = "radio";
              operators = ["=", "!="];
              break;

            case "select":
              type = "string";
              valueEditorType = "select";
              operators = ["=", "!=", "in", "notIn"];
              break;

            case "selectboxes":
              type = "string";
              valueEditorType = "multiselect";
              operators = ["in", "notIn"];
              break;

            case "textarea":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains"];
              break;

            case "approval":
              type = "string";
              valueEditorType = "select";
              operators = ["=", "!="];
              break;

            // ✅ Yeni case'ler
            case "password":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!="];
              break;

            case "survey":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains"];
              break;

            case "color":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!="];
              break;

            case "search":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains", "beginsWith", "endsWith"];
              break;

            case "html":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains"];
              break;

            case "table":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains"];
              break;

            case "signature":
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!="];
              break;

            case "email":
            case "url":
            case "phoneNumber":
            case "textfield":
            default:
              type = "string";
              valueEditorType = "text";
              operators = ["=", "!=", "contains", "beginsWith", "endsWith"];
              break;
          }

          if (values.length > 0 && ["textfield", "textarea", "email", "url"].includes(mappedType)) {
            valueEditorType = values.length <= 5 ? "radio" : "select";
            operators = ["=", "!="];
          }

          let fieldValues = undefined;

          if (["select", "radio", "multiselect"].includes(valueEditorType)) {
            fieldValues = values.map((v) =>
              typeof v === "object"
                ? { label: v.label || v.value, value: v.value || v.label }
                : { label: v, value: v }
            );
          } else if (valueEditorType === "checkbox") {
            fieldValues = [
              { label: "Evet", value: true },
              { label: "Hayır", value: false },
            ];
          } else if (mappedType === "approval") {
            fieldValues = [
              { label: "Onaylandı", value: "approved" },
              { label: "Reddedildi", value: "rejected" },
              { label: "Beklemede", value: "pending" },
            ];
          }

          fields.push({
            name: item.key,
            label: item.label || item.key,
            type,
            operators,
            valueEditorType,
            values: fieldValues,
          });

          console.log(`🔧 Field: ${item.label} (${rawType}) → ${valueEditorType}`);
        }

        if (item.columns) {
          item.columns.forEach((col) => traverse(col.components || []));
        }
        if (item.components) {
          traverse(item.components);
        }
      }
    };

    traverse(components);
    return fields;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {showWizard && (
        <WorkflowWizard
          open={showWizard}
          onClose={() => setShowWizard(false)}
          onConfirm={handleWizardConfirm}
        />
      )}
      <WorkflowFormSelector
        open={formListOpen}
        onClose={() => setFormListOpen(false)}
        onConfirm={handleFormConfirm}
      />

      {/* Editor Toolbar */}
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
          pt: 0.5,
          pb: 0.5,
          mt: -1.5,
          position: "sticky",
          top: 0,
          zIndex: 7,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <MuiIcon color="info">schema</MuiIcon>
          <span style={{ fontWeight: 700, color: "#344767" }}>Workflow</span>
          <CustomInputComponent ref={txtname} />
        </MDBox>
        <MDBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MDButton color="secondary" variant="outlined" onClick={() => setFormListOpen(true)}>
            <MuiIcon sx={{ mr: .5 }}>description</MuiIcon> Form Seç
          </MDButton>
          <MDButton color="dark" variant="outlined" onClick={() => setIsPropertiesOpen((v) => !v)}>
            <MuiIcon sx={{ mr: .5 }}>view_sidebar</MuiIcon> Özellikler
          </MDButton>
          <MDButton color="error" variant="outlined" onClick={() => (cancelFlow ? cancelFlow() : setmsgOpen(true))}>
            <MuiIcon sx={{ mr: .5 }}>close</MuiIcon> Vazgeç
          </MDButton>
          <MDButton color="info" onClick={() => saveFlow && saveFlow()}>
            <MuiIcon sx={{ mr: .5 }}>save</MuiIcon> Kaydet
          </MDButton>
        </MDBox>
      </MDBox>

      <div style={{ width: "100%", height: "calc(100vh - 200px)", display: "flex", overflow: "auto" }}>
        <ReactFlowProvider>
          <Sidebar disabled={disabled} />
          {selectedForm && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "300px",
                zIndex: 1000,
                background: "linear-gradient(135deg,rgb(90, 112, 233) 0%,rgb(5, 99, 150) 100%)",
                color: "white",
                padding: "10px 16px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(16, 117, 185, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                maxWidth: "150px",
              }}
            >
              <span style={{ fontSize: "14px" }}>📋</span>
              <div>
                <span style={{ fontWeight: "700" }}>{selectedForm.formName}</span>
                <span style={{ marginLeft: "6px", opacity: "0.8", fontSize: "10px" }}>
                  ({selectedForm.id})
                </span>
              </div>
            </div>
          )}
          <Flow
            parentCallback={setDisabled}
            parsedFormDesign={parsedFormDesign}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            setParsedFormDesign={setParsedFormDesign}
            onRegisterActions={({ onSave, onCancel }) => {
              setSaveFlow(() => onSave);
              setCancelFlow(() => onCancel);
            }}
            isPropertiesOpen={isPropertiesOpen}
            {...props}
          />
        </ReactFlowProvider>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default WorkFlowDetail;
