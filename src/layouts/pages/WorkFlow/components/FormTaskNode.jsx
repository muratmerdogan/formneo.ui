import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaTasks } from "react-icons/fa";

function FormTaskNode({ data = { name: "Form Görevi", assignedUserName: "", visibleFieldsCount: 0, totalFieldsCount: 0, buttons: [], allButtons: [] } }) {
  const nodeId = useNodeId();
  const assignedUser = data?.assignedUserName || data?.userName || "";
  const visibleFieldsCount = data?.visibleFieldsCount || 0;
  const totalFieldsCount = data?.totalFieldsCount || 0;
  const buttons = data?.buttons || []; // Görünür butonlar (gösterim ve handle'lar için)
  const allButtons = data?.allButtons || []; // TÜM butonlar (sadece bilgi için)
  
  // Handle'lar için görünür butonları kullan (buttons array'i görünürlük ayarlarına göre güncelleniyor)
  const buttonsForHandles = buttons.length > 0 ? buttons : (allButtons.length > 0 ? allButtons : []);
  
  // Node yüksekliğini görünür buton sayısına göre ayarla
  const headerHeight = 90;
  const buttonHeight = 36;
  const padding = 16;
  const formInfoHeight = 50;
  const buttonsAreaHeight = buttonsForHandles.length > 0 ? buttonsForHandles.length * (buttonHeight + 6) : 0;
  const nodeHeight = Math.max(140, headerHeight + formInfoHeight + buttonsAreaHeight + padding * 2);
  
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
          background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
          width: "260px",
          minHeight: `${nodeHeight}px`,
          boxShadow: "0 4px 12px rgba(230, 126, 34, 0.3)",
          borderColor: "#c0392b",
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
            <FaTasks style={{ fontSize: "1.4em", color: "white", marginRight: "8px" }} />
            <span style={{ fontSize: "1.1em", color: "white", fontWeight: "700", letterSpacing: "0.5px" }}>
              {data.name || "Form Görevi"}
            </span>
          </div>
          {assignedUser && (
            <div style={{ fontSize: "0.75em", color: "rgba(255, 255, 255, 0.9)", marginTop: "6px", marginLeft: "32px", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "4px" }}>👤</span>
              <span>{assignedUser}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "8px", marginTop: "6px", marginLeft: "32px", flexWrap: "wrap" }}>
            {totalFieldsCount > 0 && (
              <div style={{ fontSize: "0.7em", color: "rgba(255, 255, 255, 0.85)", background: "rgba(255, 255, 255, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                📋 {visibleFieldsCount}/{totalFieldsCount}
              </div>
            )}
            {allButtons.length > 0 && (
              <div style={{ fontSize: "0.7em", color: "rgba(255, 255, 255, 0.85)", background: "rgba(255, 255, 255, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                🔘 {buttons.length}/{allButtons.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Form bilgisi */}
        <div className="py-3 px-4">
          <div
            style={{
              fontSize: "0.9em",
              color: "rgba(255, 255, 255, 0.95)",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "600",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            📄 {data.formName || "Form"}
          </div>
        </div>

        {/* Butonlar */}
        {buttons.length > 0 && (
          <div className="px-3 pb-3" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {buttons.map((button, index) => {
              const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
              
              return (
                <div
                  key={button.id || `button-${index}`}
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "0.85em",
                    color: "white",
                    fontWeight: "600",
                    textAlign: "center",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
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
      
      {/* Çıkış handle'ları - Görünür butonlar için handle (node'un dışında, ortalanmış) */}
      {buttonsForHandles.map((button, index) => {
        const buttonAction = button.action || `button-${button.id || index}`;
        const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
        
        // Handle'ları butonların ortasına hizala
        const buttonSpacing = buttonHeight + 6;
        const buttonsStartY = headerHeight + formInfoHeight + padding;
        const buttonCenterY = buttonsStartY + (index * buttonSpacing) + (buttonHeight / 2);
        const handleTopPercent = (buttonCenterY / nodeHeight) * 100;
        
        return (
          <Handle
            key={`handle-${button.id || index}`}
            id={buttonAction}
            type="source"
            position={Position.Right}
            style={{
              top: `${handleTopPercent}%`,
              right: "-12px",
              background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 2px 6px rgba(230, 126, 34, 0.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "28px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
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
      
      {/* Çıkış handle (sağ taraf, alt kısım - buton yoksa) */}
      {buttonsForHandles.length === 0 && (
        <Handle
          style={{
            top: "calc(100% - 10px)",
            right: "-10px",
            background: "#555",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          }}
          type="source"
          position={Position.Right}
        />
      )}
    </>
  );
}

export default memo(FormTaskNode);

