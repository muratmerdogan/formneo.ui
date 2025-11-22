import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaUserCheck } from "react-icons/fa";

function UserTaskNode({ data = { name: "Kullanıcı Görevi", fields: [], buttons: [], assignedUserName: "" } }) {
  const nodeId = useNodeId();
  const fields = data?.fields || [];
  const buttons = data?.buttons || [];
  const assignedUser = data?.assignedUserName || data?.userName || "";
  
  // Node yüksekliğini alan ve buton sayısına göre ayarla
  const fieldsHeight = fields.length * 35; // Her alan ~35px
  const buttonsHeight = buttons.length * 40; // Her buton ~40px
  const headerHeight = 60;
  const padding = 16;
  const nodeHeight = Math.max(120, headerHeight + padding + fieldsHeight + buttonsHeight + padding);
  
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
          backgroundColor: "#9b59b6",
          width: "240px",
          minHeight: `${nodeHeight}px`,
        }}
      >
        {/* Başlık */}
        <div className="border-solid border-b-2 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center" style={{ flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <div className="flex items-center" style={{ width: "100%" }}>
              <FaUserCheck style={{ fontSize: "1.2em", color: "white", marginRight: "4px" }} />
              <span className="ml-2" style={{ fontSize: "1.1em", color: "white", fontWeight: "600" }}>
                {data.name || "Kullanıcı Görevi"}
              </span>
            </div>
            {assignedUser && (
              <div style={{ fontSize: "0.75em", color: "rgba(255, 255, 255, 0.8)", marginTop: "4px", marginLeft: "24px" }}>
                👤 {assignedUser}
              </div>
            )}
          </div>
        </div>
        
        {/* Alanlar (Fields) */}
        {fields.length > 0 && (
          <div className="py-2 px-3" style={{ borderBottom: fields.length > 0 && buttons.length > 0 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
            {fields.map((field, index) => (
              <div
                key={field.id || index}
                style={{
                  marginBottom: "8px",
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75em",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "2px",
                  }}
                >
                  {field.label || field.name || `Alan ${index + 1}`}:
                </div>
                <div
                  style={{
                    fontSize: "0.9em",
                    color: "white",
                    fontWeight: "500",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {field.value || field.displayValue || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Butonlar ve çıkış handle'ları */}
        <div className="py-2 px-2">
          {buttons.length > 0 ? (
            buttons.map((button, index) => {
              // Her buton için handle pozisyonunu hesapla
              const headerAndFieldsHeight = headerHeight + padding + fieldsHeight;
              const buttonHeight = 40;
              const buttonSpacing = 8;
              
              // İlk butonun başlangıç pozisyonu
              const firstButtonTop = headerAndFieldsHeight + padding;
              // Her buton için top pozisyonu
              const buttonTop = firstButtonTop + index * (buttonHeight + buttonSpacing);
              // Handle butonun ortasında olmalı
              const handleTop = buttonTop + buttonHeight / 2;
              // Yüzde olarak hesapla
              const handleTopPercent = (handleTop / nodeHeight) * 100;
              
              return (
                <div key={button.id || index} style={{ position: "relative", marginBottom: "8px" }}>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      fontSize: "0.85em",
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {button.label || button.name || `Buton ${index + 1}`}
                  </div>
                  {/* Çıkış handle (sağ taraf, her buton için) */}
                  <Handle
                    id={button.action || `button-${button.id || index}`}
                    type="source"
                    position={Position.Right}
                    style={{
                      top: `${handleTopPercent}%`,
                      right: "-10px",
                      background: "#9b59b6",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: "8px",
                fontSize: "0.85em",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Buton yok
            </div>
          )}
        </div>
      </div>
      
      {/* Çıkış handle (sağ taraf, alt kısım - varsayılan) */}
      {buttons.length === 0 && (
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

export default memo(UserTaskNode);

