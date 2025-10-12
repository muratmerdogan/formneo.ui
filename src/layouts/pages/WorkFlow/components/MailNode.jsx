// src/layouts/pages/components/MailNode.jsx
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { MdEmail, MdSettings } from "react-icons/md";

const MailNode = ({ data, isConnectable }) => {
  return (
    <div style={{ background: "#ffcc00", padding: 10, borderRadius: 8, border: "2px solid #ddd" }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <MdEmail style={{ marginRight: 8, color: "#666" }} />
        <strong>Mail Gönder</strong>
        <MdSettings style={{ marginLeft: "auto", color: "#888" }} />
      </div>
      <div style={{ fontSize: "13px", color: "#333" }}>
        {data?.mailTo ? `Kime: ${data.mailTo}` : "Tanımlı alıcı yok"}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="default"
        style={{ left: "50%", background: "#0288d1", width: 12, height: 12 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(MailNode);
