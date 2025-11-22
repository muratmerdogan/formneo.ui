import React, { useState, useEffect, useMemo } from "react";
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

  // ✅ Node değiştiğinde state'i güncelle
  useEffect(() => {
    if (node?.data) {
      setScript(node.data.script || "");
      setName(node.data.name || "Script");
    }
  }, [node?.id, node?.data?.script, node?.data?.name]);

  // ✅ Process Data Tree - Önceki node'lardan ve form data'dan değişkenleri topla
  const processDataTree = useMemo(() => {
    const tree = {
      workflow: {
        instanceId: "workflow.instanceId",
        startTime: "workflow.startTime",
        currentStep: "workflow.currentStep",
        formId: "workflow.formId",
        formName: "workflow.formName",
      },
      formData: {},
      previousNodes: {},
    };

    // Form data'dan field'ları ekle
    if (parsedFormDesign?.fields) {
      parsedFormDesign.fields.forEach((field) => {
        tree.formData[field.name] = `formData.${field.name}`;
      });
    }

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
  }, [node?.id, nodes, edges, parsedFormDesign]);

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
      // Basit syntax kontrolü
      new Function(script);
      alert("Script syntax kontrolü başarılı ✅");
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
                {renderTreeItem("formData", processDataTree.formData)}
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

