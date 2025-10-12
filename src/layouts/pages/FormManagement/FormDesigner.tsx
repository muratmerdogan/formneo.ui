import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import { Button, Dialog, DialogContent, DialogTitle, Icon, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FormBuilder, Form, Formio } from "@formio/react";
import "formiojs/dist/formio.full.min.css";

import "./style/Builder.css";
import "./style/Builder.css";
import "./Custom"; // side-effects: custom DS components register themselves

export default function FormDesigner(): JSX.Element {
  const [schema, setSchema] = useState<any>({ display: "form", components: [] });
  const [tab, setTab] = useState<number>(0);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    // Ensure base/project URL set (matches existing app config)
    try {
      Formio.setBaseUrl("https://api.cfapps.us21.hana.ondemand.com/api");
      Formio.setProjectUrl("https://api.cfapps.us21.hana.ondemand.com/api");
    } catch {}
  }, []);

  const builderOptions = useMemo(() => ({
    builder: {
      basic: {
        title: "Temel",
        weight: 0,
        default: true,
        components: {
          textfield: true,
          textarea: true,
          number: true,
          password: true,
          email: true,
          select: true,
          checkbox: true,
          radio: true,
          button: true,
        },
      },
      layout: {
        title: "Yerleşim",
        weight: 10,
        default: true,
        components: {
          columns: true,
          fieldset: true,
          panel: true,
          table: true,
          tabs: true,
          content: true,
        },
      },
      data: {
        title: "Veri",
        weight: 20,
        default: true,
        components: {
          container: true,
          datagrid: true,
          editgrid: true,
        },
      },
      advanced: {
        title: "Gelişmiş",
        weight: 30,
        default: true,
        components: {
          file: true,
          signature: true,
        },
      },
      custom: { title: "FormneoDesign System", key: "dscomponents", weight: 50 },
    },
  }), []);

  const handleChange = (_e: React.SyntheticEvent, value: number) => setTab(value);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ px: 2, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            px: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#344767" }}>
            Form Tasarımcısı2
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" color="secondary" onClick={() => setPreviewOpen(true)}>
              <Icon sx={{ mr: 0.5 }}>visibility</Icon> Önizleme
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                // Şemayı indir
                const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `form-${Date.now()}.json`;
                link.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              <Icon sx={{ mr: 0.5 }}>save</Icon> Kaydet
            </Button>
          </Box>
        </Box>

        <Tabs value={tab} onChange={handleChange} sx={{ mb: 1 }}>
          <Tab label="Tasarım" />
          <Tab label="JSON" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ height: "calc(100vh - 220px)", bgcolor: "#fff", borderRadius: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", p: 1 }}>
            <Box sx={{ height: "100%", overflow: "hidden" }}>
              <FormBuilder form={schema} onChange={(s: any) => setSchema({ ...s })} />
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ bgcolor: "#0b0f19", color: "#e2e8f0", p: 2, borderRadius: 2, height: "calc(100vh - 220px)", overflow: "auto", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize: 13 }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(schema, null, 2)}</pre>
          </Box>
        )}
      </Box>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Önizleme</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Form form={schema} options={{ readOnly: false }} />
          </Box>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}


