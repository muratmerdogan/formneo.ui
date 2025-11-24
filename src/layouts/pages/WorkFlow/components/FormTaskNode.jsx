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
  const headerHeight = 80;
  const buttonHeight = 40;
  const padding = 16;
  const nodeHeight = Math.max(120, headerHeight + padding + buttonsForHandles.length * (buttonHeight + 8) + padding);
  
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
          backgroundColor: "#e67e22",
          width: "240px",
          minHeight: `${nodeHeight}px`,
        }}
      >
        {/* Başlık */}
        <div className="border-solid border-b-2 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center" style={{ flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <div className="flex items-center" style={{ width: "100%" }}>
              <FaTasks style={{ fontSize: "1.2em", color: "white", marginRight: "4px" }} />
              <span className="ml-2" style={{ fontSize: "1.1em", color: "white", fontWeight: "600" }}>
                {data.name || "Form Görevi"}
              </span>
            </div>
            {assignedUser && (
              <div style={{ fontSize: "0.75em", color: "rgba(255, 255, 255, 0.8)", marginTop: "4px", marginLeft: "24px" }}>
                👤 {assignedUser}
              </div>
            )}
            {totalFieldsCount > 0 && (
              <div style={{ fontSize: "0.7em", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px", marginLeft: "24px" }}>
                📋 {visibleFieldsCount}/{totalFieldsCount} alan görünür
              </div>
            )}
            {allButtons.length > 0 && (
              <div style={{ fontSize: "0.7em", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px", marginLeft: "24px" }}>
                🔘 {buttons.length} / {allButtons.length} buton görünür
              </div>
            )}
          </div>
        </div>
        
        {/* Form bilgisi */}
        <div className="py-2 px-3">
          <div
            style={{
              fontSize: "0.85em",
              color: "rgba(255, 255, 255, 0.8)",
              padding: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {data.formName || "Form"}
          </div>
        </div>

        {/* Butonlar */}
        {buttons.length > 0 && (
          <div className="py-2 px-2">
            {buttons.map((button, index) => {
              const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
              
              return (
                <div
                  key={button.id || `button-${index}`}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    fontSize: "0.85em",
                    color: "white",
                    fontWeight: "500",
                    textAlign: "center",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    marginBottom: "8px",
                  }}
                >
                  {buttonLabel}
                  {button.action && (
                    <div style={{ fontSize: "0.7em", opacity: 0.8, marginTop: "2px" }}>
                      ({button.action})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Çıkış handle'ları - Görünür butonlar için handle (node'un dışında) */}
      {buttonsForHandles.map((button, index) => {
        // Her buton için handle pozisyonunu hesapla
        const formInfoHeight = 60; // Form bilgisi yüksekliği
        const buttonSpacing = 8;
        
        // İlk butonun başlangıç pozisyonu (header + form info + padding)
        const firstButtonTop = headerHeight + padding + formInfoHeight + padding;
        // Her buton için top pozisyonu
        const buttonTop = firstButtonTop + index * (buttonHeight + buttonSpacing);
        // Handle butonun ortasında olmalı
        const handleTop = buttonTop + buttonHeight / 2;
        // Yüzde olarak hesapla
        const handleTopPercent = (handleTop / nodeHeight) * 100;
        
        const buttonAction = button.action || `button-${button.id || index}`;
        const buttonLabel = button.label || button.name || `Buton ${index + 1}`;
        
        return (
          <Handle
            key={`handle-${button.id || index}`}
            id={buttonAction}
            type="source"
            position={Position.Right}
            style={{
              top: `${handleTopPercent}%`,
              right: "-10px",
              background: "#e67e22",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#e67e22",
                color: "white",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                pointerEvents: "none",
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

