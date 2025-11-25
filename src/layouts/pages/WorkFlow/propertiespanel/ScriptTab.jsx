import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FormDataApi, FormApi } from "api/generated";
import getConfiguration from "confiuration";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Code as CodeIcon,
  Info as InfoIcon,
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
  const [formInputsCache, setFormInputsCache] = useState({}); // Form input'ları cache'i (/api/Form/{id}/inputs)
  const [loadingInputs, setLoadingInputs] = useState(false); // Input'lar yükleniyor mu?

  // ✅ Node değiştiğinde state'i güncelle
  useEffect(() => {
    if (node?.data) {
      setScript(node.data.script || "");
      setName(node.data.name || "Script");
    }
  }, [node?.id, node?.data?.script, node?.data?.name]);

  // ✅ Modal açıldığında sadece 1 kez form inputs çek (/api/Form/{id}/inputs)
  useEffect(() => {
    if (!open || !node?.id || !edges || !nodes) return;
    
    const fetchFormInputs = async () => {
      setLoadingInputs(true);
      
      try {
        const incomingEdges = edges.filter((edge) => edge.target === node.id);
        const formNodes = incomingEdges
          .map((edge) => nodes.find((n) => n.id === edge.source))
          .filter((n) => n && n.type === "formNode");

        const inputsCache = {};
        const formIdsToFetch = [];
        
        // Önce hangi formId'lerin cache'de olmadığını belirle
        for (const formNode of formNodes) {
          const formId = formNode.data?.formId || 
                         formNode.data?.selectedFormId || 
                         formNode.data?.workflowFormInfo?.formId;
          
          if (formId && !formInputsCache[formId]) {
            formIdsToFetch.push(formId);
          }
        }
        
        // Sadece cache'de olmayan formId'ler için API çağrısı yap
        if (formIdsToFetch.length > 0) {
          for (const formId of formIdsToFetch) {
            try {
              const conf = getConfiguration();
              const formApi = new FormApi(conf);
              // ✅ GET /api/Form/{id}/inputs endpoint'ine istek yap
              const response = await formApi.apiFormIdInputsGet(formId);
              
              // Response data'yı cache'e kaydet
              if (response.data !== undefined && response.data !== null) {
                inputsCache[formId] = response.data;
              }
            } catch (error) {
              // ignore errors
            }
          }
          
          // Cache'i güncelle (sadece yeni çekilenler için)
          if (Object.keys(inputsCache).length > 0) {
            setFormInputsCache((prev) => ({ ...prev, ...inputsCache }));
          }
        }
      } finally {
        setLoadingInputs(false);
      }
    };

    fetchFormInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Sadece modal açıldığında (open=true) çalışsın

  // ✅ extractFieldsFromComponents helper fonksiyonu - Formily ve Formio formatlarını destekler
  const extractFieldsFromComponents = useMemo(() => {
    return (components) => {
      if (!components) return [];
      
      const fields = [];
      const excludedTypes = ["button", "submit", "reset", "dsbutton", "hidden", "dshidden", "file", "dsfile"];
      const excludedKeys = ["submit", "kaydet", "save", "button", "reset", "cancel", "iptal"];
      
      // ✅ Formily formatı: schema.properties objesi (nested properties desteği ile)
      if (components.schema && components.schema.properties) {
        const traverseProperties = (props, parentPath = "") => {
          if (!props || typeof props !== "object") return;
          
          Object.keys(props).forEach((key) => {
            const prop = props[key];
            if (!prop || typeof prop !== "object") return;
            
            const componentType = prop["x-component"] || "";
            const itemKey = (key || "").toLowerCase();
            const propType = prop.type || "";
            
            // Void type (Card, FormLayout gibi container'lar) - nested properties'e git
            if (propType === "void" && prop.properties && typeof prop.properties === "object") {
              traverseProperties(prop.properties, parentPath ? `${parentPath}.${key}` : key);
            }
            // Normal field (string, number, vb.) - title varsa ekle
            else if (prop.title && propType !== "void") {
              // Button component'lerini hariç tut
              if (!componentType.toLowerCase().includes("button") && 
                  !excludedKeys.includes(itemKey) &&
                  !excludedTypes.includes(componentType.toLowerCase())) {
                fields.push({
                  name: key,
                  label: prop.title || key,
                  type: propType || "string",
                  component: componentType,
                });
              }
            }
            // Nested properties varsa (void olmayan ama properties'i olan)
            else if (prop.properties && typeof prop.properties === "object") {
              traverseProperties(prop.properties, parentPath ? `${parentPath}.${key}` : key);
            }
          });
        };
        
        traverseProperties(components.schema.properties);
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

  // ✅ Form alanlarını düz liste olarak topla (tree yerine)
  const formFieldsList = useMemo(() => {
    const fields = [];

    // Önceki node'ları bul (incoming edges)
    if (node?.id && edges) {
      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      incomingEdges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode && sourceNode.type === "formNode") {
          const nodeName = sourceNode.data?.name || sourceNode.id;
          
          // ✅ /api/Form/{id}/inputs endpoint'inden gelen input'ları kullan
          const formId = sourceNode.data?.formId || 
                        sourceNode.data?.selectedFormId || 
                        sourceNode.data?.workflowFormInfo?.formId;
          
          if (formId && formInputsCache[formId]) {
            try {
              const inputs = formInputsCache[formId];
              
              // Input'lar array olabilir veya object olabilir
              let inputArray = [];
              if (Array.isArray(inputs)) {
                inputArray = inputs;
              } else if (inputs && typeof inputs === "object") {
                if (inputs.inputs && Array.isArray(inputs.inputs)) {
                  inputArray = inputs.inputs;
                } else if (inputs.fields && Array.isArray(inputs.fields)) {
                  inputArray = inputs.fields;
                } else {
                  inputArray = Object.values(inputs);
                }
              }
              
              // Input'ları düz listeye ekle
              if (inputArray.length > 0) {
                inputArray.forEach((input) => {
                  // ✅ Component'lerin name alanını öncelikli kullan (key yerine)
                  const fieldId = input.name || input.id || input.key || input.fieldName || "";
                  const fieldLabel = input.label || input.title || input.fieldLabel || input.name || fieldId;
                  const componentType = input.componentType || input.type || input.component || "unknown";
                  
                  if (fieldId) {
                    fields.push({
                      fieldId,
                      fieldLabel,
                      componentType,
                      nodeName,
                      path: `previousNodes.${nodeName}.${fieldId}`
                    });
                  }
                });
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      });
    }

    return fields;
  }, [node?.id, nodes, edges, formInputsCache]);

  // ✅ Form alanını editor'e ekle
  const handleFieldClick = (fieldId, path) => {
    const editor = window.monacoEditorRef;
    if (editor) {
      const selection = editor.getSelection();
      // Tıklayınca ID'yi yaz (path yerine direkt fieldId veya path)
      editor.executeEdits("insert-variable", [
        {
          range: selection,
          text: path, // previousNodes.nodeName.fieldId formatında
        },
      ]);
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
      formFieldsList, // Form alanlarını da kaydet (runtime'da kullanılabilir)
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

              {loadingInputs ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Form input&apos;ları yükleniyor...
                  </Typography>
                </Box>
              ) : formFieldsList.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Form alanları bulunamadı. Lütfen önce bir FormNode ekleyin ve bağlayın.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ width: "100%", maxHeight: "500px", overflowY: "auto" }}>
                  {formFieldsList.map((field, index) => (
                    <Tooltip
                      key={`${field.nodeName}-${field.fieldId}-${index}`}
                      title={
                        <Box>
                          <Typography variant="caption" display="block" fontWeight={600}>
                            Component: {field.componentType}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Node: {field.nodeName}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Path: {field.path}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <ListItem
                        component="div"
                        onClick={() => handleFieldClick(field.fieldId, field.path)}
                        sx={{
                          py: 1,
                          px: 2,
                          cursor: "pointer",
                          borderBottom: "1px solid #e5e7eb",
                          "&:hover": { 
                            backgroundColor: "#f5f5f5",
                            transform: "translateX(4px)",
                            transition: "all 0.2s"
                          },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: "monospace",
                                fontWeight: 600,
                                color: "#6366f1"
                              }}
                            >
                              {field.fieldId}
                            </Typography>
                            <Chip 
                              label={field.componentType} 
                              size="small" 
                              sx={{ 
                                height: "20px",
                                fontSize: "0.65rem",
                                bgcolor: "#e0e7ff",
                                color: "#6366f1"
                              }} 
                            />
                          </Box>
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ display: "block" }}
                          >
                            {field.fieldLabel}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ 
                              fontFamily: "monospace",
                              fontSize: "0.7rem",
                              display: "block",
                              mt: 0.5
                            }}
                          >
                            {field.path}
                          </Typography>
                        </Box>
                        <InfoIcon fontSize="small" sx={{ color: "#9ca3af", ml: 1 }} />
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              )}
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

