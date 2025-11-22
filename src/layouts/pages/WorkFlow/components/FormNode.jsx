import React, { memo } from "react";
import { Handle, Position, useNodeId } from "reactflow";
import { FaWpforms } from "react-icons/fa";

function FormNode({ data = { name: "Form", buttons: [] } }) {
  const nodeId = useNodeId();
  const buttons = data?.buttons || [];
  
  // Node yüksekliğini buton sayısına göre ayarla
  const nodeHeight = Math.max(80, 60 + buttons.length * 40);
  
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
          backgroundColor: "#4a90e2",
          width: "220px",
          minHeight: `${nodeHeight}px`,
        }}
      >
        {/* Başlık */}
        <div className="border-solid border-b-2 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaWpforms style={{ fontSize: "1.2em", color: "white", marginRight: "4px" }} />
            <span className="ml-2" style={{ fontSize: "1.1em", color: "white", fontWeight: "600" }}>
              {data.name || "Form"}
            </span>
          </div>
        </div>
        
        {/* Butonlar ve çıkış handle'ları */}
        <div className="py-2 px-2">
          {buttons.length > 0 ? (
            buttons.map((button, index) => {
              const totalButtons = buttons.length;
              // Her buton için handle pozisyonunu hesapla
              // Başlık yüksekliği: ~60px, her buton yüksekliği: ~40px, padding: 16px
              const headerHeight = 60;
              const buttonHeight = 40;
              const padding = 16;
              const spacing = 8;
              
              // İlk butonun başlangıç pozisyonu
              const firstButtonTop = headerHeight + padding;
              // Her buton için top pozisyonu
              const buttonTop = firstButtonTop + index * (buttonHeight + spacing);
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
                      background: "#4a90e2",
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
    </>
  );
}

export default memo(FormNode);

