import React, { useState, useEffect } from "react"; // ✅ useEffect eklendi
import ReusableQueryBuilder from "../../queryBuild/queryDetail/ReusableQueryBuilder";
import { Icon } from "@mui/material";
import MDButton from "components/MDButton";
import { RuleGroupType } from "react-querybuilder";
import { formatQuery } from "react-querybuilder";

interface QueryConditionTabProps {
  node: any;
  parsedFormDesign: any;
  selectedForm?: any;
  initialValues?: any;
  onButtonClick?: (data: any) => void;
}

const QueryConditionTab: React.FC<QueryConditionTabProps> = ({
  node,
  parsedFormDesign,
  selectedForm,
  initialValues,
  onButtonClick,
}) => {
  const [query, setQuery] = useState<RuleGroupType>(
    node?.data?.query || { combinator: "and", rules: [] }
  );

  // ✅ Node'dan form bilgisini al
  const savedFormId = node?.data?.selectedFormId;
  const savedFormName = node?.data?.selectedFormName;
  const savedParsedFormDesign = node?.data?.parsedFormDesign;

  // ✅ En güncel form design'ını belirle
  const currentFormDesign = parsedFormDesign || savedParsedFormDesign;

  // ✅ Debug bilgileri
  useEffect(() => {
    console.log("🔍 QueryConditionTab props:");
    console.log("- parsedFormDesign:", parsedFormDesign);
    console.log("- selectedForm:", selectedForm);
    console.log("- node.data:", node?.data);
    console.log("- savedFormId:", savedFormId);
    console.log("- savedFormName:", savedFormName);
    console.log("- currentFormDesign:", currentFormDesign);
  }, [parsedFormDesign, selectedForm, node, savedFormId, savedFormName, currentFormDesign]);

  // ✅ Node data değiştiğinde query'yi güncelle - eklendi
  useEffect(() => {
    if (node?.data?.query) {
      setQuery(node.data.query);
    }
  }, [node?.data?.query, node?.id]);

  const handleSaveQuery = () => {
    if (node) {
      const queryBuilder = formatQuery(query, "jsonlogic");
      const updatedData = {
        ...node.data, // ✅ Mevcut data'yı koru
        query: query, // ✅ React Query Builder formatında sorgu
        jsonLogicRule: queryBuilder, // ✅ Query Builder formatında sorgu
        selectedFormId: selectedForm?.id || savedFormId,
        selectedFormName: selectedForm?.formName || savedFormName,
        parsedFormDesign: currentFormDesign, // ✅ En güncel form design'ını kullan
        lastModified: new Date().toISOString(),
        status: "configured",
      };

      console.log("💾 Saving node data:", updatedData); // ✅ Debug log

      if (onButtonClick) {
        onButtonClick({
          id: node.id,
          data: updatedData,
        });
      }

      alert("Sorgu kaydedildi 🎉");
    }
  };

  // ✅ Form design yoksa loading/warning göster
  if (!currentFormDesign || !currentFormDesign.fields || currentFormDesign.fields.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        {/* ✅ Form adını göster - varsa */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3>Query Condition</h3>
          {(savedFormName || selectedForm?.formName) && (
            <div
              style={{
                backgroundColor: "#e3f2fd",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                color: "#1976d2",
                fontWeight: "500",
              }}
            >
              📋 {savedFormName || selectedForm?.formName}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            margin: "10px 0",
          }}
        >
          ⚠️ Form alanları henüz yüklenmedi.
          <br />
          <small>Saved Form: {savedFormName || "Yok"}</small>
          <br />
          <small>Current Form: {selectedForm?.formName || "Yok"}</small>
          <br />
          <small>parsedFormDesign: {currentFormDesign ? "Var ama fields yok" : "null"}</small>
        </div>

        <MDButton
          variant="gradient"
          color="info"
          startIcon={<Icon>save</Icon>}
          sx={{ mt: 2 }}
          onClick={handleSaveQuery}
        >
          Sorguyu Kaydet
        </MDButton>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      {/* ✅ Form adını göster */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>Query Condition</h3>
        {(savedFormName || selectedForm?.formName) && (
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              color: "#1976d2",
              fontWeight: "500",
            }}
          >
            📋 {savedFormName || selectedForm?.formName}
          </div>
        )}
      </div>

      <ReusableQueryBuilder
        key={`${node?.id}-${currentFormDesign?.fields?.length || 0}`} // ✅ Key ile force refresh
        initialQuery={query}
        onQueryChange={setQuery}
        parsedFormDesign={currentFormDesign}
      />

      <MDButton
        variant="gradient"
        color="info"
        startIcon={<Icon>save</Icon>}
        sx={{ mt: 2 }}
        onClick={handleSaveQuery}
      >
        Sorguyu Kaydet
      </MDButton>
    </div>
  );
};

export default QueryConditionTab;
