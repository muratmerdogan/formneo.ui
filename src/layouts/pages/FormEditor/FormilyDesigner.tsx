import React, { useMemo } from "react";

// Styles (LESS yerine derlenmiş CSS kullanıyoruz)
import "antd/dist/antd.css";
import "@designable/react/dist/designable.react.umd.production.css";

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

export default function FormilyDesigner(): JSX.Element {
  const engine = useMemo(
    () =>
      createDesigner({
        rootComponentName: "Form",
      }),
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <DesignerAny engine={engine}>
        <StudioPanelAny>
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
                <ViewToolsWidgetAny use={["DESIGNABLE"]} />
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


