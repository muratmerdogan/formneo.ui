import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaUserCheck } from "react-icons/fa";

function UserTaskNode({ data = { name: "Kullanıcı Görevi", assignedUserName: "", message: "", buttons: [] } }) {
  const nodeId = useNodeId();
  const assignedUser = data?.assignedUserName || data?.userName || "";
  const message = data?.message || "";
  const buttons = data?.buttons || [];
  
  // Node yüksekliğini mesaj ve buton sayısına göre ayarla
  const headerHeight = 90;
  const padding = 16;
  const buttonHeight = 36;
  const messageHeight = message ? Math.min(100, Math.max(40, (message.length / 30) * 20)) : 0;
  const buttonsAreaHeight = buttons.length > 0 ? buttons.length * (buttonHeight + 6) : 0;
  const nodeHeight = Math.max(140, headerHeight + padding + messageHeight + buttonsAreaHeight + padding * 2);
  
  return (
    <>
      {/* Giriş handle (sol taraf) */}
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
          background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
          width: "260px",
          minHeight: `${nodeHeight}px`,
          boxShadow: "0 4px 12px rgba(155, 89, 182, 0.3)",
          borderColor: "#7d3c98",
          borderWidth: "3px",
        }}
      >
        {/* Başlık */}
        <div 
          className="border-solid border-b-2 py-3 px-4"
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            background: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center" style={{ width: "100%", marginBottom: "4px" }}>
            <FaUserCheck style={{ fontSize: "1.4em", color: "white", marginRight: "8px" }} />
            <span style={{ fontSize: "1.1em", color: "white", fontWeight: "700", letterSpacing: "0.5px" }}>
              {data.name || "Kullanıcı Görevi"}
            </span>
          </div>
          {assignedUser && (
            <div style={{ fontSize: "0.75em", color: "rgba(255, 255, 255, 0.9)", marginTop: "6px", marginLeft: "32px", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "4px" }}>👤</span>
              <span>{assignedUser}</span>
            </div>
          )}
        </div>
        
        {/* Mesaj */}
        {message && (
          <div className="py-3 px-4">
            <div
              style={{
                fontSize: "0.9em",
                color: "rgba(255, 255, 255, 0.95)",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              💬 {message}
            </div>
          </div>
        )}

        {/* Butonlar */}
        {buttons.length > 0 && (
          <div className="px-3 pb-3" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {buttons.map((button, index) => {
              const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
              const isApprove = button.action === "APPROVE";
              const isReject = button.action === "REJECT";
              
              return (
                <div
                  key={button.id || `button-${index}`}
                  style={{
                    background: isApprove 
                      ? "linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%)"
                      : isReject
                      ? "linear-gradient(135deg, rgba(244, 67, 54, 0.3) 0%, rgba(198, 40, 40, 0.3) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "0.85em",
                    color: "white",
                    fontWeight: "600",
                    textAlign: "center",
                    border: `2px solid ${isApprove ? "rgba(76, 175, 80, 0.6)" : isReject ? "rgba(244, 67, 54, 0.6)" : "rgba(255, 255, 255, 0.4)"}`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s",
                  }}
                >
                  <div>{buttonLabel}</div>
                  {button.action && (
                    <div style={{ fontSize: "0.7em", opacity: 0.85, marginTop: "4px", fontWeight: "400" }}>
                      {button.action}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Çıkış handle'ları - Görünür butonlar için handle */}
      {buttons.map((button, index) => {
        const buttonAction = button.action || `button-${button.id || index}`;
        const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
        
        // Handle'ları butonların ortasına hizala
        const messageAreaHeight = message ? messageHeight + padding : 0;
        const buttonsStartY = headerHeight + messageAreaHeight + padding;
        const buttonSpacing = buttonHeight + 6;
        const buttonCenterY = buttonsStartY + (index * buttonSpacing) + (buttonHeight / 2);
        const handleTopPercent = (buttonCenterY / nodeHeight) * 100;
        
        const isApprove = button.action === "APPROVE";
        const isReject = button.action === "REJECT";
        const handleColor = isApprove ? "#4caf50" : isReject ? "#f44336" : "#9b59b6";
        
        return (
          <Handle
            key={`handle-${button.id || index}`}
            id={buttonAction}
            type="source"
            position={Position.Right}
            style={{
              top: `${handleTopPercent}%`,
              right: "-12px",
              background: `linear-gradient(135deg, ${handleColor} 0%, ${isApprove ? "#388e3c" : isReject ? "#c62828" : "#8e44ad"} 100%)`,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: `0 2px 6px rgba(${isApprove ? "76, 175, 80" : isReject ? "244, 67, 54" : "155, 89, 182"}, 0.5)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "28px",
                top: "50%",
                transform: "translateY(-50%)",
                background: `linear-gradient(135deg, ${handleColor} 0%, ${isApprove ? "#388e3c" : isReject ? "#c62828" : "#8e44ad"} 100%)`,
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                pointerEvents: "none",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {buttonLabel}
            </div>
          </Handle>
        );
      })}
      
      {/* Çıkış handle (sağ taraf, ortada - buton yoksa) */}
      {buttons.length === 0 && (
        <Handle
          style={{
            top: "50%",
            right: "-12px",
            background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(155, 89, 182, 0.5)",
          }}
          type="source"
          position={Position.Right}
        />
      )}
    </>
  );
}

export default memo(UserTaskNode);

