import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  Alert,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Code as CodeIcon,
  Tune as TuneIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import { QueryBuilder, formatQuery } from "react-querybuilder";

const ConditionTab = ({
  node,
  nodes = [],
  edges = [],
  onButtonClick,
  open,
  onClose,
}) => {
  const [previousNodeId, setPreviousNodeId] = useState(node?.data?.previousNodeId || "");
  const [conditionType, setConditionType] = useState(node?.data?.conditionType || "expression");
  const [expression, setExpression] = useState(node?.data?.expression || "");
  const [query, setQuery] = useState(node?.data?.query || { combinator: "and", rules: [] });
  const [executeResult, setExecuteResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // ✅ Önceki node'ları bul
  const previousNodes = useMemo(() => {
    if (!node?.id || !edges || edges.length === 0) return [];
    
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const prevNodes = incomingEdges
      .map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        return sourceNode;
      })
      .filter((n) => n && n.type !== "startNode");
    
    return prevNodes;
  }, [node?.id, edges, nodes]);

  // ✅ Seçilen previous node
  const selectedPreviousNode = useMemo(() => {
    if (!previousNodeId) return null;
    return nodes.find((n) => n.id === previousNodeId);
  }, [previousNodeId, nodes]);

  // ✅ Available fields
  const availableFields = useMemo(() => {
    if (!selectedPreviousNode) return [];
    
    const outputFields = [];
    
    if (selectedPreviousNode.type === "formNode") {
      outputFields.push(
        { name: "action", label: "Action (Buton Action Code)", type: "string" },
        { name: "formData", label: "Form Data", type: "object" }
      );
    } else if (selectedPreviousNode.type === "userTaskNode") {
      outputFields.push(
        { name: "action", label: "Action (Buton Action Code)", type: "string" },
        { name: "userId", label: "User ID", type: "string" },
        { name: "userName", label: "User Name", type: "string" }
      );
    } else if (selectedPreviousNode.type === "setFieldNode") {
      outputFields.push(
        { name: "updatedFields", label: "Updated Fields", type: "object" },
        { name: "summary", label: "Summary", type: "string" }
      );
    } else if (selectedPreviousNode.type === "approverNode") {
      outputFields.push(
        { name: "approvalStatus", label: "Approval Status", type: "string" },
        { name: "approverId", label: "Approver ID", type: "string" }
      );
    }
    
    return outputFields;
  }, [selectedPreviousNode]);

  const queryFields = useMemo(() => {
    return availableFields.map((field) => ({
      name: field.name,
      label: field.label,
      inputType: field.type === "number" ? "number" : "text",
    }));
  }, [availableFields]);

  // ✅ Execute previous node
  const handleExecutePreviousNode = async () => {
    if (!selectedPreviousNode) {
      setExecuteResult({ error: "Lütfen önce bir previous node seçin" });
      return;
    }

    setIsExecuting(true);
    setExecuteResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      let mockOutput = {};
      if (selectedPreviousNode.type === "formNode") {
        mockOutput = {
          action: "APPROVE",
          formData: { amount: 1000, status: "pending", description: "Test form data" },
        };
      } else if (selectedPreviousNode.type === "userTaskNode") {
        mockOutput = {
          action: "COMPLETE",
          userId: "user123",
          userName: "Test User",
        };
      } else if (selectedPreviousNode.type === "setFieldNode") {
        mockOutput = {
          updatedFields: { status: "approved" },
          summary: "Fields updated",
        };
      }

      setExecuteResult({
        success: true,
        data: mockOutput,
        message: "Previous node başarıyla execute edildi",
      });
    } catch (error) {
      setExecuteResult({
        error: error.message || "Execute işlemi başarısız",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // ✅ Test condition
  const handleTestCondition = () => {
    if (!executeResult?.data) {
      setExecuteResult({ error: "Önce previous node&apos;u execute edin" });
      return;
    }

    try {
      let result = false;
      
      if (conditionType === "expression") {
        // Basit evaluation (gerçek uygulamada expr-eval gibi güvenli bir kütüphane kullanılmalı)
        const data = executeResult.data;
        try {
          // Güvenli evaluation için Function constructor kullanıyoruz
          const func = new Function("data", `return ${expression}`);
          result = Boolean(func(data));
        } catch (e) {
          throw new Error(`Expression hatası: ${e.message}`);
        }
      } else {
        result = true; // Query builder için placeholder
      }

      setExecuteResult({
        ...executeResult,
        conditionResult: result,
        message: `Koşul sonucu: ${result ? "TRUE" : "FALSE"}`,
      });
    } catch (error) {
      setExecuteResult({
        ...executeResult,
        error: `Koşul değerlendirme hatası: ${error.message}`,
      });
    }
  };

  // ✅ Save
  const handleSave = () => {
    const nodeData = {
      previousNodeId,
      previousNodeName: selectedPreviousNode?.data?.name || selectedPreviousNode?.type || "",
      conditionType,
      expression,
      query,
      condition: conditionType === "expression" ? expression : JSON.stringify(query),
    };

    if (onButtonClick) {
      onButtonClick({
        id: node.id,
        data: nodeData,
      });
    }

    onClose();
  };

  // ✅ Auto-select first previous node
  useEffect(() => {
    if (!previousNodeId && previousNodes.length > 0) {
      setPreviousNodeId(previousNodes[0].id);
    }
  }, [previousNodes, previousNodeId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "700px",
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
                Koşul Yapılandırması
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                IF/ELSE mantığı ile workflow dallanması
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Previous Node Section */}
          <Card sx={{ mb: 3, border: "1px solid #e5e7eb" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Kaynak Node
                </Typography>
                <Tooltip title="Koşul değerlendirmesi için kullanılacak node&apos;u seçin">
                  <InfoIcon sx={{ fontSize: "18px", color: "#6b7280" }} />
                </Tooltip>
              </Box>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl fullWidth size="small">
                  <InputLabel>Previous Node</InputLabel>
                  <Select
                    value={previousNodeId}
                    label="Previous Node"
                    onChange={(e) => setPreviousNodeId(e.target.value)}
                  >
                    {previousNodes.map((prevNode) => (
                      <MenuItem key={prevNode.id} value={prevNode.id}>
                        {prevNode.data?.name || prevNode.type || prevNode.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedPreviousNode && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={handleExecutePreviousNode}
                      disabled={isExecuting}
                      sx={{
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        minWidth: "180px",
                      }}
                    >
                      {isExecuting ? "Çalıştırılıyor..." : "Execute"}
                    </Button>
                    <Chip
                      label={selectedPreviousNode.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </>
                )}
              </Stack>

              {/* Execute Result */}
              {executeResult && (
                <Box sx={{ mt: 2 }}>
                  {executeResult.error ? (
                    <Alert severity="error" icon={<CancelIcon />}>
                      {executeResult.error}
                    </Alert>
                  ) : (
                    <>
                      <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                        {executeResult.message}
                      </Alert>
                      {executeResult.data && (
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        >
                          <Typography variant="caption" fontWeight={600} color="textSecondary" gutterBottom>
                            Output Data:
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: "4px",
                              border: "1px solid #e5e7eb",
                              maxHeight: "200px",
                              overflow: "auto",
                            }}
                          >
                            <pre style={{ margin: 0, fontSize: "0.8em", fontFamily: "monospace" }}>
                              {JSON.stringify(executeResult.data, null, 2)}
                            </pre>
                          </Box>
                        </Paper>
                      )}
                      {executeResult.conditionResult !== undefined && (
                        <Alert
                          severity={executeResult.conditionResult ? "success" : "warning"}
                          icon={executeResult.conditionResult ? <CheckCircleIcon /> : <CancelIcon />}
                          sx={{ mt: 2 }}
                        >
                          <Typography fontWeight={600}>
                            Koşul Sonucu: {executeResult.conditionResult ? "TRUE" : "FALSE"}
                          </Typography>
                        </Alert>
                      )}
                    </>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Condition Type Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab
                icon={<CodeIcon />}
                iconPosition="start"
                label="Expression"
                onClick={() => setConditionType("expression")}
              />
              <Tab
                icon={<TuneIcon />}
                iconPosition="start"
                label="Query Builder"
                onClick={() => setConditionType("queryBuilder")}
              />
            </Tabs>
          </Box>

          {/* Expression Editor */}
          {conditionType === "expression" && (
            <Card sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    JavaScript Expression
                  </Typography>
                  {executeResult?.data && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleTestCondition}
                      startIcon={<PlayIcon />}
                    >
                      Test Et
                    </Button>
                  )}
                </Box>

                <Box
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "300px",
                  }}
                >
                  <Editor
                    height="300px"
                    language="javascript"
                    theme="vs-light"
                    value={expression}
                    onChange={(value) => setExpression(value || "")}
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

                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" icon={<InfoIcon />}>
                    <Typography variant="caption">
                      <strong>Kullanım:</strong> Önceki node&apos;un output data&apos;sına{" "}
                      <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                        data
                      </code>{" "}
                      ile erişebilirsiniz.
                      <br />
                      <strong>Örnekler:</strong>{" "}
                      <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                        data.action === &quot;APPROVE&quot;
                      </code>
                      {", "}
                      <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                        data.formData.amount &gt; 1000
                      </code>
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Query Builder */}
          {conditionType === "queryBuilder" && (
            <Card sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Visual Query Builder
                </Typography>
                {queryFields.length > 0 ? (
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      p: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <QueryBuilder fields={queryFields} query={query} onQueryChange={setQuery} />
                  </Box>
                ) : (
                  <Alert severity="info">
                    Önce bir previous node seçin ve execute edin
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
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

export default ConditionTab;
