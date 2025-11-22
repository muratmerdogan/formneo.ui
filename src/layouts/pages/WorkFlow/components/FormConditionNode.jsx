import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaCodeBranch } from "react-icons/fa";

function FormConditionNode({ data = { formId: null, condition: "" } }) {
  const nodeId = useNodeId();
  const condition = data?.condition || "";
  const formName = data?.formName || "Form seçilmedi";

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

      {/* Node Container */}
      <div
        className="node border-solid border-2 rounded-xl shadow-lg"
        style={{
          backgroundColor: "white",
          width: "260px",
          minHeight: "130px",
          borderColor: "#e5e7eb",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#6366f1";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        }}
      >
        {/* Başlık */}
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* @ts-ignore - react-icons type issue */}
            <FaCodeBranch style={{ fontSize: "18px", color: "white" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                lineHeight: "1.2",
              }}
            >
              Form Koşulu
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.8)",
                marginTop: "2px",
              }}
            >
              IF/ELSE
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "16px",
            background: "#f9fafb",
          }}
        >
          {/* Form Bilgisi */}
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            <strong>Form:</strong> {formName}
          </div>

          {/* Condition Summary */}
          <div
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {condition ? (
              <div
                style={{
                  fontSize: "12px",
                  color: "#374151",
                  fontFamily: "monospace",
                  wordBreak: "break-word",
                }}
              >
                {condition.length > 40 ? `${condition.substring(0, 40)}...` : condition}
              </div>
            ) : (
              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Koşul tanımlanmamış
              </div>
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
            background: "#10b981",
            color: "white",
            fontSize: "11px",
            fontWeight: "600",
            padding: "3px 8px",
            borderRadius: "6px",
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
            background: "#ef4444",
            color: "white",
            fontSize: "11px",
            fontWeight: "600",
            padding: "3px 8px",
            borderRadius: "6px",
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

export default memo(FormConditionNode);

