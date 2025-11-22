import { message } from "antd";

export type AlertType = "info" | "success" | "warning" | "error";

export interface AlertNodeData {
  title?: string;
  message: string;
  type: AlertType;
}

/**
 * Workflow runtime'da AlertNode execute edildiğinde alert gösterir
 * @param alertData AlertNode'un data'sı
 */
export const showWorkflowAlert = (alertData: AlertNodeData) => {
  const { title, message: messageText, type } = alertData;

  // Ant Design message API kullanarak alert göster
  switch (type) {
    case "success":
      message.success(title ? `${title}: ${messageText}` : messageText, 5);
      break;
    case "error":
      message.error(title ? `${title}: ${messageText}` : messageText, 5);
      break;
    case "warning":
      message.warning(title ? `${title}: ${messageText}` : messageText, 5);
      break;
    case "info":
    default:
      message.info(title ? `${title}: ${messageText}` : messageText, 5);
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

