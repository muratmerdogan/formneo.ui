import React, { useState, useEffect } from "react";
import {
  Form,
  FormItem,
  Input,
  TextArea,
  Button,
  Title,
  Select,
  Option,
} from "@ui5/webcomponents-react";

const AlertTab = ({
  initialValues,
  node,
  onButtonClick,
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [message, setMessage] = useState(initialValues?.message || "");
  const [type, setType] = useState(initialValues?.type || "info");

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setMessage(initialValues.message || "");
      setType(initialValues.type || "info");
    }
  }, [initialValues]);

  const handleSave = () => {
    if (onButtonClick && node) {
      onButtonClick({
        id: node.id,
        data: {
          ...initialValues,
          title,
          message,
          type,
        },
      });
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <Title level="H4" style={{ marginBottom: "16px" }}>
        Alert Node Özellikleri
      </Title>

      <Form>
        <FormItem label="Başlık">
          <Input
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            placeholder="Alert başlığı"
          />
        </FormItem>

        <FormItem label="Mesaj">
          <TextArea
            value={message}
            onInput={(e: any) => setMessage(e.target.value)}
            placeholder="Kullanıcıya gösterilecek mesaj"
            rows={4}
          />
        </FormItem>

        <FormItem label="Tip">
          <Select
            value={type}
            onChange={(e: any) => setType(e.detail.selectedOption.value)}
          >
            <Option value="info">Bilgi (Info)</Option>
            <Option value="success">Başarılı (Success)</Option>
            <Option value="warning">Uyarı (Warning)</Option>
            <Option value="error">Hata (Error)</Option>
          </Select>
        </FormItem>

        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button design="Emphasized" onClick={handleSave}>
            Kaydet
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AlertTab;

