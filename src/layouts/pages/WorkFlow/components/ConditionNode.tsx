import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaCodeBranch } from "react-icons/fa";
import { ConditionNodeConfig } from "../types/condition.types";
import { getConditionSummary, countTotalRules } from "../utils/conditionEvaluator";

interface ConditionNodeProps {
  data: ConditionNodeConfig;
  selected?: boolean;
}

const ConditionNode: React.FC<ConditionNodeProps> = ({ data, selected }) => {
  const nodeId = useNodeId();
  const summary = data.condition ? getConditionSummary(data.condition) : "No conditions";
  const ruleCount = data.condition ? countTotalRules(data.condition) : 0;
  
  // Icon component to avoid TypeScript issues
  const IconComponent = FaCodeBranch as any;

  return (
    <>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: "50%",
          left: "-8px",
          width: "16px",
          height: "16px",
          background: "#6366f1",
          border: "3px solid white",
          borderRadius: "50%",
        }}
      />

      {/* Node Container */}
      <div
        className={`node-container ${selected ? "ring-2 ring-indigo-500" : ""}`}
        style={{
          width: "280px",
          minHeight: "140px",
          borderRadius: "18px",
          background: "white",
          boxShadow: selected
            ? "0 8px 24px rgba(99, 102, 241, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e5e7eb",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!selected) {
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.12)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected) {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
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
              {data.name || "Condition"}
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
          {/* Data Source */}
          {data.dataSource && (
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Source:</span>
              <span
                style={{
                  background: "#e5e7eb",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                {data.dataSource}
              </span>
            </div>
          )}

          {/* Condition Summary */}
          <div
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              minHeight: "48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {data.condition ? (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  {summary}
                </div>
                {ruleCount > 1 && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    {ruleCount} total rules
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                No conditions defined
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Handles */}
      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{
          top: "35%",
          right: "-8px",
          width: "16px",
          height: "16px",
          background: "#10b981",
          border: "3px solid white",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#10b981",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          TRUE
        </div>
      </Handle>

      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{
          top: "65%",
          right: "-8px",
          width: "16px",
          height: "16px",
          background: "#ef4444",
          border: "3px solid white",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#ef4444",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
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
};

export default memo(ConditionNode);

