import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaCodeBranch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function ConditionNode({ data = { name: "Koşul", condition: "", conditionType: "expression" } }) {
  const nodeId = useNodeId();
  const condition = data?.condition || "";
  const conditionType = data?.conditionType || "expression";
  const previousNodeName = data?.previousNodeName || "";
  
  // Condition özetini formatla
  const getConditionSummary = () => {
    if (!condition) return "Koşul tanımlanmamış";
    
    if (conditionType === "expression") {
      // Expression'ı kısalt
      if (condition.length > 40) {
        return condition.substring(0, 40) + "...";
      }
      return condition;
    } else {
      // Query builder için
      return "Görsel Koşul";
    }
  };
  
  return (
    <>
      {/* Giriş handle (sol taraf) */}
      <Handle
        style={{
          top: "50%",
          left: "-8px",
          background: "#6366f1",
          width: "16px",
          height: "16px",
          border: "3px solid white",
          borderRadius: "50%",
        }}
        type="target"
        position={Position.Left}
      />
      
      <div
        className="node border-solid border-2 rounded-xl shadow-lg"
        style={{
          backgroundColor: "white",
          width: "280px",
          minHeight: "140px",
          borderColor: "#e5e7eb",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#6366f1";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(99, 102, 241, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        {/* Başlık */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <div className="flex items-center gap-2">
            <FaCodeBranch style={{ fontSize: "1.1em", color: "white" }} />
            <span style={{ fontSize: "0.95em", fontWeight: "600", color: "white" }}>
              Koşul
            </span>
          </div>
          <div
            style={{
              fontSize: "0.75em",
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: "500",
            }}
          >
            IF/ELSE
          </div>
        </div>
        
        {/* İçerik */}
        <div className="px-4 py-3" style={{ backgroundColor: "#f9fafb" }}>
          {previousNodeName && (
            <div
              style={{
                fontSize: "0.75em",
                color: "#6b7280",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "500" }}>Kaynak:</span>
              <span
                style={{
                  backgroundColor: "#e5e7eb",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7em",
                }}
              >
                {previousNodeName}
              </span>
            </div>
          )}
          
          <div
            style={{
              fontSize: "0.85em",
              color: "#374151",
              fontFamily: conditionType === "expression" ? "monospace" : "inherit",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              wordBreak: "break-word",
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {condition ? (
              <span style={{ color: "#1f2937" }}>{getConditionSummary()}</span>
            ) : (
              <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                Koşul tanımlanmamış
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* TRUE çıkış handle'ı (sağ üst) */}
      <Handle
        id="true"
        style={{
          top: "35%",
          right: "-8px",
          background: "#10b981",
          width: "16px",
          height: "16px",
          border: "3px solid white",
          borderRadius: "50%",
        }}
        type="source"
        position={Position.Right}
      >
        <div
          style={{
            position: "absolute",
            right: "25px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#10b981",
            color: "white",
            fontSize: "0.7em",
            fontWeight: "600",
            padding: "2px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          TRUE
        </div>
      </Handle>
      
      {/* FALSE çıkış handle'ı (sağ alt) */}
      <Handle
        id="false"
        style={{
          top: "65%",
          right: "-8px",
          background: "#ef4444",
          width: "16px",
          height: "16px",
          border: "3px solid white",
          borderRadius: "50%",
        }}
        type="source"
        position={Position.Right}
      >
        <div
          style={{
            position: "absolute",
            right: "25px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "0.7em",
            fontWeight: "600",
            padding: "2px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          FALSE
        </div>
      </Handle>
    </>
  );
}

export default memo(ConditionNode);
