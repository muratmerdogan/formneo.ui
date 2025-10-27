import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Button, Dialog, DialogContent, DialogTitle, Drawer, Icon, IconButton, List, ListItem, ListItemText, Tab, Tabs, TextField, Tooltip, Typography, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Components, Formio, FormBuilder, Form } from "@formio/react";
import components from "../FormManagement/Custom";
import { Editor } from "@monaco-editor/react";
import { FormDataApi } from "../../../api/generated";
import getConfiguration from "../../../confiuration";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useAlert } from "../hooks/useAlert";
import { useBusy } from "../hooks/useBusy";
import "formiojs/dist/formio.full.min.css";

// Form schema'ya göre dinamik JavaScript template oluştur
function generateJavaScriptTemplate(schema: any): string {
  const components = schema.components || [];
  
  // Form'daki alanları bul
  const fields = components
    .filter((c: any) => c.key && !['button'].includes(c.type))
    .map((c: any) => ({ key: c.key, label: c.label || c.key, type: c.type }));

  const buttons = components
    .filter((c: any) => c.key && ['button', 'dsbutton'].includes(c.type))
    .map((c: any) => ({ key: c.key, label: c.label || c.key }));

  const hasNumericFields = fields.some((f: any) => 
    ['number', 'dsnumber', 'currency'].includes(f.type)
  );

  let template = `/**
 * FormNeo JavaScript Editor
 * 
 * 🎯 Kodlarınızı Component'lere Bağlama:
 * 
 * 1. BUTTON ACTIONS:
 *    - Button component'ini seçin
 *    - "Action" → "Custom"
 *    - "Custom Action" → "onClick_buttonKey()"
 * 
 * 2. CALCULATED VALUES:
 *    - Field'i seçin → "Data" tab
 *    - "Calculated Value" → "calculate_fieldKey()"
 * 
 * 3. CUSTOM VALIDATION:
 *    - Field'i seçin → "Validation" tab
 *    - "Custom Validation" → "validate_fieldKey()"
 * 
 * 4. CONDITIONAL (Göster/Gizle):
 *    - Field'i seçin → "Conditional" tab
 *    - "Custom Conditional" → "shouldShow_fieldKey()"
 */

`;

  // Button event handlers
  if (buttons.length > 0) {
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    template += `// 🎯 BUTTON EVENT HANDLERS\n`;
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    buttons.forEach((btn: any) => {
      template += `// ${btn.label} button'u için:\n`;
      template += `// 1. Button'u seçin\n`;
      template += `// 2. Action → Custom\n`;
      template += `// 3. Custom Action → "onClick_${btn.key}()"\n`;
      template += `function onClick_${btn.key}() {\n`;
      template += `  console.log('${btn.label} clicked!');\n`;
      template += `  console.log('Form Data:', data);\n`;
      template += `  \n`;
      template += `  // Örnek: Form submit\n`;
      template += `  // instance.submit();\n`;
      template += `  \n`;
      template += `  // Örnek: Validasyon\n`;
      template += `  // if (!data.email) {\n`;
      template += `  //   alert('Email zorunlu!');\n`;
      template += `  //   return false;\n`;
      template += `  // }\n`;
      template += `}\n\n`;
    });
  }

  // Calculated values
  if (hasNumericFields) {
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    template += `// 📊 CALCULATED VALUES (Otomatik Hesaplama)\n`;
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    const numFields = fields.filter((f: any) => 
      ['number', 'dsnumber', 'currency'].includes(f.type)
    ).slice(0, 2);
    
    if (numFields.length >= 2) {
      template += `// Toplam alanı için:\n`;
      template += `// 1. Total field'i seçin\n`;
      template += `// 2. Data tab → Calculated Value\n`;
      template += `// 3. "calculate_total()"\n`;
      template += `function calculate_total() {\n`;
      template += `  return (data.${numFields[0].key} || 0) * (data.${numFields[1].key} || 0);\n`;
      template += `}\n\n`;
    }
  }

  // Validation
  if (fields.length > 0) {
    const firstField = fields[0];
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    template += `// ✅ CUSTOM VALIDATION (Özel Doğrulama)\n`;
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    template += `// ${firstField.label} için:\n`;
    template += `// 1. Field'i seçin\n`;
    template += `// 2. Validation tab → Custom Validation\n`;
    template += `// 3. "validate_${firstField.key}()"\n`;
    template += `function validate_${firstField.key}() {\n`;
    template += `  if (!data.${firstField.key}) {\n`;
    template += `    return 'Bu alan zorunludur';\n`;
    template += `  }\n`;
    template += `  return true; // veya error mesajı\n`;
    template += `}\n\n`;
  }

  // Conditional logic
  if (fields.length > 1) {
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    template += `// 🔍 CONDITIONAL LOGIC (Göster/Gizle)\n`;
    template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    template += `// Bir field'i göster/gizle:\n`;
    template += `// 1. Field'i seçin\n`;
    template += `// 2. Conditional tab → Custom Conditional\n`;
    template += `// 3. "shouldShow_fieldKey()"\n`;
    template += `function shouldShow_${fields[1].key}() {\n`;
    template += `  // Örnek: ${fields[0].key} doluysa göster\n`;
    template += `  return !!data.${fields[0].key};\n`;
    template += `}\n\n`;
  }

  // API Call
  template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  template += `// 🌐 API CALLS (Backend İletişim)\n`;
  template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  template += `async function fetchDataFromAPI() {\n`;
  template += `  try {\n`;
  template += `    const response = await fetch('/api/your-endpoint');\n`;
  template += `    const result = await response.json();\n`;
  if (fields.length > 0) {
    template += `    \n`;
    template += `    // Form'u doldur\n`;
    template += `    data.${fields[0].key} = result.value;\n`;
  }
  template += `    \n`;
  template += `    return result;\n`;
  template += `  } catch (error) {\n`;
  template += `    console.error('API Error:', error);\n`;
  template += `    alert('Veri yüklenemedi!');\n`;
  template += `  }\n`;
  template += `}\n\n`;

  template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  template += `// 💡 Kendi kodunuzu buraya ekleyin\n`;
  template += `// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  return template;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// JavaScript kodundan fonksiyon isimlerini çıkar
function extractFunctionNames(code: string): string[] {
  const functionRegex = /function\s+(\w+)\s*\(/g;
  const names: string[] = [];
  let match;
  
  while ((match = functionRegex.exec(code)) !== null) {
    names.push(match[1]);
  }
  
  return names;
}

export default function FormEditorV2(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  
  const [schema, setSchema] = useState<any>({ display: "form", components: [] });
  const [formName, setFormName] = useState<string>("Yeni Form");
  const [formDescription, setFormDescription] = useState<string>("");
  const [tab, setTab] = useState<number>(0);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [jsCode, setJsCode] = useState<string>(generateJavaScriptTemplate({ components: [] }));
  const editorRef = useRef<any>(null);
  const [jsCodeInitialized, setJsCodeInitialized] = useState<boolean>(false);
  const [publicationStatus, setPublicationStatus] = useState<number>(1); // 1: Draft, 2: Published
  const [revision, setRevision] = useState<number | undefined>(undefined);
  const [parentFormId, setParentFormId] = useState<string | undefined>(undefined);
  const [versionsOpen, setVersionsOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [formType, setFormType] = useState<number>(1);
  const [formCategory, setFormCategory] = useState<number>(1);
  const [formPriority, setFormPriority] = useState<number>(1);

  // Builder options - Sadece premium component'leri gizle
  const builderOptions = {
    builder: {
      premium: false,
      custom: {
        title: "FormNeo Components",
        Key: "dscomponents",
        weight: 0,
        components: {
          dsinput: {
            title: "Input",
            key: "dsinput",
            icon: "terminal",
            schema: {
              label: "Input",
              type: "dsinput",
              key: "dsinput",
            },
          },
          dstextarea: {
            title: "Textarea",
            key: "dstextarea",
            icon: "align-left",
            schema: {
              label: "Textarea",
              type: "dstextarea",
              key: "dstextarea",
            },
          },
          dsbutton: {
            title: "Button",
            key: "dsbutton",
            icon: "stop",
            schema: {
              label: "Button",
              type: "dsbutton",
              key: "dsbutton",
            },
          },
          dsselect: {
            title: "Select",
            key: "dsselect",
            icon: "list",
            schema: {
              label: "Select",
              type: "dsselect",
              key: "dsselect",
            },
          },
          dscheckbox: {
            title: "Checkbox",
            key: "dscheckbox",
            icon: "check-square",
            schema: {
              label: "Checkbox",
              type: "dscheckbox",
              key: "dscheckbox",
            },
          },
          dsradio: {
            title: "Radio",
            key: "dsradio",
            icon: "dot-circle-o",
            schema: {
              label: "Radio",
              type: "dsradio",
              key: "dsradio",
            },
          },
          dsnumber: {
            title: "Number",
            key: "dsnumber",
            icon: "hashtag",
            schema: {
              label: "Number",
              type: "dsnumber",
              key: "dsnumber",
            },
          },
          dsemail: {
            title: "Email",
            key: "dsemail",
            icon: "envelope",
            schema: {
              label: "Email",
              type: "dsemail",
              key: "dsemail",
            },
          },
          dsphone: {
            title: "Phone",
            key: "dsphone",
            icon: "phone",
            schema: {
              label: "Phone",
              type: "dsphone",
              key: "dsphone",
            },
          },
          dspassword: {
            title: "Password",
            key: "dspassword",
            icon: "lock",
            schema: {
              label: "Password",
              type: "dspassword",
              key: "dspassword",
            },
          },
          dsdatetime: {
            title: "Datetime",
            key: "dsdatetime",
            icon: "calendar",
            schema: {
              label: "Datetime",
              type: "dsdatetime",
              key: "dsdatetime",
            },
          },
          dstable: {
            title: "Table",
            key: "dstable",
            icon: "table",
            schema: {
              label: "Table",
              type: "dstable",
              key: "dstable",
            },
          },
          dsuserselect: {
            title: "Kullanıcı Seçici",
            key: "dsuserselect",
            icon: "user",
            schema: {
              label: "Kullanıcı Seçimi",
              type: "dsuserselect",
              key: "userSelect",
            },
          },
          dscustomerselect: {
            title: "Müşteri Seçici",
            key: "dscustomerselect",
            icon: "briefcase",
            schema: {
              label: "Müşteri Seçimi",
              type: "dscustomerselect",
              key: "customerSelect",
            },
          },
          dsparameterselect: {
            title: "Parametre Seçici",
            key: "dsparameterselect",
            icon: "database",
            schema: {
              label: "Parametre Seçimi",
              type: "dsparameterselect",
              key: "parameterSelect",
              parameterModule: "",
              parameterCategory: "",
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
    
    // Eğer id varsa formu yükle
    if (id) {
      loadFormById(id);
    }
  }, [id]);
  
  // Form yükleme
  const loadFormById = async (formId: string) => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      const response = await api.apiFormDataIdGet(formId);
      
      if (response.data) {
        setFormName(response.data.formName || "Yeni Form");
        setFormDescription(response.data.formDescription || "");
        if ((response.data as any).parentFormId) setParentFormId((response.data as any).parentFormId);
        if (typeof response.data.publicationStatus === "number") setPublicationStatus(response.data.publicationStatus);
        if (typeof response.data.revision === "number") setRevision(response.data.revision);
        if (typeof (response.data as any).formType === "number") setFormType((response.data as any).formType);
        if (typeof (response.data as any).formCategory === "number") setFormCategory((response.data as any).formCategory);
        if (typeof (response.data as any).formPriority === "number") setFormPriority((response.data as any).formPriority);
        
        if (response.data.formDesign) {
          const parsedSchema = JSON.parse(response.data.formDesign);
          setSchema(parsedSchema);
          
          // JavaScript kodunu yükle
          if (response.data.javaScriptCode) {
            setJsCode(response.data.javaScriptCode);
            setJsCodeInitialized(true);
          }
        }
        
        dispatchAlert({
          message: "Form başarıyla yüklendi",
          type: MessageBoxType.Success,
        });
      }
    } catch (error) {
      console.error("Form yükleme hatası:", error);
      dispatchAlert({
        message: "Form yüklenirken bir hata oluştu!",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  
  // Form kaydetme
  const saveForm = async (statusOverride?: number) => {
    try {
      if (!formName.trim()) {
        dispatchAlert({
          message: "Form adı boş olamaz!",
          type: MessageBoxType.Warning,
        });
        return;
      }
      
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      
      const formDesignJson = JSON.stringify(schema);
      const statusToSend = typeof statusOverride === "number" ? statusOverride : publicationStatus || 1;
      
      if (id) {
        // Güncelleme
        await api.apiFormDataPut({
          id,
          concurrencyToken: 0,
          formName,
          formDescription,
          formDesign: formDesignJson,
          javaScriptCode: jsCode,
          isActive: 1 as any,
          canEdit: true,
          revision: revision,
          publicationStatus: statusToSend as any,
          formType: formType as any,
          formCategory: formCategory as any,
          formPriority: formPriority as any,
        });
        
        dispatchAlert({
          message: "Form başarıyla güncellendi!",
          type: MessageBoxType.Success,
        });
      } else {
        // Yeni kayıt
        await api.apiFormDataPost({
          formName,
          formDescription,
          formDesign: formDesignJson,
          javaScriptCode: jsCode,
          isActive: 1 as any,
          canEdit: true,
          revision: revision,
          publicationStatus: statusToSend as any,
          showInMenu: false,
          formType: formType as any,
          formCategory: formCategory as any,
          formPriority: formPriority as any,
        });
        
        dispatchAlert({
          message: "Form başarıyla oluşturuldu!",
          type: MessageBoxType.Success,
        });
      }
      
      // Durumu güncelle
      setPublicationStatus(statusToSend);
      
    } catch (error) {
      console.error("Form kaydetme hatası:", error);
      dispatchAlert({
        message: "Form kaydedilirken bir hata oluştu!",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const publishForm = async () => {
    try {
      if (!id) {
        dispatchAlert({ message: "Önce formu taslak olarak kaydedin, sonra yayınlayın.", type: MessageBoxType.Warning });
        return;
      }
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      // Önce mevcut durumu kaydet (taslak olarak)
      await saveForm(1);
      // Ardından yayınla
      await api.apiFormDataPublishIdPost(id);
      setPublicationStatus(2);
      dispatchAlert({ message: "Form yayınlandı.", type: MessageBoxType.Success });
      await openRevisions(true);
    } catch (e: any) {
      console.error("Yayınlama hatası:", e);
      const msg = e?.response?.data?.message || e?.message || "Form yayınlanırken hata oluştu.";
      if (msg.includes("Only Draft forms can be published") || msg.includes("Only the latest revision can be published")) {
        dispatchAlert({ message: msg, type: MessageBoxType.Error });
        await openRevisions(true);
      } else {
        dispatchAlert({ message: msg, type: MessageBoxType.Error });
      }
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const createRevision = async () => {
    try {
      if (!id) {
        dispatchAlert({ message: "Önce formu kaydedin.", type: MessageBoxType.Warning });
        return;
      }
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      await api.apiFormDataCreateRevisionIdPost(id);
      const parent = parentFormId || id;
      const resList = await api.apiFormDataVersionsParentIdGet(parent);
      const list = (resList?.data || []) as any[];
      const drafts = list.filter((x: any) => x.publicationStatus === 1);
      const latestDraft = drafts.sort((a: any, b: any) => (b.revision || 0) - (a.revision || 0))[0];
      if (latestDraft?.id) {
        dispatchAlert({ message: `Revizyon #${latestDraft.revision} oluşturuldu.`, type: MessageBoxType.Success });
        navigate(`/forms/editor/${latestDraft.id}`);
      } else {
        await openRevisions(true);
        dispatchAlert({ message: "Revizyon oluşturuldu.", type: MessageBoxType.Success });
      }
    } catch (e) {
      console.error("Revizyon oluşturma hatası:", e);
      dispatchAlert({ message: "Revizyon oluşturulamadı.", type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const openRevisions = async (silent?: boolean) => {
    try {
      if (!id) {
        dispatchAlert({ message: "Önce formu kaydedin.", type: MessageBoxType.Warning });
        return;
      }
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      const parent = parentFormId || id;
      const res = await api.apiFormDataVersionsParentIdGet(parent);
      const list = (res?.data || []) as any[];
      setVersions(list);
      if (!silent) setVersionsOpen(true);
    } catch (e) {
      console.error("Revizyonlar yüklenemedi:", e);
      dispatchAlert({ message: "Revizyonlar yüklenemedi.", type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  const loadRevision = async (ver: any) => {
    try {
      if (!ver?.id) return;
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new FormDataApi(conf);
      const response = await api.apiFormDataIdGet(ver.id as string);
      if (response.data) {
        setFormName(response.data.formName || formName);
        setFormDescription(response.data.formDescription || "");
        if (response.data.formDesign) {
          try { setSchema(JSON.parse(response.data.formDesign)); } catch {}
        }
        if (response.data.javaScriptCode) setJsCode(response.data.javaScriptCode);
        if (typeof response.data.publicationStatus === "number") setPublicationStatus(response.data.publicationStatus);
        if (typeof response.data.revision === "number") setRevision(response.data.revision);
      }
      setVersionsOpen(false);
      dispatchAlert({ message: "Revizyon yüklendi.", type: MessageBoxType.Success });
    } catch (e) {
      console.error("Revizyon yükleme hatası:", e);
      dispatchAlert({ message: "Revizyon yüklenemedi.", type: MessageBoxType.Error });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // Form schema'dan otomatik TypeScript definitions oluştur
  const generateTypeDefinitions = () => {
    const components = schema.components || [];
    
    // Form Data interface'i oluştur
    let dataInterface = "interface FormData {\n";
    components.forEach((comp: any) => {
      if (comp.key) {
        const type = getTypeForComponent(comp.type);
        dataInterface += `  /** ${comp.label || comp.key} */\n`;
        dataInterface += `  ${comp.key}: ${type};\n`;
      }
    });
    dataInterface += "}";

    return `
      /**
       * Form data object - Tüm form alanlarına erişim
       * Form'unuzdaki alanlar otomatik olarak tanımlanmıştır.
       */
      ${dataInterface}
      declare const data: FormData;
      
      /**
       * Active component reference
       */
      declare const component: {
        setValue(value: any): void;
        getValue(): any;
        show(): void;
        hide(): void;
        disable(): void;
        enable(): void;
        validate(): boolean;
      };
      
      /**
       * Form instance - Global form kontrolleri
       */
      declare const instance: {
        submit(): Promise<any>;
        reset(): void;
        get(key: string): any;
        set(key: string, value: any): void;
        components: any[];
      };
      
      /**
       * Utility fonksiyonlar
       */
      declare const utils: {
        format(value: any, format: string): string;
        validate(value: any, rules: any): boolean;
      };
    `;
  };

  // Component type'ına göre TypeScript type döndür
  const getTypeForComponent = (componentType: string): string => {
    const typeMap: any = {
      textfield: "string",
      textarea: "string",
      number: "number",
      email: "string",
      password: "string",
      checkbox: "boolean",
      select: "string",
      selectboxes: "{ [key: string]: boolean }",
      radio: "string",
      button: "any",
      datetime: "string",
      day: "string",
      time: "string",
      currency: "number",
      phoneNumber: "string",
      // DS components
      dsinput: "string",
      dstextarea: "string",
      dsnumber: "number",
      dsemail: "string",
      dspassword: "string",
      dscheckbox: "boolean",
      dsselect: "string",
      dsradio: "string",
      dsphone: "string",
      dsdatetime: "string",
    };
    return typeMap[componentType] || "any";
  };

  // Monaco Editor'e IntelliSense için type definitions ekle
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Form schema'ya göre otomatik type definitions
    const typeDefinitions = generateTypeDefinitions();
    monaco.languages.typescript.javascriptDefaults.addExtraLib(typeDefinitions, 'formio.d.ts');

    // Editor shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('JavaScript kaydedildi');
    });
  };

  // Schema değiştiğinde type definitions ve template'i güncelle
  useEffect(() => {
    if (editorRef.current && (window as any).monaco) {
      const monaco = (window as any).monaco;
      const typeDefinitions = generateTypeDefinitions();
      monaco.languages.typescript.javascriptDefaults.addExtraLib(typeDefinitions, 'formio.d.ts');
    }

    // İlk kez component eklendiğinde veya kullanıcı kodu değiştirmediyse template'i güncelle
    if (!jsCodeInitialized && schema.components && schema.components.length > 0) {
      const newTemplate = generateJavaScriptTemplate(schema);
      setJsCode(newTemplate);
      setJsCodeInitialized(true);
    }
  }, [schema]);

  const handleJsCodeChange = (value: string | undefined) => {
    setJsCode(value || "");
    setJsCodeInitialized(true); // Kullanıcı kodu değiştirdi
  };

  const handleTabChange = (_e: React.SyntheticEvent, value: number) => setTab(value);

  const onFormChange = (updatedSchema: any) => {
    setSchema({ ...updatedSchema, components: [...updatedSchema.components] });
  };

  const downloadForm = () => {
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
          {/* Enum kısa alanları */}
          <TextField size="small" type="number" label="Tür" value={formType} onChange={(e) => setFormType(parseInt(e.target.value || '1'))} sx={{ width: 90 }} />
          <TextField size="small" type="number" label="Kategori" value={formCategory} onChange={(e) => setFormCategory(parseInt(e.target.value || '1'))} sx={{ width: 110 }} />
          <TextField size="small" type="number" label="Öncelik" value={formPriority} onChange={(e) => setFormPriority(parseInt(e.target.value || '1'))} sx={{ width: 110 }} />
          <Button 
            variant="contained" 
            onClick={() => setPreviewOpen(true)}
            sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.3)" } }}
          >
            <Icon sx={{ mr: 0.5 }}>visibility</Icon>Önizle
          </Button>
          <Chip size="small" color={publicationStatus === 2 ? "success" : publicationStatus === 3 ? "default" : "default"} label={publicationStatus === 2 ? "Yayınlandı" : publicationStatus === 3 ? "Arşiv" : "Taslak"} sx={{ bgcolor: publicationStatus === 2 ? "#10b981" : publicationStatus === 3 ? "#9ca3af" : "#e5e7eb", color: publicationStatus === 2 ? "#fff" : "#111827", fontWeight: 600 }} />
          <Button 
            variant="contained" 
            onClick={() => saveForm(1)}
            disabled={publicationStatus !== 1}
            sx={{ background: publicationStatus !== 1 ? "#9ca3af" : "#10b981", color: "#fff", fontWeight: 600, "&:hover": { background: publicationStatus !== 1 ? "#9ca3af" : "#059669" } }}
          >
            <Icon sx={{ mr: 0.5 }}>save</Icon>Taslak Kaydet
          </Button>
          <Button 
            variant="contained" 
            onClick={publishForm}
            disabled={publicationStatus !== 1}
            sx={{ background: publicationStatus !== 1 ? "#9ca3af" : "#7c3aed", color: "#fff", fontWeight: 600, "&:hover": { background: publicationStatus !== 1 ? "#9ca3af" : "#6d28d9" } }}
          >
            <Icon sx={{ mr: 0.5 }}>publish</Icon>Yayınla
          </Button>
          {(publicationStatus === 2 || publicationStatus === 3) && (
            <Button 
              variant="outlined" 
              onClick={createRevision}
              sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.1)" } }}
            >
              <Icon sx={{ mr: 0.5 }}>post_add</Icon>Revizyon Oluştur
            </Button>
          )}
          <Button 
            variant="outlined" 
            onClick={() => openRevisions()}
            sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.1)" } }}
          >
            <Icon sx={{ mr: 0.5 }}>history</Icon>Revizyonlar
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
            <Tab icon={<Icon fontSize="small">code</Icon>} iconPosition="start" label="JavaScript" />
            <Tab icon={<Icon fontSize="small">data_object</Icon>} iconPosition="start" label="JSON" />
          </Tabs>
        </Box>

        {/* Tab 0: Builder veya Read-Only Görünüm - FULL HEIGHT */}
        <Box sx={{ 
          flex: 1, 
          overflow: "auto", 
          bgcolor: "#fafbfc",
          display: tab === 0 ? "block" : "none"
        }}>
          {publicationStatus === 1 ? (
            <Box 
              className="formio-builder-wrapper formio-builder-fullscreen"
              sx={{ 
                height: "100%",
                minHeight: "600px",
                width: "100%",
                display: "flex"
              }}
            >
              <FormBuilder options={builderOptions} form={schema} onChange={onFormChange} />
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 2, px: 2, py: 1, bgcolor: "#111827", color: "#fff", borderRadius: 1, display: "inline-flex" }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Bu sürüm salt okunur. Düzenlemek için &quot;Revizyon Oluştur&quot; seçeneğini kullanın.
                </Typography>
              </Box>
              <Form form={schema} options={{ readOnly: true }} />
            </Box>
          )}
        </Box>

        {/* Tab 1: JavaScript Editor - FULL HEIGHT */}
        {tab === 1 && (
          <Box sx={{ flex: 1, overflow: "hidden", bgcolor: "#1e293b", p: 0, display: "flex", flexDirection: "column" }}>
            {/* JavaScript Toolbar */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              px: 2, 
              py: 1, 
              bgcolor: "#0f172a",
              borderBottom: "1px solid #334155"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Icon sx={{ color: "#fbbf24", fontSize: 18 }}>lightbulb</Icon>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                  Yeni component eklediyseniz template&apos;i güncelleyin
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  const newTemplate = generateJavaScriptTemplate(schema);
                  setJsCode(newTemplate);
                  setJsCodeInitialized(true);
                }}
                sx={{ 
                  minWidth: "auto",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.75rem",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#fff",
                  boxShadow: "none",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)"
                  }
                }}
              >
                <Icon sx={{ mr: 0.5, fontSize: 16 }}>refresh</Icon>
                Template&apos;i Güncelle
              </Button>
            </Box>
            
            {/* Editor */}
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={jsCode}
                onChange={handleJsCodeChange}
                onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
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
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                snippetSuggestions: "top",
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
              }}
              />
            </Box>
          </Box>
        )}

        {/* Tab 2: JSON View - Monaco Editor */}
        {tab === 2 && (
          <Box sx={{ flex: 1, overflow: "hidden", bgcolor: "#1e293b", p: 0 }}>
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={JSON.stringify(schema, null, 2)}
              onChange={(value) => {
                try {
                  if (value) {
                    const parsed = JSON.parse(value);
                    setSchema(parsed);
                  }
                } catch (e) {
                  // Invalid JSON - don't update schema
                  console.warn("Invalid JSON:", e);
                }
              }}
              options={{
                minimap: { enabled: true },
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
                readOnly: false,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Revisions Drawer */}
      <Drawer anchor="right" open={versionsOpen} onClose={() => setVersionsOpen(false)}>
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Revizyon Geçmişi</Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>Önceki sürümlerden birini yüklemek için tıklayın.</Typography>
          <List dense>
            {versions.length === 0 && (
              <ListItem>
                <ListItemText primary="Kayıtlı revizyon bulunamadı" />
              </ListItem>
            )}
            {versions.map((v: any, idx: number) => (
              <ListItem key={v.id || idx} button onClick={() => loadRevision(v)}>
                <ListItemText 
                  primary={`Revizyon #${v.revision ?? idx + 1} ${v.publicationStatus === 2 ? '(Yayın)' : '(Taslak)'}`}
                  secondary={v.updatedDate || v.createdDate}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

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
          <Icon sx={{ color: "#667eea", fontSize: 18 }}>
            {tab === 0 ? "edit_note" : tab === 1 ? "code" : "data_object"}
          </Icon>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
            {tab === 0 ? "Form Builder" : tab === 1 ? "JavaScript" : "JSON"}
          </Typography>
        </Box>
        <Box sx={{ width: 1, height: 20, bgcolor: "#e5e7eb" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon sx={{ color: "#667eea", fontSize: 18 }}>widgets</Icon>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
            <strong style={{ color: "#667eea" }}>{schema.components?.length || 0}</strong> bileşen
          </Typography>
        </Box>
        <Box sx={{ width: 1, height: 20, bgcolor: "#e5e7eb" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Icon sx={{ color: tab === 1 ? "#10b981" : "#64748b", fontSize: 18 }}>
            {tab === 1 ? "check_circle" : "schedule"}
          </Icon>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
            {tab === 1 ? "IntelliSense Active" : new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
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
            <Box 
              ref={(el: HTMLDivElement | null) => {
                if (el && previewOpen) {
                  // Önceki içeriği temizle
                  el.innerHTML = "";
                  
                  // JavaScript kodlarını global scope'a inject et
                  try {
                    // Fonksiyonları direkt window objesine ekle
                    const scriptContent = `
                      ${jsCode}
                      
                      // Fonksiyonları window'a ekle (Form.io için)
                      ${extractFunctionNames(jsCode).map(name => `window.${name} = ${name};`).join('\n')}
                      
                      console.log('✅ JavaScript kodları yüklendi:', ${JSON.stringify(extractFunctionNames(jsCode))});
                    `;
                    
                    const script = document.createElement('script');
                    script.textContent = scriptContent;
                    document.head.appendChild(script);
                    
                  } catch (error) {
                    console.error('❌ JavaScript kodu hatalı:', error);
                  }
                  
                  // Form'u render et
                  if ((window as any).Formio) {
                    (window as any).Formio.createForm(el, schema).then((form: any) => {
                      form.on("submit", (submission: any) => {
                        console.log("Form submission:", submission);
                        alert("✅ Form başarıyla gönderildi! Konsolu kontrol edin.");
                      });
                    });
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

