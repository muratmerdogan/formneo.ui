import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { FaFilter, FaCog } from "react-icons/fa";

const QueryConditionNode = ({ data, isConnectable }) => {
  return (
    <div style={{ background: "#ffcc00", padding: 10, borderRadius: 8, border: "2px solid #ddd" }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <FaFilter style={{ marginRight: 8, color: "#006064" }} />
        <strong>Query Koşulu</strong>
        <FaCog style={{ marginLeft: "auto", color: "#888" }} />
      </div>
      <div style={{ fontSize: "13px", color: "#333" }}>{data?.summary || "Tanımlı koşul yok"}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: "40%", background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: "70%", background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(QueryConditionNode);
