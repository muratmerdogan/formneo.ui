import React, { useState, useRef, createRef, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
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
import { Configuration, WorkFlowDefinationListDto, WorkFlowDefinationApi } from "api/generated";
import { TextField } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { MessageBoxType, MessageBoxAction } from "@ui5/webcomponents-react";
import { getConfig } from "@testing-library/react";
import getConfiguration from "confiuration";
import MDInput from "components/MDInput";
import CustomInputComponent from "./CustomInput";
import SqlConditionNode from "./components/SqlConditionNode.jsx";
import SqlConditionTab from "./propertiespanel/SqlConditionTab.jsx";
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
  const navigate = useNavigate();
  const dispatchBusy = useBusy();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

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

  const dispatchAlert = useAlert();
  const [count, setCount] = useState(0);
  const { setViewport } = useReactFlow();
  const { id } = useParams();
  useEffect(() => {
    dispatchBusy({ isBusy: true });

    if (id) {
      setisEdit(true);
    }
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
        }
      })
      .catch((error) => {});
    dispatchBusy({ isBusy: false });
  }, [setNodes, setViewport]);
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
      // StartNode zaten eklenmişse, başka bir tane eklemeyi engelle

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = generateUUID();
      const newNode = {
        id,
        type,
        position,
        className: "noHaveEdges",
        data: { name: "Varsayılan İsim", text: "Varsayılan Metin" },
      };

      if (id == 1) {
        props.parentCallback(false);
        setFirstNode(newNode);
      }

      console.log(globalArray);
      if (type === "startNode" && globalArray.some((node) => node.type === "startNode")) {
        // Helper.showError("Başlangıç node'u yalnız bir kez eklenebilir.");
        // return;
      }

      // StopNode zaten eklenmişse, başka bir tane eklemeyi engelle

      if (type === "stopNode" && globalArray.some((node) => node.type === "stopNode")) {
        // Helper.showError("Bitiş node'u yalnız bir kez eklenebilir.");
        // return;
      }

      // alert("111");

      globalArray.push(newNode);

      setNodes((nds) => [...nds, newNode]);

      // setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handlePropertiesChange = (newValue) => {
    // alert(newValue);
    let obje = nodes.find((o) => o.id === newValue.id);
    if (obje) {
      obje.data = newValue.data;
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

    // const flow = { ...reactFlowInstance.toObject(), firstNode };
    // localStorage.setItem(flowKey, JSON.stringify(flow));
    // console.log(JSON.stringify(flow))
    // alert(txtname.current?.current);

    if (txtname.current?.current.toString().trim() == "") {
      dispatchAlert({ message: "Akış Adı Boş Bırakılamaz", type: MessageBoxType.Error });
      return;
    }

    if (reactFlowInstance && !haveNodeWithoutEdge.length) {
      const flow = { ...reactFlowInstance.toObject(), firstNode };
      // localStorage.setItem(flowKey, JSON.stringify(flow));
      if (isEdit) {
        var dto = {
          id: id,
          workflowName: txtname.current?.current,
          defination: JSON.stringify(flow),
          isActive: false,
          revision: 0,
        };

        var conf = getConfiguration();

        let api = new WorkFlowDefinationApi(conf);
        dto.workflowName = txtname.current?.current;

        var data = api
          .apiWorkFlowDefinationPut(dto)
          .then((response) => {
            dispatchAlert({ message: "Kayıt Güncelleme Başarılı", type: MessageBoxType.Success });
          })
          .catch((error) => {
            dispatchAlert({
              message: error.response?.data || "Bilinmeyen bir hata oluştu",
              type: MessageBoxType.Error,
            });
          });
      } else {
        var dto = {
          workflowName: txtname.current?.current,
          defination: JSON.stringify(flow),
          isActive: false,
          revision: 0,
        };

        var conf = getConfiguration();
        var conf = getConfiguration();
        let api = new WorkFlowDefinationApi(conf);
        dto.workflowName = txtname.current?.current;

        var data = api
          .apiWorkFlowDefinationPost(dto)
          .then((response) => {
            dispatchAlert({ message: "Kayıt Ekleme Başarılı", type: MessageBoxType.Success });
            navigate("/WorkFlowList");
          })
          .catch((error) => {
            dispatchAlert({
              message: error.response?.data || "Bilinmeyen bir hata oluştu",
              type: MessageBoxType.Error,
            });
          });
      }
    }
  }, [reactFlowInstance]);

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
    <Splitter style={{ height: "100vh", width: "100%" }} layout="vertical">
      <SplitterPanel size={70} minSize={20} style={{ overflow: "auto" }}>
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
            >
              <Panel position="top-right">
                <span>Form Adı</span>
                <CustomInputComponent ref={txtname}></CustomInputComponent>
                <Button icon="decline" onClick={() => setmsgOpen(true)} design="Emphasized">
                  Vazgeç
                </Button>
                <Button icon="save" onClick={onSave}>
                  Kaydet
                </Button>
                <Button icon="delete" onClick={onDelete}>
                  Seçileni Sil
                </Button>
              </Panel>
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

      <SplitterPanel size={30} minSize={10} style={{ overflow: "auto" }}>
        {isLoadingProperties ? (
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        ) : (
          renderComponent(selecteNodeType, selecteNodeData, selectedNode, handlePropertiesChange)
        )}
      </SplitterPanel>
    </Splitter>
  );
}

const renderComponent = (type, data, node, handlePropertiesChange) => {
  switch (type) {
    case "startNode":
      return data ? (
        <StartTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;
    case "stopNode":
      return data ? (
        <StopTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;
    case "approverNode":
      return data ? (
        <AprroveTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;

    case "sqlConditionNode":
      return data ? (
        <SqlConditionTab
          key={node.id}
          initialValues={data}
          node={node}
          onButtonClick={handlePropertiesChange}
        />
      ) : null;
    default:
  }
};

function WorkFlowDetail(props) {
  const [disabled, setDisabled] = useState(!id);

  return (
    <DashboardLayout>
      <div style={{ width: "80vw", height: "800vh", display: "flex" }}>
        <ReactFlowProvider>
          <Sidebar disabled={disabled} />
          <Flow parentCallback={setDisabled} {...props} />
        </ReactFlowProvider>
      </div>
    </DashboardLayout>
  );
}

export default WorkFlowDetail;
