# Workflow Routing Mantığı - Action Koduna Göre Node Bulma

## 🎯 Problem
Workflow başlatılırken form butonuna basıldığında action kodu gönderiliyor. Backend'de bu action koduna göre hangi node'a gidileceğini nasıl bulacağız?

## 📋 Çözüm: Edge-Based Routing

### 1. Workflow Definition Yapısı

Workflow definition'da (`defination` JSON) şu yapı var:

```json
{
  "nodes": [
    {
      "id": "start-1",
      "type": "startNode",
      "data": { "name": "Başlangıç" }
    },
    {
      "id": "form-1",
      "type": "formNode",
      "data": {
        "name": "Onay Formu",
        "formId": "form-123",
        "buttons": [
          { "id": "btn-1", "label": "Onayla", "action": "APPROVE" },
          { "id": "btn-2", "label": "Reddet", "action": "REJECT" }
        ]
      }
    },
    {
      "id": "approver-1",
      "type": "approverNode",
      "data": { "name": "Onaylayıcı" }
    },
    {
      "id": "stop-1",
      "type": "stopNode",
      "data": { "name": "Dur" }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "start-1",
      "target": "form-1",
      "sourceHandle": null
    },
    {
      "id": "edge-2",
      "source": "form-1",
      "target": "approver-1",
      "sourceHandle": "APPROVE"  // ✅ Action kodu burada!
    },
    {
      "id": "edge-3",
      "source": "form-1",
      "target": "stop-1",
      "sourceHandle": "REJECT"  // ✅ Action kodu burada!
    }
  ]
}
```

### 2. Backend Routing Algoritması

```csharp
// C# Backend Örneği
public class WorkflowRoutingService
{
    /// <summary>
    /// Action koduna göre FormNode'dan çıkan edge'i bulur ve target node'a gider
    /// </summary>
    public string FindNextNodeByAction(
        WorkFlowDefination workflowDefinition,
        string formNodeId,
        string actionCode)
    {
        // 1. Workflow definition'ı parse et
        var definition = JsonSerializer.Deserialize<WorkflowDefinitionDto>(
            workflowDefinition.Defination);

        // 2. FormNode'u bul
        var formNode = definition.Nodes
            .FirstOrDefault(n => n.Id == formNodeId && n.Type == "formNode");

        if (formNode == null)
            throw new Exception($"FormNode bulunamadı: {formNodeId}");

        // 3. Action koduna göre edge'i bul
        // sourceHandle = action kodu olan edge'i bul
        var matchingEdge = definition.Edges
            .FirstOrDefault(e => 
                e.Source == formNodeId && 
                e.SourceHandle == actionCode.ToUpper());

        if (matchingEdge == null)
        {
            // Edge bulunamadı - varsayılan davranış veya hata
            throw new Exception(
                $"FormNode '{formNodeId}' için action '{actionCode}' ile bağlantı bulunamadı. " +
                $"Lütfen workflow tasarımcısında bu action için edge bağlantısı yapın.");
        }

        // 4. Target node'u döndür
        return matchingEdge.Target;
    }

    /// <summary>
    /// Workflow başlatıldığında action koduna göre ilk node'u bulur
    /// </summary>
    public string FindFirstNodeByAction(
        WorkFlowDefination workflowDefinition,
        string actionCode)
    {
        // 1. Workflow definition'ı parse et
        var definition = JsonSerializer.Deserialize<WorkflowDefinitionDto>(
            workflowDefinition.Defination);

        // 2. StartNode'u bul
        var startNode = definition.Nodes
            .FirstOrDefault(n => n.Type == "startNode");

        if (startNode == null)
            throw new Exception("StartNode bulunamadı");

        // 3. StartNode'dan çıkan edge'i bul (genelde tek edge olur)
        var startEdge = definition.Edges
            .FirstOrDefault(e => e.Source == startNode.Id);

        if (startEdge == null)
            throw new Exception("StartNode'dan çıkan edge bulunamadı");

        // 4. Target node FormNode olmalı
        var formNode = definition.Nodes
            .FirstOrDefault(n => n.Id == startEdge.Target && n.Type == "formNode");

        if (formNode == null)
            throw new Exception("StartNode'dan FormNode'a bağlantı bulunamadı");

        // 5. FormNode'dan action koduna göre edge'i bul
        return FindNextNodeByAction(workflowDefinition, formNode.Id, actionCode);
    }
}
```

### 3. JavaScript/TypeScript Örneği (Frontend için)

```typescript
/**
 * Action koduna göre FormNode'dan çıkan edge'i bulur ve target node'u döndürür
 */
function findNextNodeByAction(
  workflowDefinition: any,
  formNodeId: string,
  actionCode: string
): string | null {
  // 1. Workflow definition'ı parse et
  const definition = typeof workflowDefinition.defination === 'string'
    ? JSON.parse(workflowDefinition.defination)
    : workflowDefinition.defination;

  // 2. FormNode'u bul
  const formNode = definition.nodes?.find(
    (n: any) => n.id === formNodeId && n.type === 'formNode'
  );

  if (!formNode) {
    throw new Error(`FormNode bulunamadı: ${formNodeId}`);
  }

  // 3. Action kodunu normalize et (büyük harf)
  const normalizedAction = actionCode.trim().toUpperCase().replace(/\s+/g, '_');

  // 4. Action koduna göre edge'i bul
  // sourceHandle = action kodu olan edge'i bul
  const matchingEdge = definition.edges?.find(
    (e: any) =>
      e.source === formNodeId &&
      e.sourceHandle === normalizedAction
  );

  if (!matchingEdge) {
    // Edge bulunamadı - hata veya varsayılan davranış
    console.warn(
      `FormNode '${formNodeId}' için action '${normalizedAction}' ile bağlantı bulunamadı. ` +
      `Mevcut action'lar: ${formNode.data?.buttons?.map((b: any) => b.action).join(', ') || 'Yok'}`
    );
    return null;
  }

  // 5. Target node'u döndür
  return matchingEdge.target;
}

/**
 * Workflow başlatıldığında action koduna göre ilk node'u bulur
 */
function findFirstNodeByAction(
  workflowDefinition: any,
  actionCode: string
): string | null {
  // 1. Workflow definition'ı parse et
  const definition = typeof workflowDefinition.defination === 'string'
    ? JSON.parse(workflowDefinition.defination)
    : workflowDefinition.defination;

  // 2. StartNode'u bul
  const startNode = definition.nodes?.find(
    (n: any) => n.type === 'startNode'
  );

  if (!startNode) {
    throw new Error('StartNode bulunamadı');
  }

  // 3. StartNode'dan çıkan edge'i bul
  const startEdge = definition.edges?.find(
    (e: any) => e.source === startNode.id
  );

  if (!startEdge) {
    throw new Error('StartNode\'dan çıkan edge bulunamadı');
  }

  // 4. Target node FormNode olmalı
  const formNode = definition.nodes?.find(
    (n: any) => n.id === startEdge.target && n.type === 'formNode'
  );

  if (!formNode) {
    throw new Error('StartNode\'dan FormNode\'a bağlantı bulunamadı');
  }

  // 5. FormNode'dan action koduna göre edge'i bul
  return findNextNodeByAction(workflowDefinition, formNode.id, actionCode);
}
```

## 🔄 Workflow Başlatma Akışı

### Senaryo: "Onayla" Butonuna Tıklama

1. **Frontend'de:**
   ```typescript
   // WorkflowRuntime.tsx
   const handleButtonClick = async (button: FormButton) => {
     const actionCode = button.action; // "APPROVE"
     
     const startDto: WorkFlowStartApiDto = {
       definationId: workflowInstance.workflowId,
       userName: currentUser,
       workFlowInfo: JSON.stringify({ formData, buttonAction: actionCode }),
       action: actionCode, // ✅ Backend'e action kodu gönderiliyor
     };
     
     await workflowApi.apiWorkFlowStartPost(startDto);
   };
   ```

2. **Backend'de:**
   ```csharp
   // WorkFlowController.cs
   [HttpPost("Start")]
   public async Task<IActionResult> StartWorkflow([FromBody] WorkFlowStartApiDto dto)
   {
       // 1. Workflow definition'ı çek
       var workflowDef = await _workflowService.GetByIdAsync(dto.DefinationId);
       
       // 2. Action kodunu al
       var actionCode = dto.Action; // "APPROVE"
       
       // 3. Action koduna göre ilk node'u bul
       var nextNodeId = _routingService.FindFirstNodeByAction(workflowDef, actionCode);
       
       // 4. Workflow instance oluştur ve ilk node'a git
       var instance = await _workflowService.CreateInstanceAsync(
           workflowDef.Id,
           dto.UserName,
           nextNodeId, // ✅ Bulunan node ID'si
           dto.WorkFlowInfo
       );
       
       return Ok(instance);
   }
   ```

## ⚠️ Önemli Notlar

1. **Action Kod Normalizasyonu:**
   - Frontend'de action kodları normalize edilmeli (büyük harf, underscore)
   - Backend'de de aynı normalizasyon yapılmalı
   - Örnek: `"Approve"` → `"APPROVE"`, `"send back"` → `"SEND_BACK"`

2. **Edge Bulunamazsa:**
   - Hata mesajı gösterilmeli
   - Kullanıcıya workflow tasarımcısında edge bağlantısı yapması söylenmeli
   - Veya varsayılan bir node'a gidilebilir (ör: StopNode)

3. **FormNode Butonları:**
   - FormNode'daki butonların action kodları edge'lerdeki `sourceHandle` ile eşleşmeli
   - Eğer eşleşmezse routing çalışmaz

4. **Workflow Definition Güncelliği:**
   - Workflow definition her zaman güncel olmalı
   - Form butonları değiştiğinde workflow definition da güncellenmeli

## 📝 Örnek Kullanım

```typescript
// Backend'de workflow başlatma
const workflowDef = await getWorkflowDefinition(workflowId);
const actionCode = "APPROVE"; // Form butonundan gelen action

// Action koduna göre node bul
const nextNodeId = findFirstNodeByAction(workflowDef, actionCode);
// Sonuç: "approver-1"

// Workflow instance oluştur ve ilk node'a git
const instance = await createWorkflowInstance({
  workflowId: workflowDef.id,
  currentNodeId: nextNodeId,
  actionCode: actionCode
});
```

## ✅ Test Senaryoları

1. **Başarılı Routing:**
   - Action: "APPROVE"
   - FormNode → ApproverNode ✅

2. **Edge Bulunamazsa:**
   - Action: "UNKNOWN"
   - Hata: "Action 'UNKNOWN' için edge bulunamadı" ❌

3. **Çoklu FormNode:**
   - İlk FormNode'dan action'a göre routing yapılmalı
   - Diğer FormNode'lar runtime'da kullanılabilir

