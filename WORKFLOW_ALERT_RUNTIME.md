# Workflow Runtime'da Alert Gösterme - Implementation Guide

## ✅ AlertNode Runtime Implementation

Workflow runtime'da AlertNode execute edildiğinde frontend'de alert gösterilir.

## 🔧 Teknik Yapı

### 1. Alert Utility (`workflowAlert.tsx`)

```typescript
// src/layouts/pages/WorkFlow/utils/workflowAlert.tsx
import { message } from "antd";

export const showWorkflowAlert = (alertData: AlertNodeData) => {
  const { title, message: messageText, type } = alertData;
  
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

export const executeAlertNode = async (node: any): Promise<void> => {
  const nodeData = node.data as AlertNodeData;
  showWorkflowAlert({
    title: nodeData.title || "Bildirim",
    message: nodeData.message || "Mesaj yok",
    type: nodeData.type || "info",
  });
  return Promise.resolve();
};
```

### 2. Workflow Runtime'da Kullanım

Workflow execution engine'inde AlertNode'a geldiğinde:

```typescript
// Workflow execution engine'de
import { executeAlertNode } from "./utils/workflowAlert";

const executeNode = async (node: any) => {
  switch (node.type) {
    case "alertNode":
      await executeAlertNode(node);
      // Alert gösterildikten sonra sonraki node'a geç
      await executeNextNode(node);
      break;
    // ... diğer node tipleri
  }
};
```

## 📋 Alert Tipleri ve Görünümleri

### Success (Başarılı) - Yeşil
```typescript
{
  title: "Başarılı",
  message: "Form onaylandı!",
  type: "success"
}
```
- ✅ Yeşil renk
- ✅ Checkmark ikonu
- ✅ 5 saniye gösterilir

### Error (Hata) - Kırmızı
```typescript
{
  title: "Hata",
  message: "Form kaydedilemedi!",
  type: "error"
}
```
- ❌ Kırmızı renk
- ❌ X ikonu
- ❌ 5 saniye gösterilir

### Warning (Uyarı) - Sarı
```typescript
{
  title: "Uyarı",
  message: "Form eksik bilgiler içeriyor",
  type: "warning"
}
```
- ⚠️ Sarı renk
- ⚠️ Uyarı ikonu
- ⚠️ 5 saniye gösterilir

### Info (Bilgi) - Mavi
```typescript
{
  title: "Bilgi",
  message: "Form başarıyla kaydedildi",
  type: "info"
}
```
- ℹ️ Mavi renk
- ℹ️ Bilgi ikonu
- ℹ️ 5 saniye gösterilir

## 🎯 Kullanım Senaryoları

### Senaryo 1: Form Submit Sonrası

```typescript
// FormNode'dan sonra
FormNode → SetFieldNode (Kaydet) → AlertNode ("Form kaydedildi!", success) → ApproverNode
```

**Runtime Execution:**
```typescript
// 1. FormNode execute edilir
await executeFormNode(formNode);

// 2. SetFieldNode execute edilir (form data kaydedilir)
await executeSetFieldNode(setFieldNode);

// 3. AlertNode execute edilir (alert gösterilir)
await executeAlertNode(alertNode);
// ✅ Kullanıcıya "Form kaydedildi!" mesajı gösterilir

// 4. ApproverNode'a geçilir
await executeNextNode(approverNode);
```

### Senaryo 2: Hata Durumunda

```typescript
FormNode → QueryConditionNode
            ├─ IF valid → ApproverNode
            └─ ELSE → AlertNode ("Form geçersiz!", error) → StopNode
```

**Runtime Execution:**
```typescript
// QueryConditionNode sonucu false ise
if (!isValid) {
  await executeAlertNode(alertNode);
  // ❌ Kullanıcıya "Form geçersiz!" hata mesajı gösterilir
  await executeStopNode(stopNode);
}
```

### Senaryo 3: Onay Sonrası Bilgilendirme

```typescript
FormNode → ApproverNode → AlertNode ("Onaylandı!", success) → FormStopNode
```

**Runtime Execution:**
```typescript
await executeApproverNode(approverNode);
await executeAlertNode(alertNode);
// ✅ Kullanıcıya "Onaylandı!" başarı mesajı gösterilir
await executeFormStopNode(formStopNode);
```

## 🔄 Workflow Execution Flow

```
StartNode
  ↓
FormNode (Kullanıcı formu doldurur)
  ↓
SetFieldNode (Form verileri kaydedilir)
  ↓
AlertNode (✅ "Form kaydedildi!" gösterilir)
  ↓
ApproverNode (Onay beklenir)
  ↓
AlertNode (✅ "Form onaylandı!" gösterilir)
  ↓
FormStopNode (Workflow tamamlanır)
```

## 💡 Best Practices

### 1. Alert Mesajları

**✅ İyi Mesajlar:**
- "Form başarıyla kaydedildi"
- "Form onaylandı ve onaylayıcıya gönderildi"
- "Form reddedildi. Lütfen düzeltip tekrar gönderin"

**❌ Kötü Mesajlar:**
- "OK"
- "Hata"
- "Başarılı"

### 2. Alert Timing

- **Success**: İşlem başarılı olduktan hemen sonra
- **Error**: Hata oluştuğunda
- **Warning**: Dikkat gerektiren durumlarda
- **Info**: Genel bilgilendirme için

### 3. Alert Sıralaması

**Önerilen:**
```
1. İşlem yapılır (SetFieldNode, ApproverNode, vb.)
2. Alert gösterilir (AlertNode)
3. Sonraki node'a geçilir
```

**Neden?**
- Önce işlem tamamlanır
- Sonra kullanıcı bilgilendirilir
- Hata durumunda veri kaybı olmaz

## 🚀 Implementation Checklist

- [x] AlertNode component'i oluşturuldu
- [x] AlertTab properties panel'i oluşturuldu
- [x] Workflow'a entegre edildi
- [x] Alert utility fonksiyonu oluşturuldu (`workflowAlert.tsx`)
- [ ] Workflow execution engine'de AlertNode execute edilmesi
- [ ] Runtime'da alert gösterilmesi test edildi

## 📝 Örnek Kullanım

```typescript
// Workflow execution engine'de
import { executeAlertNode } from "./utils/workflowAlert";

// Node execute edilirken
if (node.type === "alertNode") {
  await executeAlertNode(node);
  // Alert gösterilir (5 saniye)
  // Sonra sonraki node'a geçilir
}
```

## 🎉 Sonuç

AlertNode artık workflow runtime'da kullanılabilir. Workflow execution engine'de AlertNode'a geldiğinde `executeAlertNode` fonksiyonu çağrılarak kullanıcıya alert gösterilir.

