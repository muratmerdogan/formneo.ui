import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function AlertNode({ data = { message: "Mesaj", type: "info" } }) {
  const nodeId = useNodeId();
  
  const getIcon = () => {
    switch (data.type) {
      case "success":
        return <FaCheckCircle style={{ fontSize: "1.2em", color: "#28a745", marginRight: "4px" }} />;
      case "error":
        return <FaTimesCircle style={{ fontSize: "1.2em", color: "#dc3545", marginRight: "4px" }} />;
      case "warning":
        return <FaExclamationTriangle style={{ fontSize: "1.2em", color: "#ffc107", marginRight: "4px" }} />;
      case "info":
      default:
        return <FaInfoCircle style={{ fontSize: "1.2em", color: "#17a2b8", marginRight: "4px" }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (data.type) {
      case "success":
        return "#d4edda";
      case "error":
        return "#f8d7da";
      case "warning":
        return "#fff3cd";
      case "info":
      default:
        return "#d1ecf1";
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      case "warning":
        return "#ffc107";
      case "info":
      default:
        return "#17a2b8";
    }
  };

  return (
    <>
      <Handle
        style={{
          top: "50%",
          left: "-10px",
          background: "#555",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
        }}
        type="target"
        position={Position.Left}
      />
      
      <div
        className="node border-solid border-4 rounded-lg"
        style={{
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          width: "220px",
          minHeight: "80px",
        }}
      >
        <div className="border-solid border-b-2 py-2 px-4 flex items-center">
          {getIcon()}
          <span style={{ fontSize: "1.1em", fontWeight: "600", color: "#333" }}>
            {data.title || "Bildirim"}
          </span>
        </div>
        <div className="py-2 px-4" style={{ fontSize: "0.9em", color: "#555" }}>
          {data.message || "Mesaj yok"}
        </div>
      </div>
      
      <Handle
        style={{
          top: "50%",
          right: "-10px",
          background: "#555",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
        }}
        type="source"
        position={Position.Right}
      />
    </>
  );
}

export default memo(AlertNode);

