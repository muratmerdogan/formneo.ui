import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Button, Dialog, DialogContent, DialogTitle, Icon, IconButton, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Components, Formio, FormBuilder, Form } from "@formio/react";
import components from "../FormManagement/Custom";
import "formiojs/dist/formio.full.min.css";

export default function FormEditorV2(): JSX.Element {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<any>({ display: "form", components: [] });
  const [formName, setFormName] = useState<string>("Yeni Form");
  const [tab, setTab] = useState<number>(0);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Builder options - Sadece premium component'leri gizle
  const builderOptions = {
    builder: {
      premium: false,
      custom: {
        title: "FormNeo Design System",
        Key: "dscomponents",
        weight: 0,
        components: {
          dsinput: {
            title: "DS Input",
            key: "dsinput",
            icon: "terminal",
            schema: {
              label: "dsinput",
              type: "dsinput",
              key: "dsinput",
            },
          },
          dstextarea: {
            title: "DS Textarea",
            key: "dstextarea",
            icon: "align-left",
            schema: {
              label: "dstextarea",
              type: "dstextarea",
              key: "dstextarea",
            },
          },
          dsbutton: {
            title: "DS Button",
            key: "dsbutton",
            icon: "stop",
            schema: {
              label: "dsbutton",
              type: "dsbutton",
              key: "dsbutton",
            },
          },
          dsselect: {
            title: "DS Select",
            key: "dsselect",
            icon: "list",
            schema: {
              label: "dsselect",
              type: "dsselect",
              key: "dsselect",
            },
          },
          dscheckbox: {
            title: "DS Checkbox",
            key: "dscheckbox",
            icon: "check-square",
            schema: {
              label: "dscheckbox",
              type: "dscheckbox",
              key: "dscheckbox",
            },
          },
          dsradio: {
            title: "DS Radio",
            key: "dsradio",
            icon: "dot-circle-o",
            schema: {
              label: "dsradio",
              type: "dsradio",
              key: "dsradio",
            },
          },
          dsnumber: {
            title: "DS Number",
            key: "dsnumber",
            icon: "hashtag",
            schema: {
              label: "dsnumber",
              type: "dsnumber",
              key: "dsnumber",
            },
          },
          dsemail: {
            title: "DS Email",
            key: "dsemail",
            icon: "envelope",
            schema: {
              label: "dsemail",
              type: "dsemail",
              key: "dsemail",
            },
          },
          dsphone: {
            title: "DS Phone",
            key: "dsphone",
            icon: "phone",
            schema: {
              label: "dsphone",
              type: "dsphone",
              key: "dsphone",
            },
          },
          dspassword: {
            title: "DS Password",
            key: "dspassword",
            icon: "lock",
            schema: {
              label: "dspassword",
              type: "dspassword",
              key: "dspassword",
            },
          },
          dsdatetime: {
            title: "DS Datetime",
            key: "dsdatetime",
            icon: "calendar",
            schema: {
              label: "dsdatetime",
              type: "dsdatetime",
              key: "dsdatetime",
            },
          },
          dstable: {
            title: "DS Table",
            key: "dstable",
            icon: "table",
            schema: {
              label: "dstable",
              type: "dstable",
              key: "dstable",
            },
          }
        }
      }
    }
  };

  useEffect(() => {
    // Custom components'leri kaydet
    Components.setComponents(components);

    // Base URL ayarla
    Formio.setBaseUrl("https://api.cfapps.us21.hana.ondemand.com/api");
    Formio.setProjectUrl("https://api.cfapps.us21.hana.ondemand.com/api");
  }, []);

  const handleTabChange = (_e: React.SyntheticEvent, value: number) => setTab(value);

  const onFormChange = (updatedSchema: any) => {
    setSchema({ ...updatedSchema, components: [...updatedSchema.components] });
  };

  const saveForm = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formName.replace(/\s+/g, "-")}-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const loadForm = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string);
          setSchema(json);
          if (json.title) setFormName(json.title);
        } catch {
          alert("Geçersiz JSON dosyası");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearForm = () => {
    if (window.confirm("Tüm değişiklikler silinecek, emin misiniz?")) {
      setSchema({ display: "form", components: [] });
      setFormName("Yeni Form");
    }
  };

  return (
    <Box sx={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden",
      bgcolor: "#fafbfc"
    }}>
      {/* Top Toolbar - Full Width */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Geri Dön">
            <IconButton onClick={() => navigate('/forms')} sx={{ color: "#fff" }}>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
            <Icon sx={{ fontSize: 28 }}>edit_note</Icon>
            Form Tasarımcısı
          </Typography>
          <TextField
            size="small"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Form adı girin..."
            sx={{ 
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "8px",
                height: 40,
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#fff" }
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                "&::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 }
              }
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
            variant="contained" 
            onClick={() => setPreviewOpen(true)}
            sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.3)" } }}
          >
            <Icon sx={{ mr: 0.5 }}>visibility</Icon>Önizle
          </Button>
          <Button 
            variant="contained" 
            onClick={saveForm}
            sx={{ background: "#10b981", color: "#fff", fontWeight: 600, "&:hover": { background: "#059669" } }}
          >
            <Icon sx={{ mr: 0.5 }}>save</Icon>Kaydet
          </Button>
          <Button 
            variant="outlined" 
            onClick={loadForm}
            sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.1)" } }}
          >
            <Icon sx={{ mr: 0.5 }}>upload</Icon>Yükle
          </Button>
          <Button 
            variant="outlined" 
            onClick={clearForm}
            sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", "&:hover": { borderColor: "#ff6b6b", background: "rgba(255,107,107,0.2)" } }}
          >
            <Icon sx={{ mr: 0.5 }}>delete_sweep</Icon>Temizle
          </Button>
        </Box>
      </Box>

      {/* Main Content - Full Height */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Tabs - Compact */}
        <Box sx={{ 
          px: 2, 
          pt: 1.5,
          bgcolor: "#fff",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            sx={{ 
              minHeight: 44,
              "& .MuiTab-root": {
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "none",
                minHeight: 44,
                color: "#64748b",
                px: 2
              },
              "& .Mui-selected": { color: "#667eea !important" },
              "& .MuiTabs-indicator": {
                backgroundColor: "#667eea",
                height: 3,
                borderRadius: "3px 3px 0 0"
              }
            }}
          >
            <Tab icon={<Icon fontSize="small">edit_note</Icon>} iconPosition="start" label="Form Tasarımı" />
            <Tab icon={<Icon fontSize="small">code</Icon>} iconPosition="start" label="JSON Görünümü" />
          </Tabs>
        </Box>

        {/* Tab 0: Form Builder - FULL HEIGHT */}
        {tab === 0 && (
          <Box sx={{ flex: 1, overflow: "hidden", bgcolor: "#fafbfc" }}>
            <Box 
              className="formio-builder-wrapper formio-builder-fullscreen"
              sx={{ 
                height: "100%",
                width: "100%",
                display: "flex"
              }}
            >
              <FormBuilder options={builderOptions} form={schema} onChange={onFormChange} />
            </Box>
          </Box>
        )}

        {/* Tab 1: JSON View - FULL HEIGHT */}
        {tab === 1 && (
          <Box sx={{ flex: 1, overflow: "hidden", p: 2, bgcolor: "#fafbfc" }}>
            <Box 
              sx={{ 
                height: "100%",
                bgcolor: "#1e293b", 
                color: "#e2e8f0", 
                p: 3, 
                borderRadius: 2, 
                overflow: "auto", 
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace", 
                fontSize: 13,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid #334155"
              }}
            >
              <pre style={{ 
                margin: 0, 
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                color: "#94a3b8"
              }}>
                {JSON.stringify(schema, null, 2)}
              </pre>
            </Box>
          </Box>
        )}
      </Box>

      {/* Bottom Status Bar - Floating */}
      <Box sx={{ 
        position: "fixed",
        bottom: 12,
        right: 12,
        display: "flex", 
        alignItems: "center",
        gap: 2,
        px: 2.5,
        py: 1.5,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        border: "1px solid rgba(102, 126, 234, 0.2)",
        zIndex: 999
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon sx={{ color: "#667eea", fontSize: 18 }}>widgets</Icon>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
            <strong style={{ color: "#667eea" }}>{schema.components?.length || 0}</strong> bileşen
          </Typography>
        </Box>
        <Box sx={{ width: 1, height: 20, bgcolor: "#e5e7eb" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon sx={{ color: "#64748b", fontSize: 18 }}>schedule</Icon>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
            {new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }
        }}
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          py: 2
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Icon sx={{ fontSize: 28 }}>preview</Icon>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Form Önizlemesi: {formName}
              </Typography>
            </Box>
            <Icon 
              onClick={() => setPreviewOpen(false)} 
              sx={{ 
                cursor: "pointer",
                "&:hover": {
                  transform: "rotate(90deg)",
                  transition: "transform 0.3s ease"
                }
              }}
            >
              close
            </Icon>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
          <Box 
            sx={{ 
              p: 3,
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              minHeight: 300
            }}
          >
            <Form 
              form={schema} 
              onSubmit={(submission: any) => {
                console.log("Form submission:", submission);
                alert("✅ Form başarıyla gönderildi! Konsolu kontrol edin.");
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

