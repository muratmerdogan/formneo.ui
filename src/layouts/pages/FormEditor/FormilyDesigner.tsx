import React, { useMemo } from "react";

// Styles (LESS yerine derlenmiş CSS kullanıyoruz)
import "antd/dist/antd.css";
import "@designable/react/dist/designable.react.umd.production.css";
import "@designable/react-settings-form/dist/designable.settings-form.umd.production.css";

// Ant Design UI (üst bar için)
import { Space as AntSpace, Button as AntButton, Typography } from "antd";
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
import { transformToSchema } from "@designable/formily-transformer";
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";
import * as AntdFormily from "@formily/antd";

export default function FormilyDesigner(): JSX.Element {
  const engine = useMemo(
    () =>
      createDesigner({
        rootComponentName: "Form",
      }),
    []
  );
  // Localization: TR paketi olmadığı için en-US'e sabitle
  GlobalRegistry.setDesignerLanguage("en-US");

  const previewForm = useMemo(() => createForm(), []);
  const SchemaField = useMemo(() => createSchemaField({ components: AntdFormily as any }), []);

  const handleSave = () => {
    try {
      console.log("[FormNeo] Kaydet tıklandı", engine);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = () => {
    try {
      console.log("[FormNeo] Yayınla tıklandı", engine);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenVersions = () => {
    try {
      console.log("[FormNeo] Revizyonlar tıklandı", engine);
    } catch (e) {
      console.error(e);
    }
  };

  const renderPreview = (tree: any) => {
    if (!tree) return <div style={{ padding: 16 }}>No schema</div>;
    const result = transformToSchema(tree);
    return (
      <div style={{ padding: 16 }}>
        <FormProvider form={previewForm}>
          <AntdFormily.Form>
            <AntdFormily.FormLayout layout="horizontal" labelAlign="left" labelCol={6} wrapperCol={18} size="middle">
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
              <img src={formNeoLogo} alt="FormNeo" style={{ height: 28 }} />
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
                ]}
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
                      }}
                    />
                  )}
                </ViewPanelAny>
                <ViewPanelAny type="JSONTREE" scrollable={false}>
                  {(tree: any) => (
                    <pre style={{ margin: 0, height: "100%", overflow: "auto", background: "#0b1021", color: "#c6d0f5", padding: 16 }}>
                      {(() => {
                        try {
                          const result = transformToSchema(tree);
                          return JSON.stringify(result.schema || {}, null, 2);
                        } catch (e) {
                          return String(e);
                        }
                      })()}
                    </pre>
                  )}
                </ViewPanelAny>
                <ViewPanelAny type="PREVIEW">
                  {(tree: any) => renderPreview(tree)}
                </ViewPanelAny>
              </ViewportPanelAny>
            </WorkspacePanelAny>
          </WorkspaceAny>

          <SettingsPanelAny title="Özellikler">
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanelAny>
        </StudioPanelAny>
      </DesignerAny>
    </div>
  );
}


