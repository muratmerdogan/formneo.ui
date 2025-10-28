import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { FaPenAlt, FaCog } from "react-icons/fa";

const SetFieldNode = ({ data, isConnectable }) => {
  const summary = data?.summary ||
    (Array.isArray(data?.actions) && data.actions.length > 0
      ? `${data.actions.length} alan ayarlanacak`
      : "Tanımlı eylem yok");

  return (
    <div style={{ background: "#e0f7fa", padding: 10, borderRadius: 8, border: "2px solid #b2ebf2" }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <FaPenAlt style={{ marginRight: 8, color: "#006064" }} />
        <strong>Alan Set</strong>
        <FaCog style={{ marginLeft: "auto", color: "#888" }} />
      </div>
      <div style={{ fontSize: "13px", color: "#333" }}>{summary}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: "55%", background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(SetFieldNode);


