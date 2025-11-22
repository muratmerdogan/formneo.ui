# Workflow Koşul (Condition) Yapısı - Best Practices

## 🎯 n8n'in Koşul Yaklaşımı

n8n'de koşullar şu şekilde çalışır:

### 1. **Expression-Based Koşullar**
```javascript
// n8n IF node'unda
{{ $json.fieldName }} === "value"
{{ $json.amount }} > 1000
{{ $json.status }} === "approved" && {{ $json.amount }} < 5000
```

### 2. **Önceki Node'lardan Veri Erişimi**
```javascript
// Önceki node'un output'una erişim
{{ $json.fieldName }}           // Mevcut node'un output'u
{{ $('PreviousNode').json.fieldName }}  // Belirli bir node'un output'u
{{ $workflow.formData.fieldName }}      // Workflow context'inden
```

### 3. **JSON Path ile Veri Erişimi**
```javascript
{{ $json.user.name }}
{{ $json.items[0].price }}
{{ $json.metadata.status }}
```

## 📋 Mevcut Yapımız

### QueryConditionNode (Mevcut)
- ✅ React Query Builder kullanıyor
- ✅ Form field'larına göre koşul oluşturuyor
- ✅ JSONLogic formatında kaydediliyor
- ❌ Sadece form field'larına erişiyor
- ❌ Önceki node'lardan veri alamıyor

### SqlConditionNode (Mevcut)
- ✅ SQL sorgusu ile koşul
- ❌ Backend'e bağımlı
- ❌ Frontend'de test edilemez

## 💡 Önerilen Koşul Yapısı

### Yaklaşım 1: Expression-Based (n8n Tarzı) ⭐ ÖNERİLEN

```typescript
interface ConditionNode {
  type: "expression";
  expression: string; // JavaScript benzeri expression
  // Örnek: "formData.amount > 1000 && formData.status === 'pending'"
}
```

**Avantajları:**
- ✅ Esnek ve güçlü
- ✅ n8n ile benzer syntax
- ✅ Önceki node'lardan veri alabilir
- ✅ Workflow context'ine erişebilir

**Örnek Kullanım:**
```javascript
// FormNode'dan sonra
formData.amount > 1000 && formData.status === "pending"

// UserTaskNode'dan sonra
previousNode.action === "APPROVE" && workflowData.formData.amount < 5000

// SetFieldNode'dan sonra
updatedFields.status === "approved"
```

### Yaklaşım 2: Rule-Based (Mevcut QueryConditionNode Geliştirilmiş)

```typescript
interface ConditionNode {
  type: "rule";
  rules: RuleGroupType; // React Query Builder formatı
  dataSource: "formData" | "previousNode" | "workflowData" | "custom";
  dataPath?: string; // JSON path: "formData.user.name"
}
```

**Avantajları:**
- ✅ Visual query builder
- ✅ Form field'ları için kolay
- ✅ Kullanıcı dostu

**Geliştirmeler:**
- Önceki node'lardan veri seçimi
- Workflow context'inden veri seçimi
- JSON path desteği

### Yaklaşım 3: Hybrid (Her İkisi Birden) ⭐ EN İYİSİ

```typescript
interface ConditionNode {
  type: "hybrid";
  mode: "simple" | "advanced";
  
  // Simple Mode: Visual Rule Builder
  rules?: RuleGroupType;
  
  // Advanced Mode: Expression
  expression?: string;
  
  // Data Source
  dataSource: {
    type: "formData" | "previousNode" | "workflowData" | "custom";
    path?: string; // JSON path
    nodeId?: string; // Önceki node ID'si
  };
}
```

## 🔧 Önerilen Implementation

### 1. Workflow Execution Context

```typescript
interface WorkflowExecutionContext {
  // Form verileri
  formData: Record<string, any>;
  
  // Önceki node'ların output'ları
  previousNodes: {
    [nodeId: string]: {
      type: string;
      output: any;
      timestamp: string;
    };
  };
  
  // Workflow metadata
  workflowData: {
    instanceId: string;
    startTime: string;
    currentStep: string;
  };
  
  // Değişkenler
  variables: Record<string, any>;
}
```

### 2. Expression Evaluator

```typescript
// Expression'ı evaluate et
const evaluateCondition = (
  expression: string,
  context: WorkflowExecutionContext
): boolean => {
  // Güvenli expression evaluator (expr-eval veya custom)
  // Örnek: "formData.amount > 1000"
  // Context'ten veri al: context.formData.amount
  // Evaluate et: 1500 > 1000 = true
};
```

### 3. Data Access Patterns

```typescript
// Form data'ya erişim
formData.fieldName
formData.user.name

// Önceki node'a erişim
previousNodes[nodeId].output.fieldName

// Workflow data'ya erişim
workflowData.instanceId
workflowData.startTime

// Değişkenlere erişim
variables.customVar
```

## 📝 Örnek Senaryolar

### Senaryo 1: Form Field'a Göre Koşul

```
FormNode → QueryConditionNode
            ├─ IF formData.amount > 1000 → ApproverNode (Manager)
            └─ ELSE → ApproverNode (Employee)
```

**Expression:**
```javascript
formData.amount > 1000
```

### Senaryo 2: Buton Action'a Göre Koşul

```
FormNode → UserTaskNode
            ├─ APPROVE → ConditionNode
            │              ├─ IF formData.amount < 5000 → ApproverNode (Level 1)
            │              └─ ELSE → ApproverNode (Level 2)
            └─ REJECT → StopNode
```

**Expression:**
```javascript
previousNodes[formNodeId].output.action === "APPROVE" && formData.amount < 5000
```

### Senaryo 3: Önceki Node Output'una Göre

```
SetFieldNode → ConditionNode
                 ├─ IF updatedFields.status === "approved" → AlertNode
                 └─ ELSE → UserTaskNode
```

**Expression:**
```javascript
previousNodes[setFieldNodeId].output.updatedFields.status === "approved"
```

### Senaryo 4: Workflow Context'e Göre

```
StartNode → ConditionNode
             ├─ IF workflowData.startTime > "2024-01-01" → FormNode
             └─ ELSE → StopNode
```

**Expression:**
```javascript
new Date(workflowData.startTime) > new Date("2024-01-01")
```

## 🎯 Önerilen Yapı

### 1. **Basit Koşul Node'u (SimpleConditionNode)**

```typescript
interface SimpleConditionNode {
  type: "simpleCondition";
  data: {
    // Expression (n8n tarzı)
    expression: string;
    
    // Veya Rule-based (visual)
    rules?: RuleGroupType;
    
    // Data source
    dataSource: {
      type: "formData" | "previousNode" | "workflowData";
      path?: string;
      nodeId?: string;
    };
    
    // Output handles
    trueHandle: string;  // "yes"
    falseHandle: string; // "no"
  };
}
```

### 2. **Expression Syntax**

```javascript
// Basit karşılaştırmalar
formData.amount > 1000
formData.status === "approved"
formData.user.name !== ""

// Mantıksal operatörler
formData.amount > 1000 && formData.status === "pending"
formData.amount < 500 || formData.amount > 10000

// Önceki node'lara erişim
previousNodes[nodeId].output.action === "APPROVE"

// Workflow context'e erişim
workflowData.instanceId !== null

// Fonksiyonlar
formData.date > new Date("2024-01-01")
formData.items.length > 0
```

### 3. **Visual Rule Builder (Geliştirilmiş)**

- ✅ Form field'ları seçilebilir
- ✅ Önceki node output'ları seçilebilir
- ✅ Workflow context seçilebilir
- ✅ JSON path desteği
- ✅ Expression mode'a geçiş

## 🚀 Implementation Önerisi

### Adım 1: Expression Evaluator Ekle

```typescript
// utils/expressionEvaluator.ts
import { evaluate } from 'expr-eval';

export const evaluateExpression = (
  expression: string,
  context: WorkflowExecutionContext
): boolean => {
  // Context'i expression için hazırla
  const scope = {
    formData: context.formData,
    previousNodes: context.previousNodes,
    workflowData: context.workflowData,
    variables: context.variables,
  };
  
  // Expression'ı evaluate et
  try {
    const parser = new Parser();
    const expr = parser.parse(expression);
    return expr.evaluate(scope);
  } catch (error) {
    console.error("Expression evaluation error:", error);
    return false;
  }
};
```

### Adım 2: SimpleConditionNode Component'i

```typescript
// components/SimpleConditionNode.jsx
// - Expression input
// - Data source seçimi
// - Visual rule builder (opsiyonel)
// - True/False handle'ları
```

### Adım 3: Workflow Execution'da Kullanım

```typescript
// Workflow execution'da
if (node.type === "simpleCondition") {
  const result = evaluateExpression(
    node.data.expression,
    workflowContext
  );
  
  // Result'a göre routing
  if (result) {
    // True handle'a git
    nextNodeId = getNodeByHandle(node.id, "yes");
  } else {
    // False handle'a git
    nextNodeId = getNodeByHandle(node.id, "no");
  }
}
```

## 📊 Karşılaştırma

| Özellik | QueryConditionNode | Expression-Based | Hybrid |
|---------|-------------------|-----------------|--------|
| Form Field Erişimi | ✅ | ✅ | ✅ |
| Önceki Node Erişimi | ❌ | ✅ | ✅ |
| Workflow Context | ❌ | ✅ | ✅ |
| Visual Builder | ✅ | ❌ | ✅ |
| Esneklik | ⚠️ | ✅ | ✅ |
| Kullanıcı Dostu | ✅ | ⚠️ | ✅ |

## 🎯 Sonuç ve Öneri

**Önerilen Yaklaşım: Hybrid (Her İkisi Birden)**

1. **Basit kullanıcılar için:** Visual Rule Builder (QueryConditionNode geliştirilmiş)
2. **Gelişmiş kullanıcılar için:** Expression-based (n8n tarzı)
3. **Her ikisi de:** Workflow context'e erişebilir

**Öncelik:**
1. ✅ Expression evaluator ekle
2. ✅ SimpleConditionNode oluştur
3. ✅ Workflow context'i genişlet
4. ✅ QueryConditionNode'u geliştir (önceki node erişimi)

Bu yaklaşım hem basit hem de güçlü bir koşul sistemi sağlar! 🚀

