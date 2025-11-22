import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaCode } from "react-icons/fa";

function ScriptNode({ data = { script: "", name: "Script" } }) {
  const nodeId = useNodeId();
  const scriptPreview = data?.script?.substring(0, 50) || "No script";
  const name = data?.name || "Script";

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
            <FaCode style={{ fontSize: "18px", color: "white" }} />
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
              {name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.8)",
                marginTop: "2px",
              }}
            >
              JavaScript
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
          {/* Script Preview */}
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
            {data?.script ? (
              <div
                style={{
                  fontSize: "12px",
                  color: "#374151",
                  fontFamily: "monospace",
                  wordBreak: "break-word",
                }}
              >
                {scriptPreview}
                {data.script.length > 50 ? "..." : ""}
              </div>
            ) : (
              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Script tanımlanmamış
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Çıkış handle'ı (sağ taraf) */}
      <Handle
        id="output"
        style={{
          top: "50%",
          right: "-8px",
          background: "#10b981",
          width: "16px",
          height: "16px",
          border: "3px solid white",
          borderRadius: "50%",
        }}
        type="source"
        position={Position.Right}
      />
    </>
  );
}

export default memo(ScriptNode);

