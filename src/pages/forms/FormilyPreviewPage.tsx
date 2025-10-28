import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormDataApi } from "api/generated";
import getConfiguration from "confiuration";

// Antd + Formily render
import "antd/dist/antd.css";
import { Spin, Alert } from "antd";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import * as AntdFormily from "@formily/antd";

// FormNeo layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Typography } from "@mui/material";

export default function FormilyPreviewPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<any>(null);

  const form = useMemo(() => createForm(), []);
  const SchemaField = useMemo(() => createSchemaField({ components: AntdFormily as any }), []);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const conf = getConfiguration();
        const api = new FormDataApi(conf);
        const res = await api.apiFormDataIdGet(id);
        const data = res?.data as any;
        const designStr = data?.formDesign;
        let parsed: any = null;
        try { parsed = designStr ? JSON.parse(designStr) : null; } catch {}
        // If not a Formily design, fallback to old viewer route
        if (!parsed || !parsed.schema) {
          navigate(`/forms/view/${id}`, { replace: true });
          return;
        }
        setSchema(parsed.schema);
      } catch (e: any) {
        setError(e?.message || "Unable to load form");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={2} py={2}>
        <MDBox mb={2}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: "#344767" }}>
            Form Önizleme
          </Typography>
        </MDBox>
        {loading && (
          <MDBox p={2}><Spin /></MDBox>
        )}
        {!loading && error && (
          <MDBox p={2}><Alert type="error" message={error} /></MDBox>
        )}
        {!loading && !error && schema && (
          <MDBox p={2} sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <FormProvider form={form}>
              <AntdFormily.Form>
                <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="default">
                  <SchemaField schema={schema} />
                </AntdFormily.FormLayout>
              </AntdFormily.Form>
            </FormProvider>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}


