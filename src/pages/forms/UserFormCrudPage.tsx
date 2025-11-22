import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FormDataApi } from "api/generated";
import getConfiguration from "confiuration";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Formily render (geçici – CRUD sayfası için temel önizleme)
import "antd/dist/antd.css";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import * as AntdFormily from "@formily/antd";
import { Button as AntButton, message } from "antd";
import * as Icons from "@ant-design/icons";

interface FormButton {
  id: string;
  label: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  icon?: string;
  action?: string;
}

export default function UserFormCrudPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<any>(null);
  const [formName, setFormName] = useState<string>("");
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<Record<string, boolean>>({});
  const [formButtons, setFormButtons] = useState<FormButton[]>([]);

  const form = useMemo(() => createForm(), []);
  const SchemaField = useMemo(() => createSchemaField({ components: AntdFormily as any }), []);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const api = new FormDataApi(getConfiguration());
        const res = await api.apiFormDataIdGet(id);
        const data = res?.data as any;
        setFormName(String(data?.formName || ""));
        const str = data?.formDesign;
        if (str) {
          try {
            const parsed = JSON.parse(str);
            setSchema(parsed?.schema || null);
            // Button paneli bilgilerini yükle
            if (parsed.buttonPanel && parsed.buttonPanel.buttons) {
              setFormButtons(parsed.buttonPanel.buttons);
            }
            // x-crud meta bilgisine göre kolon çıkarımı (varsayılan görünür)
            const props = parsed?.schema?.properties || {};
            const visibility: Record<string, boolean> = {};
            const cols: GridColDef[] = Object.keys(props).map((key) => {
              const def = props[key] || {};
              const crud = def["x-crud"] || {};
              const listCfg = crud.list || {};
              const visible = listCfg.visible !== false;
              const header = listCfg.title || def.title || key;
              const width = listCfg.width ? Number(listCfg.width) : undefined;
              const order = listCfg.order != null ? Number(listCfg.order) : 9999;
              const align = listCfg.align || "left";
              const sortable = listCfg.sortable !== false;
              visibility[key] = !!visible;
              const col: GridColDef = {
                field: key,
                headerName: String(header),
                flex: width ? undefined : 1,
                width: width,
                align: ["left", "center", "right"].includes(String(align)) ? (align as any) : "left",
                sortable,
              };
              // Geçici sırayı DataGrid kullanmadığı için biz sıralayacağız
              (col as any).__order = order;
              return col;
            });
            const sorted = cols.sort((a: any, b: any) => (a.__order ?? 9999) - (b.__order ?? 9999));
            setColumns([{ field: "id", headerName: "ID", width: 240 }, ...sorted]);
            setColumnVisibilityModel({ id: true, ...visibility });
          } catch {
            setSchema(null);
          }
        } else {
          setSchema(null);
        }
        // TODO: Kayıtları gerçek API'den doldur
        setRows([]);
      } catch (e: any) {
        setError(e?.message || "Form yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={2} py={2}>
        <MDBox mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography variant="h5" fontWeight="bold" color="text">
            {formName || "Form"} – CRUD
          </MDTypography>
          <MDBox display="flex" gap={1}>
            {mode === "list" ? (
              <>
                <Button variant="contained" onClick={() => setMode("edit")} disableElevation>New</Button>
                <Button variant="outlined" disabled={!selection}>Edit</Button>
                <Button variant="outlined" color="error" disabled={!selection}>Delete</Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={() => setMode("list")}>Back to List</Button>
                <Button variant="contained" disableElevation disabled>Save</Button>
              </>
            )}
          </MDBox>
        </MDBox>

        {loading && (<MDTypography variant="button" color="text">Yükleniyor…</MDTypography>)}
        {!loading && error && (<MDTypography variant="button" color="error">{error}</MDTypography>)}

        {!loading && !error && mode === "list" && (
          <MDBox p={2} sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: formButtons.length > 0 ? "80px" : "0" }}>
            <div style={{ height: 520, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(r) => r.id || r._id || Math.random().toString(36).slice(2)}
                onRowSelectionModelChange={(sel) => setSelection(String((sel as any)[0] || ""))}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(m) => setColumnVisibilityModel(m as any)}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </div>
          </MDBox>
        )}

        {!loading && !error && mode === "edit" && (
          <MDBox p={2} sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: formButtons.length > 0 ? "80px" : "0" }}>
            <Grid container>
              <Grid item xs={12}>
                {schema ? (
                  <FormProvider form={form}>
                    <AntdFormily.Form>
                      <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="default">
                        <SchemaField schema={schema} />
                      </AntdFormily.FormLayout>
                    </AntdFormily.Form>
                  </FormProvider>
                ) : (
                  <MDTypography variant="button" color="text">Bu form için Formily şeması bulunamadı.</MDTypography>
                )}
              </Grid>
            </Grid>
          </MDBox>
        )}

        {/* Button Paneli - En Alta Sabitlenmiş */}
        {formButtons.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #d9d9d9",
              padding: "12px 24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              zIndex: 1000,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {formButtons.map((btn) => {
              const IconComponent = btn.icon ? (Icons as any)[`${btn.icon}Outlined`] || (Icons as any)[btn.icon] : null;
              return (
                <AntButton
                  key={btn.id}
                  type={btn.type || "default"}
                  icon={IconComponent ? React.createElement(IconComponent) : undefined}
                  onClick={() => {
                    message.info(`Buton tıklandı: ${btn.label}${btn.action ? ` (Action: ${btn.action})` : ""}`);
                  }}
                >
                  {btn.label}
                </AntButton>
              );
            })}
          </div>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}


