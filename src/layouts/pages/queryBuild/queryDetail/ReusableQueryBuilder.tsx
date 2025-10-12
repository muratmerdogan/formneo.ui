import React, { useEffect, useMemo, useState } from "react";
import QueryBuilder, { RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

import {
  TicketPriorityData,
  TicketTypeData,
  TicketSlaData,
  TicketSubjectData,
  TicketClientData,
  TicketCompanyData,
  WorkCompanyIdSystemData,
} from "../controller";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { Card, CardContent, Grid, Typography, Icon } from "@mui/material";
import MDButton from "components/MDButton";
import { CustomValueEditor } from "layouts/pages/WorkFlow/components/CustomValueEditor.jsx";

interface ParsedFormDesign {
  fields: any[];
  raw: any;
}

interface ReusableQueryBuilderProps {
  parsedFormDesign?: ParsedFormDesign;
  selectedCustomerRefId?: string;
  onQueryChange?: (q: RuleGroupType) => void;
  initialQuery?: RuleGroupType;
}

const ReusableQueryBuilder: React.FC<ReusableQueryBuilderProps> = ({
  parsedFormDesign = { fields: [], raw: null },
  selectedCustomerRefId = "",
  onQueryChange,
  initialQuery = { combinator: "and", rules: [] },
}) => {
  const dispatchAlert = useAlert();
  const dispatchBusy = useBusy();
  const [query, setQuery] = useState<RuleGroupType>(initialQuery);
  const DEFAULT_OPERATOR = "=";

  const [clientFields, setClientFields] = useState<any[]>([]);
  const [companyFields, setCompanyFields] = useState<any[]>([]);
  const [priorityFields, setPriorityFields] = useState<any[]>([]);
  const [typeFields, setTypeFields] = useState<any[]>([]);
  const [slaFields, setSlaFields] = useState<any[]>([]);
  const [subjectFields, setSubjectFields] = useState<any[]>([]);
  const [workCompanySystemInfo, setWorkCompanySystemInfo] = useState<any[]>([]);
  // ✅ Güncellenmiş normalizeQueryOperators fonksiyonu
  const normalizeQueryOperators = (query: RuleGroupType): RuleGroupType => {
    const normalizedRules = query.rules.map((rule: any) => {
      if (rule.rules) {
        // Eğer iç içe kurallar varsa onları da normalize et
        return normalizeQueryOperators(rule);
      }
      return {
        ...rule,
        operator: rule.operator || DEFAULT_OPERATOR, // ✅ Boşsa "=" ata
      };
    });

    return {
      combinator: query.combinator || "and", // ✅ combinator'ı da ekle
      rules: normalizedRules,
    };
  };

  const loadFieldData = async (
    fetchFunction: any,
    setStateFunction: (data: any[]) => void,
    isEmail?: boolean
  ) => {
    try {
      const data = await fetchFunction(isEmail);
      setStateFunction([data]);
    } catch (error) {
      dispatchAlert({
        message: `Error loading field data: ${error}`,
        type: MessageBoxType.Error,
      });
    }
  };

  const loadAllFieldData = async () => {
    dispatchBusy({ isBusy: true });
    const fieldDataLoader = [
      { fetch: TicketClientData, setState: setClientFields },
      { fetch: TicketCompanyData, setState: setCompanyFields },
      { fetch: TicketPriorityData, setState: setPriorityFields },
      { fetch: TicketTypeData, setState: setTypeFields },
      { fetch: TicketSlaData, setState: setSlaFields },
      { fetch: TicketSubjectData, setState: setSubjectFields },
    ];

    await Promise.all(fieldDataLoader.map(({ fetch, setState }) => loadFieldData(fetch, setState)));

    if (selectedCustomerRefId !== "") {
      const data = await WorkCompanyIdSystemData(selectedCustomerRefId);
      if (data) setWorkCompanySystemInfo([data]);
    }

    dispatchBusy({ isBusy: false });
  };

  useEffect(() => {
    loadAllFieldData();
  }, [selectedCustomerRefId]);

  const handleQueryChange = (q: RuleGroupType) => {
    const fixedQuery = {
      ...q,
      rules: q.rules.map((rule: any) => ({
        ...rule,
        operator: rule.operator || "=",
      })),
    };
    const normalizedQuery = normalizeQueryOperators(fixedQuery); // Operatörleri normalize et
    console.log("🔧 Query normalized:", normalizedQuery);
    setQuery(normalizedQuery);

    if (onQueryChange) {
      onQueryChange(normalizedQuery);
    }
  };

  // ✅ Form fields'ları basit şekilde hazırla - Type safe
  // ✅ formFields'da operators'ı kontrol edin:
  const formFields = useMemo(() => {
    if (!parsedFormDesign?.fields) return [];

    return parsedFormDesign.fields.map((field: any) => {
      console.log(`🔍 Field: ${field.name}, operators:`, field.operators); // ✅ Debug log

      return {
        name: field.name,
        label: field.label,
        operators: field.operators || ["=", "!="],
        defaultOperator: field.defaultOperator || "=", // ✅ Default operator'ı ekle
        valueEditorType: field.valueEditorType || "text",
        values: field.values,
      };
    });
  }, [parsedFormDesign]);
  useEffect(() => {
    if (formFields.length > 0) {
      console.log("✅ Setting query after formFields are ready");
      setQuery(initialQuery);
    }
  }, [formFields, initialQuery]);

  // ✅ System fields'ları ekle

  // ✅ Tüm alanları birleştir
  const allFields = useMemo(() => {
    return [...formFields];
  }, [formFields]);

  // ✅ Debug logs
  useEffect(() => {
    console.log("✅ parsedFormDesign değişti:", parsedFormDesign);
    console.log("📝 Form Fields:", formFields);
    console.log("🔧 All Fields:", allFields);
  }, [parsedFormDesign, formFields, allFields]);

  // ✅ Form fields'ları göster

  return (
    <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#334155",
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon sx={{ mr: 1 }}>filter_alt</Icon> Sorgu Kriterleri
        </Typography>

        {/* ✅ Form fields bilgi paneli */}

        {allFields.length > 0 && (
          <QueryBuilder
            fields={allFields as any}
            query={query}
            onQueryChange={handleQueryChange}
            resetOnOperatorChange={false}
            resetOnFieldChange={false}
            // ✅ Bu satırı ekleyin
            showCombinatorsBetweenRules={false}
            disabled={false} // ✅ Explicitly enable
            // ✅ Action buttons'ları açık

            controlClassnames={{
              queryBuilder: "queryBuilder-branches custom-builder",
              ruleGroup: "custom-rule-group",
              rule: "custom-rule",
            }}
            controlElements={{
              addRuleAction: ({ handleOnClick }: any) => (
                <MDButton
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={handleOnClick}
                  startIcon={<Icon>add</Icon>}
                  sx={{ borderRadius: "8px", textTransform: "none", mr: 1 }}
                >
                  Kural Ekle
                </MDButton>
              ),
              addGroupAction: ({ handleOnClick }: any) => (
                <MDButton
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={handleOnClick}
                  startIcon={<Icon>create_new_folder</Icon>}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Grup Ekle
                </MDButton>
              ),
              removeGroupAction: ({ handleOnClick }: any) => (
                <MDButton
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleOnClick}
                  startIcon={<Icon>delete</Icon>}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Kaldır
                </MDButton>
              ),
              removeRuleAction: ({ handleOnClick }: any) => (
                <MDButton
                  variant="text"
                  color="error"
                  size="small"
                  onClick={handleOnClick}
                  sx={{
                    minWidth: "32px",
                    width: "32px",
                    height: "32px",
                    padding: 0,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon>close</Icon>
                </MDButton>
              ),
              operatorSelector: ({ options, value, handleOnChange }: any) => {
                console.log("🔍 Operator options:", options);
                console.log("🔍 Current value:", value);

                return (
                  <select
                    value={value}
                    onChange={(e) => handleOnChange(e.target.value)}
                    style={{
                      minWidth: "50px", // ✅ 140px'den 100px'e düşürdüm
                      width: "50px", // ✅ Sabit genişlik
                      height: "34px", // ✅ 32px'den 28px'e düşürdüm
                      padding: "2px 6px", // ✅ 4px 8px'den 2px 6px'e düşürdüm
                      border: "1px solid #d1d5db",
                      borderRadius: "4px", // ✅ 6px'den 4px'e düşürdüm
                      backgroundColor: "white",
                      fontSize: "13px", // ✅ 14px'den 13px'e düşürdüm
                    }}
                  >
                    <option value="">Operatör Seçiniz</option>
                    {options.map((option: any, index: number) => {
                      // ✅ String ise direkt kullan, object ise name property'sini al
                      const optionValue = typeof option === "string" ? option : option.name;
                      const optionLabel =
                        typeof option === "string" ? option : option.label || option.name;

                      console.log("🔍 Option value/label:", optionValue, optionLabel);

                      return (
                        <option key={`${optionValue}-${index}`} value={optionValue}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </select>
                );
              },

              // ✅ Custom ValueEditor - Type safe
              valueEditor: (props: any) => (
                <CustomValueEditor
                  field={props.field}
                  handleOnChange={props.handleOnChange}
                  value={props.value ?? ""}
                  parsedFormDesign={parsedFormDesign}
                />
              ),
            }}
            translations={{
              fields: { title: "Alan Seçiniz" },
              operators: { title: "Operatör Seçiniz" },
              value: { title: "Değer Giriniz" },
              removeRule: { label: "Kaldır", title: "Kaldır" },
              removeGroup: { label: "Kaldır", title: "Kaldır" },
              addRule: { label: "Kural Ekle", title: "Kural Ekle" },
              addGroup: { label: "Grup Ekle", title: "Grup Ekle" },
            }}
          />
        )}

        <Grid container spacing={2} mt={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              SQL Çıktısı
            </Typography>
            <pre
              style={{
                backgroundColor: "#f0f4f8",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "12px",
                maxHeight: "200px",
              }}
            >
              {formatQuery(query, "sql")}
            </pre>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              JSON Çıktısı
            </Typography>
            <pre
              style={{
                backgroundColor: "#f0f4f8",
                padding: "12px",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "12px",
                maxHeight: "200px",
              }}
            >
              {formatQuery(query, "json")}
            </pre>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReusableQueryBuilder;
