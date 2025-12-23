import React from "react";
import { InputNumber } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { createResource, createBehavior } from "@designable/core";

// CurrencyInputSource SVG icon - Para/Currency iconu
export const CurrencyInputSource = (
  <svg viewBox="0 0 1424 1024">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      {/* Banknot/Kağıt para şekli */}
      <path
        d="M1344,218 C1388.18278,218 1424,253.81722 1424,298 L1424,726 C1424,770.18278 1388.18278,806 1344,806 L80,806 C35.81722,806 0,770.18278 0,726 L0,298 C0,253.81722 35.81722,218 80,218 L1344,218 Z M1344,238 L80,238 C47.1942859,238 20.5378857,264.328343 20,297.00779 L20,298 L20,726 C20,758.805714 46.328343,785.462114 79.0077903,785.991962 L80,786 L1344,786 C1376.80571,786 1403.46211,759.671657 1404,726.99221 L1404,726 L1404,298 C1404,265.194286 1377.67166,238.537886 1344.99221,238.008038 L1344,238 Z"
        fill="#999999"
        fillRule="nonzero"
      />
      {/* Dolar işareti ($) */}
      <path
        d="M712,280 C650.5,280 600,330.5 600,392 L600,432 C600,437.522847 604.477153,442 610,442 L814,442 C819.522847,442 824,446.477153 824,452 C824,457.522847 819.522847,462 814,462 L610,462 C604.477153,462 600,466.477153 600,472 L600,552 C600,557.522847 604.477153,562 610,562 L814,562 C819.522847,562 824,566.477153 824,572 C824,577.522847 819.522847,582 814,582 L610,582 C604.477153,582 600,586.477153 600,592 L600,632 C600,693.5 650.5,744 712,744 C773.5,744 824,693.5 824,632 L824,592 C824,586.477153 819.522847,582 814,582 L610,582 C604.477153,582 600,577.522847 600,572 C600,566.477153 604.477153,562 610,562 L814,562 C819.522847,562 824,557.522847 824,552 L824,472 C824,466.477153 819.522847,462 814,462 L610,462 C604.477153,462 600,457.522847 600,452 C600,446.477153 604.477153,442 610,442 L814,442 C819.522847,442 824,437.522847 824,432 L824,392 C824,330.5 773.5,280 712,280 Z M712,320 C748.183122,320 778,349.816878 778,386 L778,432 C778,437.522847 773.522847,442 768,442 L656,442 C650.477153,442 646,437.522847 646,432 L646,386 C646,349.816878 675.816878,320 712,320 Z M712,704 C675.816878,704 646,674.183122 646,638 L646,592 C646,586.477153 650.477153,582 656,582 L768,582 C773.522847,582 778,586.477153 778,592 L778,638 C778,674.183122 748.183122,704 712,704 Z"
        fill="var(--dn-brand-color)"
        fillRule="nonzero"
      />
      {/* Yuvarlak içinde para (coin) */}
      <circle cx="200" cy="512" r="80" fill="#999999" fillRule="nonzero" />
      <path
        d="M200,432 C254.911688,432 300,477.088312 300,532 C300,586.911688 254.911688,632 200,632 C145.088312,632 100,586.911688 100,532 C100,477.088312 145.088312,432 200,432 Z M200,472 C168.954305,472 144,496.954305 144,528 C144,559.045695 168.954305,584 200,584 C231.045695,584 256,559.045695 256,528 C256,496.954305 231.045695,472 200,472 Z"
        fill="#FFFFFF"
        fillRule="nonzero"
      />
      <path
        d="M200,472 C168.954305,472 144,496.954305 144,528 C144,559.045695 168.954305,584 200,584 C231.045695,584 256,559.045695 256,528 C256,496.954305 231.045695,472 200,472 Z M200,492 C211.045695,492 220,500.954305 220,512 C220,523.045695 211.045695,532 200,532 C188.954305,532 180,523.045695 180,512 C180,500.954305 188.954305,492 200,492 Z"
        fill="var(--dn-brand-color)"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

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
  icon: "CurrencyInputSource",
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

