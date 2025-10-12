import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";

const CustomValueEditorComponent = (props) => {
  const { field, value, handleOnChange, parsedFormDesign } = props;

  const fieldName = typeof field === "string" ? field : field?.name;
  const fieldConfig = parsedFormDesign?.fields?.find((f) => f.name === fieldName) || {};
  const valueEditorType = fieldConfig.valueEditorType || "text";
  const fieldValues = fieldConfig.values || [];

  // ✅ Internal state - QueryBuilder'a sadece blur'da bildir
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [isUserTyping, setIsUserTyping] = useState(false);

  // ✅ Refs to track state
  const inputRef = useRef(null);
  const lastReportedValue = useRef(value);
  const blurTimeoutRef = useRef(null);

  // ✅ Only sync external value when not typing
  useEffect(() => {
    if (!isUserTyping && value !== internalValue) {
      setInternalValue(value ?? "");
      lastReportedValue.current = value;
    }
  }, [value, isUserTyping]);

  // ✅ Report to parent only when necessary
  const reportToParent = (newValue) => {
    if (newValue !== lastReportedValue.current) {
      lastReportedValue.current = newValue;
      if (handleOnChange) {
        handleOnChange(newValue);
      }
    }
  };

  // ✅ Handle input focus
  const handleFocus = () => {
    setIsUserTyping(true);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  };

  // ✅ Handle input blur - Report to parent after delay
  const handleBlur = () => {
    setIsUserTyping(false);

    // Slight delay to prevent flicker when switching between fields
    blurTimeoutRef.current = setTimeout(() => {
      reportToParent(internalValue);
    }, 100);
  };

  // ✅ Handle value change - Update internal state only
  const handleChange = (newValue) => {
    setInternalValue(newValue);
  };

  // ✅ Cleanup
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Text, Date, Time, Number inputs
  if (["text", "date", "time", "number"].includes(valueEditorType)) {
    return (
      <TextField
        ref={inputRef}
        type={valueEditorType === "text" ? "text" : valueEditorType}
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="small"
        InputLabelProps={{ shrink: true }}
        placeholder="Değer giriniz..."
        style={{ minWidth: 150 }}
        inputProps={{
          autoComplete: "off",
        }}
      />
    );
  }

  // ✅ Checkbox - Immediate update (no typing involved)
  if (valueEditorType === "checkbox") {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={internalValue === true || internalValue === "true" || internalValue === 1}
            onChange={(e) => {
              const newValue = e.target.checked;
              setInternalValue(newValue);
              reportToParent(newValue);
            }}
            size="small"
          />
        }
        label={
          internalValue === true || internalValue === "true" || internalValue === 1
            ? "Evet"
            : "Hayır"
        }
      />
    );
  }

  // ✅ Select - Immediate update (single selection)
  if (valueEditorType === "select") {
    return (
      <FormControl size="small" style={{ minWidth: 150 }}>
        <InputLabel>Seçiniz</InputLabel>
        <Select
          value={internalValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInternalValue(newValue);
            reportToParent(newValue);
          }}
          label="Seçiniz"
        >
          <MenuItem value="">
            <em>Seçiniz...</em>
          </MenuItem>
          {fieldValues.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // ✅ Radio - Immediate update (single selection)
  if (valueEditorType === "radio") {
    return (
      <FormControl component="fieldset" size="small">
        <RadioGroup
          value={internalValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInternalValue(newValue);
            reportToParent(newValue);
          }}
          row
        >
          {fieldValues.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
              style={{ marginRight: 16 }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }

  // ✅ Default text input
  return (
    <TextField
      ref={inputRef}
      type="text"
      value={internalValue}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="Değer giriniz..."
      size="small"
      style={{ minWidth: 150 }}
      inputProps={{
        autoComplete: "off",
      }}
    />
  );
};

// ✅ Memo to prevent unnecessary re-renders
export const CustomValueEditor = React.memo(CustomValueEditorComponent, (prevProps, nextProps) => {
  const prevFieldName =
    typeof prevProps.field === "string" ? prevProps.field : prevProps.field?.name;
  const nextFieldName =
    typeof nextProps.field === "string" ? nextProps.field : nextProps.field?.name;

  // Only re-render if field changes or parsedFormDesign structure changes
  return (
    prevFieldName === nextFieldName &&
    prevProps.parsedFormDesign?.fields?.length === nextProps.parsedFormDesign?.fields?.length
  );
});
