import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Icon,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

const HttpPostTab = ({ node, initialValues, onButtonClick, workflowData }) => {
  const [formData, setFormData] = useState({
    url: initialValues?.url || "",
    method: initialValues?.method || "POST",
    headers: initialValues?.headers || '{"Content-Type": "application/json"}',
    body: initialValues?.body || "{}",
    timeout: initialValues?.timeout || 30000,
    ...initialValues,
  });

  const [availableVariables, setAvailableVariables] = useState([]);

  // Workflow verilerinden değişkenleri çıkar
  useEffect(() => {
    if (workflowData) {
      const variables = extractVariablesFromWorkflow(workflowData);
      setAvailableVariables(variables);
    }
  }, [workflowData]);

  const extractVariablesFromWorkflow = (data) => {
    const variables = [];

    // Workflow metadata
    if (data.workflow) {
      variables.push(
        { key: "workflow_id", value: data.workflow.id, description: "Workflow kimliği" },
        { key: "workflow_name", value: data.workflow.name, description: "Workflow adı" },
        {
          key: "workflow_start_time",
          value: data.workflow.startTime,
          description: "Başlangıç zamanı",
        },
        { key: "current_step", value: data.workflow.currentStep, description: "Mevcut adım" }
      );
    }

    // Form verileri - sadece gerekli alanlar
    if (data.form) {
      variables.push(
        { key: "form_id", value: data.form.id, description: "Form kimliği" },
        { key: "form_name", value: data.form.name, description: "Form adı" }
      );
    }

    // Node sonuçları
    if (data.steps && data.steps.length > 0) {
      data.steps.forEach((step, index) => {
        variables.push({
          key: `step_${index + 1}_result`,
          value: JSON.stringify(step.result),
          description: `${step.nodeType} sonucu`,
        });
      });
    }

    // Özel değişkenler
    if (data.variables?.queryResults?.length > 0) {
      variables.push({
        key: "query_results",
        value: JSON.stringify(data.variables.queryResults),
        description: "Sorgu sonuçları",
      });
    }

    if (data.variables?.approvals?.length > 0) {
      variables.push({
        key: "approval_results",
        value: JSON.stringify(data.variables.approvals),
        description: "Onay sonuçları",
      });
    }

    return variables;
  };

  const handleSave = () => {
    if (onButtonClick) {
      onButtonClick({
        id: node.id,
        data: formData,
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Değişkeni body'e ekle
  const insertVariable = (variable) => {
    const currentBody = formData.body;
    try {
      const bodyObj = JSON.parse(currentBody);
      bodyObj[variable.key] = `{{${variable.key}}}`;
      setFormData((prev) => ({
        ...prev,
        body: JSON.stringify(bodyObj, null, 2),
      }));
    } catch (e) {
      // JSON değilse direkt ekle
      setFormData((prev) => ({
        ...prev,
        body: currentBody + `\n"${variable.key}": "{{${variable.key}}}"`,
      }));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Başlık */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
          pb: 2,
          borderBottom: "2px solid #f1f5f9",
        }}
      >
        <Icon sx={{ color: "#ff6b6b", fontSize: 28 }}>send</Icon>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#ff6b6b" }}>
          HTTP POST - Workflow Verileri
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* URL */}
        <Grid item xs={12}>
          <MDInput
            label="API URL"
            value={formData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://api.example.com/webhook"
            fullWidth
            required
          />
        </Grid>

        {/* Method & Timeout */}
        <Grid item xs={6}>
          <MDInput
            label="HTTP Method"
            value={formData.method}
            onChange={(e) => handleChange("method", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <MDInput
            label="Timeout (ms)"
            type="number"
            value={formData.timeout}
            onChange={(e) => handleChange("timeout", parseInt(e.target.value))}
            fullWidth
          />
        </Grid>

        {/* Headers */}
        <Grid item xs={12}>
          <MDInput
            label="Headers (JSON)"
            value={formData.headers}
            onChange={(e) => handleChange("headers", e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        {/* Body */}
        <Grid item xs={12}>
          <MDInput
            label="Request Body (JSON)"
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            multiline
            rows={8}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Workflow Verileri Accordion */}
      {availableVariables.length > 0 && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              🔗 Kullanılabilir Workflow Değişkenleri ({availableVariables.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {availableVariables.map((variable, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    onClick={() => insertVariable(variable)}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#1976d2" }}>
                      {`{{${variable.key}}}`}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#666" }}>
                      {variable.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* İpucu */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          backgroundColor: "#e8f5e8",
          borderRadius: 2,
          border: "1px solid #4caf50",
        }}
      >
        <Typography variant="body2" sx={{ color: "#2e7d32" }}>
          💡 <strong>İpucu:</strong> Workflow değişkenlerini kullanmak için yukarıdaki değişkenlere
          tıklayın. Şablonlar otomatik olarak JSON formatında hazırlanır.
        </Typography>
      </Box>

      {/* Kaydet Butonu */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <MDButton
          variant="gradient"
          color="error"
          onClick={handleSave}
          startIcon={<Icon>save</Icon>}
          sx={{ borderRadius: "20px", px: 4 }}
        >
          HTTP Ayarlarını Kaydet
        </MDButton>
      </Box>
    </Box>
  );
};

export default HttpPostTab;
