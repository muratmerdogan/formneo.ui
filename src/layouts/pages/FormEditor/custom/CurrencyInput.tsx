import React from "react";
import { InputNumber } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { createResource, createBehavior } from "@designable/core";

type CurrencyInputProps = {
  value?: number;
  onChange?: (value: number | null) => void;
  currency?: string;
  precision?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

const CurrencyInputComponent: React.FC<CurrencyInputProps> = (props) => {
  const {
    value,
    onChange,
    currency = "TRY",
    precision = 2,
    min,
    max,
    placeholder,
    disabled,
    readOnly,
  } = props;

  // Para birimi formatlaması
  const formatter = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === "") return "";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "";
    
    // Türk Lirası formatı: 1.234,56 (binlik ayırıcı nokta, ondalık virgül)
    if (currency === "TRY") {
      const parts = numValue.toFixed(precision).split(".");
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const decimalPart = parts[1] || "";
      return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
    }
    
    // Diğer para birimleri için İngiliz formatı: 1,234.56
    const parts = numValue.toFixed(precision).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1] || "";
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  };

  // Parse: Formatlanmış string'i sayıya çevir
  const parser = (value: string | undefined): number => {
    if (!value || value === "") return 0;
    
    // Türk formatı için: noktaları kaldır (binlik ayırıcı), virgülü noktaya çevir (ondalık)
    if (currency === "TRY") {
      // Binlik ayırıcıları (noktaları) kaldır, virgülü noktaya çevir
      const cleaned = value.replace(/\./g, "").replace(",", ".");
      const numValue = parseFloat(cleaned);
      return isNaN(numValue) ? 0 : numValue;
    }
    
    // İngiliz formatı için: virgülleri kaldır (binlik ayırıcı), nokta zaten ondalık
    const cleaned = value.replace(/,/g, "");
    const numValue = parseFloat(cleaned);
    return isNaN(numValue) ? 0 : numValue;
  };

  // Para birimi sembolü
  const getCurrencySymbol = () => {
    const symbols: Record<string, string> = {
      TRY: "₺",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currency] || currency;
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <InputNumber
        value={value}
        onChange={onChange}
        formatter={formatter}
        parser={parser}
        precision={precision}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={disabled || readOnly}
        style={{ width: "100%" }}
      />
    </div>
  );
};

// Formily'ye bağla - CurrencyInputComponent'i kullan
const CurrencyInput: any = connect(
  CurrencyInputComponent,
  mapProps((props: any) => {
    return {
      ...props,
      // Currency prop'unu component'e aktar
      currency: props["x-component-props"]?.currency || props.currency || "TRY",
      precision: props["x-component-props"]?.precision || props.precision || 2,
      min: props["x-component-props"]?.min || props.min,
      max: props["x-component-props"]?.max || props.max,
      placeholder: props["x-component-props"]?.placeholder || props.placeholder,
      disabled: props["x-component-props"]?.disabled || props.disabled,
      readOnly: props["x-component-props"]?.readOnly || props.readOnly,
    };
  }),
  mapReadPretty((props: any) => {
    const value = props.value;
    const currency = props["x-component-props"]?.currency || props.currency || "TRY";
    const precision = props["x-component-props"]?.precision || props.precision || 2;
    
    if (value === undefined || value === null || value === "") {
      return <span style={{ color: "#999" }}>-</span>;
    }
    
    const formatter = (val: number) => {
      if (currency === "TRY") {
        return new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);
      }
      
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(val);
    };
    
    return <span>{formatter(value)}</span>;
  })
);

// Designable palette registration - NumberPicker pattern'ini kullan
CurrencyInput.Resource = createResource({
  icon: "DollarOutlined",
  title: "Para (Currency)",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "number",
        title: "Para (Currency)",
        "x-decorator": "FormItem",
        "x-component": "CurrencyInput",
        "x-component-props": {
          currency: "TRY",
          precision: 2,
        },
      },
    },
  ],
});

// Designable behavior (settings panel)
CurrencyInput.Behavior = createBehavior({
  name: "CurrencyInput",
  extends: ["Field"],
  selector: (node: any) => node.props?.["x-component"] === "CurrencyInput",
  designerProps: {
    propsSchema: {
      type: "object",
      properties: {
        currency: {
          type: "string",
          title: "Para Birimi",
          enum: ["TRY", "USD", "EUR", "GBP"],
          default: "TRY",
          "x-decorator": "FormItem",
          "x-component": "Select",
        },
        precision: {
          type: "number",
          title: "Ondalık Basamak",
          enum: [0, 1, 2, 3, 4],
          default: 2,
          "x-decorator": "FormItem",
          "x-component": "Select",
        },
        min: {
          type: "number",
          title: "Minimum Değer",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
        },
        max: {
          type: "number",
          title: "Maximum Değer",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
        },
        placeholder: {
          type: "string",
          title: "Placeholder",
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
      },
    },
  },
});

export default CurrencyInput;

