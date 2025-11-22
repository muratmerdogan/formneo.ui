import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FormDataApi } from "api/generated";
import getConfiguration from "confiuration";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { Editor } from "@monaco-editor/react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { PlayArrow as PlayIcon, Save as SaveIcon } from "@mui/icons-material";

const ScriptTab = ({
  node,
  nodes = [],
  edges = [],
  parsedFormDesign,
  selectedForm,
  onButtonClick,
  open = false,
  onClose,
}) => {
  const [script, setScript] = useState("");
  const [name, setName] = useState("Script");
  const [formNodeDataCache, setFormNodeDataCache] = useState({}); // Form node'larının API'den çekilen data'sı

  // ✅ Node değiştiğinde state'i güncelle
  useEffect(() => {
    if (node?.data) {
      setScript(node.data.script || "");
      setName(node.data.name || "Script");
    }
  }, [node?.id, node?.data?.script, node?.data?.name]);

  // ✅ Form node'larından API'den form data çek
  useEffect(() => {
    const fetchFormNodesData = async () => {
      if (!node?.id || !edges || !nodes) return;

      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      const formNodes = incomingEdges
        .map((edge) => nodes.find((n) => n.id === edge.source))
        .filter((n) => n && n.type === "formNode");

      const cache = {};
      
      for (const formNode of formNodes) {
        const formId = formNode.data?.formId || 
                       formNode.data?.selectedFormId || 
                       formNode.data?.workflowFormInfo?.formId;
        
        if (formId && !formNodeDataCache[formId]) {
          try {
            const conf = getConfiguration();
            const api = new FormDataApi(conf);
            const response = await api.apiFormDataIdGet(formId);
            
            if (response.data) {
              cache[formId] = response.data;
            }
          } catch (error) {
            // ignore errors
          }
        } else if (formId && formNodeDataCache[formId]) {
          cache[formId] = formNodeDataCache[formId];
        }
      }
      
      if (Object.keys(cache).length > 0) {
        setFormNodeDataCache((prev) => ({ ...prev, ...cache }));
      }
    };

    fetchFormNodesData();
  }, [node?.id, edges, nodes]);

  // ✅ extractFieldsFromComponents helper fonksiyonu - Formily ve Formio formatlarını destekler
  const extractFieldsFromComponents = useMemo(() => {
    return (components) => {
      if (!components) return [];
      
      const fields = [];
      const excludedTypes = ["button", "submit", "reset", "dsbutton", "hidden", "dshidden", "file", "dsfile"];
      const excludedKeys = ["submit", "kaydet", "save", "button", "reset", "cancel", "iptal"];
      
            // ✅ Formily formatı: schema.properties objesi
      if (components.schema && components.schema.properties) {
        const properties = components.schema.properties;
        Object.keys(properties).forEach((key) => {
          const prop = properties[key];
          if (prop && prop.title) {
            const componentType = prop["x-component"] || "";
            const itemKey = (key || "").toLowerCase();
            
            // Button component'lerini hariç tut
            if (!componentType.toLowerCase().includes("button") && !excludedKeys.includes(itemKey)) {
              fields.push({
                name: key,
                label: prop.title || key, // title label olarak kullanılıyor
                type: prop.type || "string",
                component: componentType,
              });
            }
          }
        });
        return fields;
      }
      
      // ✅ Formio formatı: components array'i
      if (Array.isArray(components) && components.length > 0) {
        const traverse = (items) => {
          if (!items || !Array.isArray(items)) return;
          
          for (const item of items) {
            if (!item) continue;
            
            const isInput = item.input !== false && item.key;
            if (isInput) {
              const itemType = item.type || "";
              const itemKey = (item.key || "").toLowerCase();
              
              if (!excludedTypes.includes(itemType) && !excludedKeys.includes(itemKey)) {
                fields.push({
                  name: item.key,
                  label: item.label || item.key,
                  type: item.type || "string",
                });
              }
            }
            
            if (item.columns && Array.isArray(item.columns)) {
              item.columns.forEach((col) => {
                if (col && col.components) {
                  traverse(col.components);
                }
              });
            }
            
            if (item.components && Array.isArray(item.components)) {
              traverse(item.components);
            }
          }
        };
        
        traverse(components);
        return fields;
      }
      
      return fields;
    };
  }, []);

  // ✅ Process Data Tree - Önceki node'lardan değişkenleri topla
  const processDataTree = useMemo(() => {
    const tree = {
      workflow: {
        instanceId: "workflow.instanceId",
        startTime: "workflow.startTime",
        currentStep: "workflow.currentStep",
        formId: "workflow.formId",
        formName: "workflow.formName",
      },
      previousNodes: {},
    };

    // Önceki node'ları bul (incoming edges)
    if (node?.id && edges) {
      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      incomingEdges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode && sourceNode.type !== "startNode") {
          const nodeName = sourceNode.data?.name || sourceNode.id;
          tree.previousNodes[nodeName] = {};

          // Node type'a göre output field'ları ekle
          if (sourceNode.type === "formNode") {
            tree.previousNodes[nodeName].action = `previousNodes.${nodeName}.action`;
            tree.previousNodes[nodeName].formData = `previousNodes.${nodeName}.formData`;
            
            // ✅ Sadece API'den çekilen güncel formDesign'dan component'leri extract et
            const formId = sourceNode.data?.formId || 
                          sourceNode.data?.selectedFormId || 
                          sourceNode.data?.workflowFormInfo?.formId;
            
            if (formId && formNodeDataCache[formId]?.formDesign) {
              try {
                const raw = typeof formNodeDataCache[formId].formDesign === "string"
                  ? JSON.parse(formNodeDataCache[formId].formDesign)
                  : formNodeDataCache[formId].formDesign;

                let formFields = [];
                
                // ✅ Formily formatı: schema.properties içinde component'ler var
                if (raw?.schema?.properties) {
                  formFields = extractFieldsFromComponents(raw);
                }
                // ✅ Formio formatı: components array'i
                else if (raw?.components && Array.isArray(raw.components)) {
                  formFields = extractFieldsFromComponents(raw.components);
                }
                // ✅ Eski format: fields array'i
                else if (raw?.fields && Array.isArray(raw.fields) && raw.fields.length > 0) {
                  formFields = raw.fields;
                }
                
                // Form field'larını ekle (label olarak title gösterilecek)
                if (formFields.length > 0) {
                  formFields.forEach((field) => {
                    // Label (title) görünen isim olarak, name ise script'te kullanılacak key
                    const displayLabel = field.label || field.name;
                    tree.previousNodes[nodeName][displayLabel] = `previousNodes.${nodeName}.${field.name}`;
                  });
                }
              } catch (e) {
                // ignore parse errors
              }
            }
          } else if (sourceNode.type === "userTaskNode") {
            tree.previousNodes[nodeName].action = `previousNodes.${nodeName}.action`;
            tree.previousNodes[nodeName].userId = `previousNodes.${nodeName}.userId`;
            tree.previousNodes[nodeName].userName = `previousNodes.${nodeName}.userName`;
          } else if (sourceNode.type === "setFieldNode") {
            tree.previousNodes[nodeName].updatedFields = `previousNodes.${nodeName}.updatedFields`;
            tree.previousNodes[nodeName].summary = `previousNodes.${nodeName}.summary`;
          } else if (sourceNode.type === "approverNode") {
            tree.previousNodes[nodeName].approvalStatus = `previousNodes.${nodeName}.approvalStatus`;
            tree.previousNodes[nodeName].approverId = `previousNodes.${nodeName}.approverId`;
          } else if (sourceNode.type === "formConditionNode") {
            tree.previousNodes[nodeName].conditionResult = `previousNodes.${nodeName}.conditionResult`;
          }
        }
      });
    }

    return tree;
  }, [node?.id, nodes, edges, extractFieldsFromComponents, formNodeDataCache]);

  // ✅ Expanded state for tree
  const [expanded, setExpanded] = useState({});

  const handleToggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Tree item render helper
  const renderTreeItem = (key, value, parentPath = "", level = 0) => {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;
    // İlk seviye için varsayılan olarak açık, diğerleri için expanded state'e bak
    const isExpanded = level === 0 ? (expanded[currentPath] !== undefined ? expanded[currentPath] : true) : (expanded[currentPath] !== undefined ? expanded[currentPath] : false);

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const hasChildren = Object.keys(value).length > 0;
      return (
        <Box key={key} sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => hasChildren && handleToggle(currentPath)}
            sx={{ py: 0.5 }}
          >
            {hasChildren && (isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />)}
            <Typography variant="body2" fontWeight={600} sx={{ ml: hasChildren ? 0 : 2 }}>
              {key}
            </Typography>
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.entries(value).map(([subKey, subValue]) =>
                  renderTreeItem(subKey, subValue, currentPath, level + 1)
                )}
              </List>
            </Collapse>
          )}
        </Box>
      );
    } else {
      return (
        <ListItem
          key={key}
          component="div"
          onClick={() => {
            // Monaco Editor'a değişkeni ekle
            const editor = window.monacoEditorRef;
            if (editor) {
              const selection = editor.getSelection();
              const text = typeof value === "string" ? value : currentPath;
              editor.executeEdits("insert-variable", [
                {
                  range: selection,
                  text: text,
                },
              ]);
            }
          }}
          sx={{
            pl: level * 2 + 4,
            py: 0.5,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {key}
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="textSecondary" sx={{ fontFamily: "monospace" }}>
                {typeof value === "string" ? value : currentPath}
              </Typography>
            }
          />
        </ListItem>
      );
    }
  };

  // ✅ Kaydet
  const handleSave = () => {
    if (!script.trim()) {
      alert("Lütfen bir script yazın");
      return;
    }

    const nodeData = {
      name,
      script,
      processDataTree,
    };

    if (onButtonClick) {
      onButtonClick({
        id: node.id,
        data: nodeData,
      });
    }

    alert("Script kaydedildi 🎉");
  };

  // ✅ Test et
  const handleTest = () => {
    try {
      // Syntax kontrolü ve boolean dönüş kontrolü
      const testFunction = new Function("workflow", "formData", "previousNodes", script);
      const result = testFunction(
        { instanceId: "test", startTime: new Date(), currentStep: 1, formId: "test", formName: "Test" },
        {},
        {}
      );
      
      if (typeof result !== "boolean") {
        alert(`⚠️ Script boolean döndürmüyor. Dönen değer: ${typeof result}. Script true veya false döndürmelidir.`);
        return;
      }
      
      alert(`Script syntax kontrolü başarılı ✅\nDönen değer: ${result} (${result ? "TRUE" : "FALSE"})`);
    } catch (error) {
      alert(`Script hatası: ${error.message}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "700px",
          maxHeight: "90vh",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
          padding: "20px 24px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <CodeIcon sx={{ fontSize: "28px" }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
                Script Node
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                JavaScript koşulları ve işlemleri yazın
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, height: "600px" }}>
        <Splitter style={{ height: "100%", width: "100%" }} layout="horizontal">
          {/* Sol Panel - Process Data Tree */}
          <SplitterPanel size={30} minSize={20} style={{ overflow: "auto" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Process Data
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: "block" }}>
                Değişkenleri tıklayarak script&apos;e ekleyin
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List sx={{ width: "100%" }}>
                {renderTreeItem("workflow", processDataTree.workflow)}
                {Object.keys(processDataTree.previousNodes).length > 0 &&
                  renderTreeItem("previousNodes", processDataTree.previousNodes)}
              </List>
            </Box>
          </SplitterPanel>

          {/* Sağ Panel - Monaco Editor */}
          <SplitterPanel size={70} minSize={50} style={{ overflow: "hidden" }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  JavaScript Editor
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
                  Script true veya false döndürmelidir. Örnek: <code>return formData.amount &gt; 1000;</code>
                </Typography>
              </Box>

              <Box sx={{ flex: 1, position: "relative", minHeight: "500px" }}>
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-light"
                  value={script}
                  onChange={(value) => setScript(value || "")}
                  onMount={(editor) => {
                    // Editor referansını global'e kaydet (tree item click için)
                    window.monacoEditorRef = editor;
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    formatOnPaste: true,
                    formatOnType: true,
                    autoIndent: "full",
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: "all",
                  }}
                />
              </Box>
            </Box>
          </SplitterPanel>
        </Splitter>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
        <Button onClick={handleTest} variant="outlined" startIcon={<PlayIcon />}>
          Test Et
        </Button>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            minWidth: "120px",
          }}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScriptTab;

