import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaStop, FaWpforms } from "react-icons/fa"; // Form ikonu ve stop ikonu

function FormStopNode({ data = { name: "Varsayılan İsim", text: "Varsayılan Metin" } }) {
  const nodeId = useNodeId();

  return (
    <>
      <Handle
        style={{
          top: "50%",
          right: "100%",
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
          backgroundColor: "#cc4400", // Form için farklı renk (turuncu-kırmızı)
          width: "200px",
          minHeight: "60px",
        }}
      >
        <div className="border-solid border-b-2 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaWpforms style={{ fontSize: "1.2em", color: "white", marginRight: "4px" }} />
            <FaStop style={{ fontSize: "1.2em", color: "white" }} />
            <span className="ml-2" style={{ fontSize: "1.1em", color: "white", fontWeight: "600" }}>
              Form Dur {data.name}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(FormStopNode);
