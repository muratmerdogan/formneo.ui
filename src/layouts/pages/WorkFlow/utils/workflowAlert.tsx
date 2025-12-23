import { notification } from "antd";

export type AlertType = "info" | "success" | "warning" | "error";

export interface AlertNodeData {
  title?: string;
  message: string;
  type: AlertType;
}

/**
 * Workflow runtime'da AlertNode execute edildiğinde alert gösterir
 * Toast notification olarak daha belirgin gösterir
 * @param alertData AlertNode'un data'sı
 */
export const showWorkflowAlert = (alertData: AlertNodeData) => {
  const { title, message: messageText, type } = alertData;

  // Ant Design notification API kullanarak belirgin toast göster
  const notificationConfig = {
    message: title || "Bildirim",
    description: messageText,
    duration: type === "error" ? 0 : 6, // Hata mesajları kapanmaz, diğerleri 6 saniye
    placement: "topRight" as const,
    style: {
      marginTop: 20,
    },
  };

  switch (type) {
    case "success":
      notification.success({
        ...notificationConfig,
        message: title || "Başarılı",
        style: {
          ...notificationConfig.style,
          borderLeft: "4px solid #52c41a",
        },
      });
      break;
    case "error":
      notification.error({
        ...notificationConfig,
        message: title || "Hata",
        duration: 0, // Hata mesajları kapanmaz, kullanıcı manuel kapatmalı
        style: {
          ...notificationConfig.style,
          borderLeft: "4px solid #ff4d4f",
        },
      });
      break;
    case "warning":
      notification.warning({
        ...notificationConfig,
        message: title || "Uyarı",
        style: {
          ...notificationConfig.style,
          borderLeft: "4px solid #faad14",
        },
      });
      break;
    case "info":
    default:
      notification.info({
        ...notificationConfig,
        message: title || "Bildirim",
        style: {
          ...notificationConfig.style,
          borderLeft: "4px solid #1890ff",
        },
      });
      break;
  }
};

/**
 * Workflow execution sırasında AlertNode'u execute eder
 * @param node AlertNode
 * @returns Promise<void>
 */
export const executeAlertNode = async (node: any): Promise<void> => {
  const nodeData = node.data as AlertNodeData;
  
  if (!nodeData) {
    console.warn("AlertNode data bulunamadı:", node);
    return;
  }

  // Alert göster
  showWorkflowAlert({
    title: nodeData.title || "Bildirim",
    message: nodeData.message || "Mesaj yok",
    type: nodeData.type || "info",
  });

  // Alert gösterildikten sonra workflow devam eder
  // Bu fonksiyon async olduğu için sonraki node'a geçiş yapılabilir
  return Promise.resolve();
};

