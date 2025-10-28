import React, { useEffect, useMemo, useState } from "react";

// Styles (LESS yerine derlenmiş CSS kullanıyoruz)
import "antd/dist/antd.css";
import "@designable/react/dist/designable.react.umd.production.css";
import "@designable/react-settings-form/dist/designable.settings-form.umd.production.css";

// Ant Design UI (üst bar için)
import { Space as AntSpace, Button as AntButton, Typography, Input as AntdInput, Form as AntdForm, message, Tag, Drawer, List } from "antd";
import { SaveOutlined, RocketOutlined, HistoryOutlined, EyeOutlined, CodeOutlined } from "@ant-design/icons";
import formNeoLogo from "assets/images/logoson.svg";

// Designable React bileşenleri
import {
  Designer,
  StudioPanel,
  CompositePanel,
  Workspace,
  WorkspacePanel,
  ViewportPanel,
  ToolbarPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
  DesignerToolsWidget,
  ViewToolsWidget,
  ResourceWidget,
} from "@designable/react";

// TS tür uyumsuzluklarını izole etmek için "any" sarmalayıcılar
const DesignerAny = Designer as any;
const StudioPanelAny = StudioPanel as any;
const CompositePanelAny = CompositePanel as any;
const WorkspaceAny = Workspace as any;
const WorkspacePanelAny = WorkspacePanel as any;
const ViewportPanelAny = ViewportPanel as any;
const ToolbarPanelAny = ToolbarPanel as any;
const ViewPanelAny = ViewPanel as any;
const SettingsPanelAny = SettingsPanel as any;
const ComponentTreeWidgetAny = ComponentTreeWidget as any;
const DesignerToolsWidgetAny = DesignerToolsWidget as any;
const ViewToolsWidgetAny = ViewToolsWidget as any;
const ResourceWidgetAny = ResourceWidget as any;

// Designable çekirdek
import { createDesigner } from "@designable/core";
import { GlobalRegistry } from "@designable/core";

// Ayar formu
import { SettingsForm } from "@designable/react-settings-form";

// Formily-antd kaynakları
import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormGrid,
  FormLayout,
} from "@designable/formily-antd";
import { transformToSchema, transformToTreeNode } from "@designable/formily-transformer";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import * as AntdFormily from "@formily/antd";
import { AllLocales as FormilyAntdLocales } from "@designable/formily-antd/esm/locales";
import { useParams, useNavigate } from "react-router-dom";
import { FormDataApi } from "api/generated";
import getConfiguration from "confiuration";
import FormNeoButton from "./custom/FormNeoButton";
import ApproveButtons from "./custom/ApproveButtons";
import { createResource } from "@designable/core";
import { Editor } from "@monaco-editor/react";

export default function FormilyDesigner(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isBusy, setIsBusy] = useState(false);
  const [formName, setFormName] = useState<string>("New Form");
  const [publicationStatus, setPublicationStatus] = useState<number>(1);
  const [revision, setRevision] = useState<number | undefined>(undefined);
  const [parentFormId, setParentFormId] = useState<string | undefined>(undefined);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  // Dil ve locale kayıtlarını motor yaratılmadan ÖNCE yap
  GlobalRegistry.setDesignerLanguage("en-US");
  try {
    GlobalRegistry.registerDesignerLocales(FormilyAntdLocales as any);
  } catch {}
  // Custom bileşen davranışlarını kaydet
  try {
    GlobalRegistry.registerDesignerBehaviors(FormNeoButton as any, ApproveButtons as any);
  } catch {}

  const engine = useMemo(
    () =>
      createDesigner({
        rootComponentName: "Form",
      }),
    []
  );
  // Localization: TR paketi olmadığı için en-US'e sabitle (güvence)
  GlobalRegistry.setDesignerLanguage("en-US");

  // Gözükmeyen/Çince kalan başlıklar için açık EN override
  GlobalRegistry.registerDesignerLocales({
    RadioGroup: {
      'en-US': { title: 'Radio' },
    },
    Input: {
      'en-US': { title: 'Input' },
    },
    Password: {
      'en-US': { title: 'Password' },
    },
    Checkbox: {
      'en-US': { title: 'Checkbox' },
    },
    Select: {
      'en-US': { title: 'Select' },
    },
  } as any);

  const previewForm = useMemo(() => createForm(), []);
  const SchemaField = useMemo(
    () => createSchemaField({ components: { ...(AntdFormily as any), FormItem: (AntdFormily as any).FormItem, FormNeoButton, ApproveButtons } }),
    []
  );

  // Load form by id
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsBusy(true);
        const conf = getConfiguration();
        const api = new FormDataApi(conf);
        const res = await api.apiFormDataIdGet(id);
        const data = res?.data as any;
        if (!data) return;
        setFormName(data.formName || "New Form");
        if ((data as any).parentFormId) setParentFormId((data as any).parentFormId);
        if (typeof data.publicationStatus === "number") setPublicationStatus(data.publicationStatus);
        if (typeof data.revision === "number") setRevision(data.revision);
        const design = data.formDesign ? JSON.parse(data.formDesign) : null;
        if (design && design.schema) {
          const root = transformToTreeNode(design);
          const workspace = engine.workbench?.activeWorkspace;
          const operation = workspace?.operation;
          if (operation && root) {
            // Ağacı temizle ve yeni ağacı yükle
            operation.tree.from(root as any);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };
    load();
  }, [id]);

  const handleSave = () => {
    try {
      if (!formName || !formName.trim()) {
        message.warning("Form name is required");
        return;
      }
      const workspace = engine.workbench?.activeWorkspace;
      const tree = workspace?.operation?.tree;
      const result = tree ? transformToSchema(tree) : { schema: {} };
      const payload = {
        formName,
        formDescription: "",
        formDesign: JSON.stringify(result),
        javaScriptCode: "",
        isActive: 1 as any,
        canEdit: true,
        publicationStatus: 1 as any,
        showInMenu: false,
      } as any;
      setIsBusy(true);
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      const task = id
        ? api.apiFormDataPut({ id, concurrencyToken: 0, ...payload })
        : api.apiFormDataPost(payload);
      task
        .then((res: any) => {
          message.success("Form saved successfully");
          const newId = res?.data?.id;
          if (!id && newId) {
            navigate(`/forms/designer/${newId}`);
          }
        })
        .catch(() => message.error("Failed to save form"))
        .finally(() => setIsBusy(false));
    } catch (e) {
      console.error(e);
      message.error("Unexpected error while saving");
    }
  };

  const handlePublish = () => {
    try {
      if (!id) return;
      setIsBusy(true);
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      api.apiFormDataPublishIdPost(id)
        .then(async () => {
          message.success("Form published");
          setPublicationStatus(2);
          await openRevisions(true);
        })
        .catch(() => message.error("Failed to publish"))
        .finally(() => setIsBusy(false));
    } catch (e) {
      console.error(e);
      message.error("Unexpected error while publishing");
    }
  };

  const openRevisions = async (silent?: boolean) => {
    try {
      if (!id) {
        message.warning("Save first");
        return;
      }
      setIsBusy(true);
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      const parent = parentFormId || id;
      const res = await api.apiFormDataVersionsParentIdGet(parent);
      const list = (res?.data || []) as any[];
      setVersions(list);
      if (!silent) setVersionsOpen(true);
    } catch (e) {
      console.error(e);
      message.error("Failed to load versions");
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenVersions = () => {
    openRevisions(false);
  };

  const handleCreateRevision = async () => {
    try {
      if (!id) {
        message.warning("Save as draft first");
        return;
      }
      setIsBusy(true);
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      await api.apiFormDataCreateRevisionIdPost(id);
      const parent = parentFormId || id;
      const resList = await api.apiFormDataVersionsParentIdGet(parent);
      const list = (resList?.data || []) as any[];
      const drafts = list.filter((x: any) => x.publicationStatus === 1);
      const latestDraft = drafts.sort((a: any, b: any) => (b.revision || 0) - (a.revision || 0))[0];
      if (latestDraft?.id) {
        message.success(`Revision #${latestDraft.revision} created`);
        navigate(`/forms/designer/${latestDraft.id}`);
      } else {
        message.success("Revision created");
        await openRevisions(true);
      }
    } catch (e) {
      console.error(e);
      message.error("Failed to create revision");
    } finally {
      setIsBusy(false);
    }
  };

  const renderPreview = (tree: any) => {
    if (!tree) return <div style={{ padding: 16 }}>No schema</div>;
    const result = transformToSchema(tree);
    return (
      <div style={{ padding: 16 }}>
        <FormProvider form={previewForm}>
          <AntdFormily.Form>
            <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="default">
              <SchemaField schema={result.schema || {}} />
            </AntdFormily.FormLayout>
          </AntdFormily.Form>
        </FormProvider>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <DesignerAny engine={engine}>
        <StudioPanelAny
          logo={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={formNeoLogo} alt="FormNeo" style={{ height: 40, width: "auto", display: "block" }} />
              <Typography.Text strong>FormNeo Designer</Typography.Text>
            </div>
          }
          actions={
            <AntSpace size="small">
              <AntButton type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave}>
                Kaydet
              </AntButton>
              <AntButton size="small" icon={<RocketOutlined />} onClick={handlePublish}>
                Yayınla
              </AntButton>
              <AntButton size="small" icon={<HistoryOutlined />} onClick={handleOpenVersions}>
                Revizyonlar
              </AntButton>
              <AntButton size="small" onClick={handleCreateRevision}>Revizyon Oluştur</AntButton>
              <AntButton size="small" icon={<EyeOutlined />} onClick={() => {}}>
                Preview
              </AntButton>
              <AntButton size="small" icon={<CodeOutlined />} onClick={() => {}}>
                JSON
              </AntButton>
            </AntSpace>
          }
        >
          <CompositePanelAny>
            <CompositePanelAny.Item title="Bileşenler" icon="Component">
              <ResourceWidgetAny
                title="Girdiler"
                sources={[
                  Input,
                  Password,
                  NumberPicker,
                  Rate,
                  Slider,
                  Select,
                  TreeSelect,
                  Cascader,
                  Transfer,
                  Checkbox,
                  Radio,
                  DatePicker,
                  TimePicker,
                  Upload,
                  Switch,
                      FormNeoButton,
                      ApproveButtons,
                ]}
              />
              <ResourceWidgetAny
                title="FormNeo"
                sources={createResource(...(FormNeoButton as any).Resource, ...(ApproveButtons as any).Resource)}
              />
              <ResourceWidgetAny
                title="Yerleşimler"
                sources={[Card, FormGrid, FormTab, FormLayout, FormCollapse, Space]}
              />
              <ResourceWidgetAny title="Diziler" sources={[ArrayCards, ArrayTable]} />
              <ResourceWidgetAny title="Görüntüleme" sources={[Text]} />
            </CompositePanelAny.Item>
          </CompositePanelAny>

          <WorkspaceAny id="form">
            <WorkspacePanelAny>
              <ToolbarPanelAny>
                <DesignerToolsWidgetAny />
                <ViewToolsWidgetAny use={["DESIGNABLE", "JSONTREE", "PREVIEW"]} />
              </ToolbarPanelAny>
              <ViewportPanelAny style={{ height: "100%" }}>
                <ViewPanelAny type="DESIGNABLE">
                  {() => (
                    <ComponentTreeWidgetAny
                      components={{
                        Form,
                        Field,
                        Input,
                        Select,
                        TreeSelect,
                        Cascader,
                        Radio,
                        Checkbox,
                        Slider,
                        Rate,
                        NumberPicker,
                        Transfer,
                        Password,
                        DatePicker,
                        TimePicker,
                        Upload,
                        Switch,
                        Text,
                        Card,
                        ArrayCards,
                        ArrayTable,
                        Space,
                        FormTab,
                        FormCollapse,
                        FormGrid,
                        FormLayout,
                        FormNeoButton,
                        ApproveButtons,
                      }}
                    />
                  )}
                </ViewPanelAny>
                <ViewPanelAny type="JSONTREE" scrollable={false}>
                  {(tree: any) => {
                    const jsonString = (() => {
                      try {
                        const result = transformToSchema(tree);
                        return JSON.stringify(result.schema || {}, null, 2);
                      } catch {
                        return "{}";
                      }
                    })();
                    return (
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={jsonString}
                        onChange={(val) => {
                          try {
                            if (!val) return;
                            const parsed = JSON.parse(val);
                            const root = transformToTreeNode({ schema: parsed });
                            const workspace = engine.workbench?.activeWorkspace;
                            const operation = workspace?.operation;
                            if (operation && root) operation.tree.from(root as any);
                          } catch {
                            // invalid JSON: ignore live update
                          }
                        }}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    );
                  }}
                </ViewPanelAny>
                <ViewPanelAny type="PREVIEW">
                  {(tree: any) => renderPreview(tree)}
                </ViewPanelAny>
              </ViewportPanelAny>
            </WorkspacePanelAny>
          </WorkspaceAny>

          <SettingsPanelAny title="Özellikler">
            <div style={{ padding: 12, borderBottom: "1px solid #f0f0f0", marginBottom: 8 }}>
              <AntdForm layout="vertical" size="small">
                <AntdForm.Item label="Form Name" required>
                  <AntdInput
                    placeholder="Enter form name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={!!id}
                  />
                </AntdForm.Item>
                {!!id && (
                  <Typography.Text type="secondary">
                    Form name is fixed for existing/revision forms.
                  </Typography.Text>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Typography.Text type="secondary">Status:</Typography.Text>
                  {publicationStatus === 2 ? (
                    <Tag color="green">Published</Tag>
                  ) : publicationStatus === 3 ? (
                    <Tag>Archived</Tag>
                  ) : (
                    <Tag color="default">Draft</Tag>
                  )}
                  {typeof revision === 'number' && (
                    <Tag color="blue">Rev #{revision}</Tag>
                  )}
                </div>
              </AntdForm>
            </div>
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanelAny>
          <Drawer open={versionsOpen} onClose={() => setVersionsOpen(false)} width={360}>
            <div style={{ padding: 16 }}>
              <Typography.Title level={5}>Revisions</Typography.Title>
              <List
                dataSource={versions}
                renderItem={(v: any, idx) => (
                  <List.Item style={{ cursor: 'pointer' }} onClick={() => navigate(`/forms/designer/${v.id}`)}>
                    <List.Item.Meta
                      title={`Rev #${v.revision ?? idx + 1} ${v.publicationStatus === 2 ? '(Published)' : '(Draft)'}`}
                      description={v.updatedDate || v.createdDate}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Drawer>
        </StudioPanelAny>
      </DesignerAny>
    </div>
  );
}


