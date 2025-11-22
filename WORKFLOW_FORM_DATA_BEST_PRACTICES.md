# Workflow'da Form Verilerinin Kaydedilmesi - Best Practices

## 🎯 Senaryo: Form'da 4 Buton Var

Örnek form:
- **Onayla** (action: `APPROVE`)
- **Reddet** (action: `REJECT`)
- **Geri Gönder** (action: `SENDBACK`)
- **İncele** (action: `REVIEW`)

## 📋 Best Practice: Form Verilerinin Kaydedilmesi

### ❌ YANLIŞ Yaklaşım: FormNode İçinde Kaydetme

```javascript
// ❌ FormNode içinde direkt kaydetme - YANLIŞ
FormNode {
  onButtonClick: (button) => {
    // Form verilerini direkt kaydet
    saveFormData(formData);
  }
}
```

**Sorunlar:**
- FormNode sadece başlangıç noktası olmalı
- Veri kaydetme mantığı FormNode'a karışmamalı
- Her buton için farklı işlem yapılamaz
- Workflow mantığı bozulur

### ✅ DOĞRU Yaklaşım: Ayrı Node'larda Kaydetme

```javascript
// ✅ Her buton için ayrı branch ve kaydetme node'u
StartNode
  └─ FormNode (Form başlat)
      ├─ APPROVE → FormDataNode (Kaydet) → ApproverNode
      ├─ REJECT → FormDataNode (Kaydet) → StopNode
      ├─ SENDBACK → FormDataNode (Kaydet) → SetFieldNode
      └─ REVIEW → FormDataNode (Kaydet) → ReviewerNode
```

## 🏗️ Önerilen Workflow Yapısı

### Senaryo 1: Her Buton İçin Ayrı Kaydetme (Önerilen) ⭐

```
StartNode
  └─ FormNode
      ├─ APPROVE → FormDataNode (status: "approved") → ApproverNode
      ├─ REJECT → FormDataNode (status: "rejected") → StopNode
      ├─ SENDBACK → FormDataNode (status: "sent_back") → SetFieldNode
      └─ REVIEW → FormDataNode (status: "review") → ReviewerNode
```

**Avantajları:**
- ✅ Her buton için farklı durum kaydedilebilir
- ✅ Esnek ve genişletilebilir
- ✅ Her branch bağımsız çalışır
- ✅ Daha iyi audit trail

### Senaryo 2: Ortak Kaydetme Node'u

```
StartNode
  └─ FormNode
      ├─ APPROVE → FormDataNode (Ortak Kaydet) → ApproverNode
      ├─ REJECT → FormDataNode (Ortak Kaydet) → StopNode
      ├─ SENDBACK → FormDataNode (Ortak Kaydet) → SetFieldNode
      └─ REVIEW → FormDataNode (Ortak Kaydet) → ReviewerNode
```

**Avantajları:**
- ✅ Daha az node
- ✅ Tek bir kaydetme mantığı
- ✅ Daha kolay bakım

**Dezavantajları:**
- ⚠️ Her buton için farklı durum ayarlanamaz
- ⚠️ Daha az esnek

## 🔧 Gerekli Component'ler

### 1. FormDataNode (Yeni Component Gerekli) ⭐

**Amaç:** Form verilerini workflow instance'ına kaydetmek

**Özellikler:**
- Form verilerini alır
- Workflow instance'ına kaydeder
- Durum bilgisi ekler (status, action code)
- Timestamp ekler
- Kullanıcı bilgisi ekler

**Örnek Yapı:**
```typescript
interface FormDataNodeData {
  formId: string;
  formData: Record<string, any>;
  actionCode: string; // APPROVE, REJECT, vb.
  status: string; // approved, rejected, sent_back, review
  userId: string;
  timestamp: string;
  workflowInstanceId: string;
}
```

### 2. SetFieldNode (Mevcut - Güncellenebilir)

**Amaç:** Form alanlarını güncellemek

**Kullanım:**
- Form verilerini kaydettikten sonra alanları güncellemek için
- Durum değişiklikleri için
- Koşullu güncellemeler için

### 3. FormStopNode (Mevcut)

**Amaç:** Workflow'u sonlandırmak

**Kullanım:**
- Form işlemi tamamlandığında
- Reddedildiğinde
- İptal edildiğinde

## 📐 Önerilen Workflow Yapısı (4 Butonlu Form)

### Detaylı Yapı:

```
StartNode
  └─ FormNode (Form başlat, 4 çıkış)
      │
      ├─ [APPROVE] → FormDataNode
      │                ├─ formData: {...}
      │                ├─ actionCode: "APPROVE"
      │                ├─ status: "approved"
      │                └─ workflowInstanceId: "..."
      │              └─ ApproverNode (Onaylayıcıya gönder)
      │                  └─ ApproverNode (İkinci seviye)
      │                      └─ FormStopNode (Tamamlandı)
      │
      ├─ [REJECT] → FormDataNode
      │               ├─ formData: {...}
      │               ├─ actionCode: "REJECT"
      │               ├─ status: "rejected"
      │               └─ workflowInstanceId: "..."
      │             └─ FormStopNode (Reddedildi - Workflow sonlandı)
      │
      ├─ [SENDBACK] → FormDataNode
      │                 ├─ formData: {...}
      │                 ├─ actionCode: "SENDBACK"
      │                 ├─ status: "sent_back"
      │                 └─ workflowInstanceId: "..."
      │               └─ SetFieldNode
      │                   ├─ status: "pending"
      │                   └─ assignedTo: originalUser
      │               └─ FormNode (Tekrar form göster)
      │
      └─ [REVIEW] → FormDataNode
                      ├─ formData: {...}
                      ├─ actionCode: "REVIEW"
                      ├─ status: "under_review"
                      └─ workflowInstanceId: "..."
                    └─ ReviewerNode (İnceleyiciye gönder)
                        └─ QueryConditionNode
                            ├─ IF reviewResult == "approve" → ApproverNode
                            └─ ELSE → FormStopNode
```

## 💾 Veri Kaydetme Stratejileri

### Strateji 1: Workflow Instance'ında Saklama (Önerilen) ⭐

**Nasıl Çalışır:**
- Form verileri workflow instance'ına kaydedilir
- Her node çalıştığında veriler güncellenir
- Workflow instance'ı tüm geçmişi tutar

**Avantajları:**
- ✅ Audit trail tam
- ✅ Veri kaybı riski düşük
- ✅ Workflow durumu takip edilebilir
- ✅ Rollback mümkün

**Örnek Yapı:**
```typescript
interface WorkflowInstance {
  id: string;
  workflowId: string;
  formId: string;
  formData: Record<string, any>;
  currentStep: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent_back' | 'review';
  history: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  nodeId: string;
  nodeType: string;
  actionCode?: string;
  formData?: Record<string, any>;
  userId: string;
  timestamp: string;
  status: string;
}
```

### Strateji 2: Ayrı Form Submission Tablosu

**Nasıl Çalışır:**
- Form verileri ayrı bir tabloda saklanır
- Workflow instance sadece referans tutar
- Her buton için ayrı submission oluşturulur

**Avantajları:**
- ✅ Form verileri bağımsız
- ✅ Birden fazla submission mümkün
- ✅ Form geçmişi tutulur

**Dezavantajları:**
- ⚠️ İki tablo senkronizasyonu gerekir
- ⚠️ Daha karmaşık

## 🎯 Önerilen Implementasyon

### 1. FormDataNode Component'i Oluştur

```typescript
// components/FormDataNode.tsx
interface FormDataNodeData {
  formId: string;
  actionCode: string;
  status: string;
  saveMode: 'create' | 'update';
  fieldsToSave?: string[]; // Belirli alanları kaydet
}

// Form verilerini workflow instance'ına kaydet
const saveFormData = async (
  workflowInstanceId: string,
  formData: Record<string, any>,
  actionCode: string,
  status: string
) => {
  // Workflow instance'ı güncelle
  await updateWorkflowInstance(workflowInstanceId, {
    formData,
    currentStep: actionCode,
    status,
    lastAction: actionCode,
    updatedAt: new Date().toISOString()
  });
  
  // Geçmişe ekle
  await addWorkflowHistory(workflowInstanceId, {
    nodeType: 'formDataNode',
    actionCode,
    formData,
    timestamp: new Date().toISOString()
  });
};
```

### 2. FormNode'dan FormDataNode'a Geçiş

```javascript
// Workflow runtime'da
const handleFormButtonClick = async (button, formData) => {
  const actionCode = button.action; // APPROVE, REJECT, vb.
  
  // FormDataNode'a git
  const formDataNode = findNodeByActionCode(actionCode);
  
  // Form verilerini kaydet
  await saveFormData(
    workflowInstanceId,
    formData,
    actionCode,
    getStatusByActionCode(actionCode)
  );
  
  // Sonraki node'a geç
  executeNextNode(formDataNode);
};
```

### 3. Workflow Yapısı

```javascript
// Workflow definition'da
{
  nodes: [
    { id: "start", type: "startNode" },
    { id: "form", type: "formNode", data: { formId: "...", buttons: [...] } },
    { id: "save-approve", type: "formDataNode", data: { actionCode: "APPROVE", status: "approved" } },
    { id: "save-reject", type: "formDataNode", data: { actionCode: "REJECT", status: "rejected" } },
    { id: "save-sendback", type: "formDataNode", data: { actionCode: "SENDBACK", status: "sent_back" } },
    { id: "save-review", type: "formDataNode", data: { actionCode: "REVIEW", status: "under_review" } },
    // ...
  ],
  edges: [
    { source: "start", target: "form" },
    { source: "form", target: "save-approve", sourceHandle: "APPROVE" },
    { source: "form", target: "save-reject", sourceHandle: "REJECT" },
    { source: "form", target: "save-sendback", sourceHandle: "SENDBACK" },
    { source: "form", target: "save-review", sourceHandle: "REVIEW" },
    // ...
  ]
}
```

## 🔄 Veri Akışı

### Senaryo: Onayla Butonuna Tıklama

1. **Kullanıcı Formu Doldurur**
   ```javascript
   formData = {
     name: "John Doe",
     amount: 10000,
     description: "İzin talebi"
   }
   ```

2. **Onayla Butonuna Tıklar**
   ```javascript
   button = { id: "btn-1", label: "Onayla", action: "APPROVE" }
   ```

3. **FormNode → FormDataNode**
   ```javascript
   // FormDataNode çalışır
   await saveFormData(workflowInstanceId, formData, "APPROVE", "approved");
   ```

4. **Workflow Instance Güncellenir**
   ```javascript
   workflowInstance = {
     id: "instance-123",
     formData: { name: "John Doe", amount: 10000, ... },
     status: "approved",
     currentStep: "APPROVE",
     lastAction: "APPROVE",
     updatedAt: "2025-01-20T10:30:00Z"
   }
   ```

5. **Sonraki Node'a Geç**
   ```javascript
   // ApproverNode çalışır
   // Onaylayıcıya bildirim gönderilir
   ```

## 📝 Özet: Ne Yapılmalı?

### ✅ YAPILMASI GEREKENLER:

1. **FormDataNode Component'i Oluştur**
   - Form verilerini workflow instance'ına kaydet
   - Action code ve status bilgisi ekle
   - Timestamp ve kullanıcı bilgisi ekle

2. **Workflow Yapısını Düzenle**
   - FormNode'dan sonra her buton için FormDataNode ekle
   - Her FormDataNode farklı action code ve status ile yapılandır

3. **Runtime'da Veri Kaydetme**
   - Form butonuna tıklandığında action code'u al
   - FormDataNode'u bul ve çalıştır
   - Form verilerini kaydet

4. **Workflow Instance Yönetimi**
   - Workflow instance oluştur
   - Form verilerini instance'a kaydet
   - Her adımda instance'ı güncelle

### ❌ YAPILMAMASI GEREKENLER:

1. **FormNode İçinde Kaydetme**
   - FormNode sadece başlangıç noktası
   - Veri kaydetme mantığı FormNode'a karışmamalı

2. **Her Buton İçin Ayrı Form Submission**
   - Tek bir workflow instance kullan
   - Her buton için yeni submission oluşturma

3. **Form Verilerini Workflow Definition'da Saklama**
   - Workflow definition statik olmalı
   - Form verileri instance'da saklanmalı

## 🎯 Sonuç

**Best Practice:**
- ✅ FormNode sadece form başlatır
- ✅ Her buton için ayrı FormDataNode kullan
- ✅ Form verileri workflow instance'ında saklanır
- ✅ Her FormDataNode farklı action code ve status ile yapılandırılır
- ✅ Workflow instance tüm geçmişi tutar

Bu yaklaşım ile:
- ✅ Daha esnek sistem
- ✅ Daha iyi audit trail
- ✅ Daha kolay bakım
- ✅ Daha güvenli veri yönetimi

