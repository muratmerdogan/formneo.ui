# Koşul Yapısı - Önerilen Yaklaşım

## 🎯 Önerim: Aşamalı Geliştirme (Incremental Enhancement)

### Faz 1: Mevcut QueryConditionNode'u Geliştir ⭐ ÖNCELİK

**Neden?**
- ✅ Kullanıcılar zaten visual builder'a alışkın
- ✅ Mevcut kod var, sadece genişletmek gerekiyor
- ✅ Daha az breaking change
- ✅ Hızlı implementasyon

**Yapılacaklar:**
1. **Data Source Seçimi Ekle**
   - Form Data (mevcut)
   - Previous Node Output (YENİ)
   - Workflow Context (YENİ)
   - Custom Variables (YENİ)

2. **Node Selector Ekle**
   - Önceki node'ları listele
   - Seçilen node'un output'unu göster
   - Field'ları otomatik yükle

3. **JSON Path Desteği**
   - Nested field'lara erişim
   - Array element'lerine erişim

**Örnek UI:**
```
┌─────────────────────────────────────┐
│ Query Condition Node                │
├─────────────────────────────────────┤
│ Data Source: [Dropdown]            │
│   - Form Data                      │
│   - Previous Node Output ⭐ YENİ   │
│   - Workflow Context ⭐ YENİ       │
│                                     │
│ Previous Node: [Select Node] ⭐   │
│   - FormNode (id: node-1)          │
│   - UserTaskNode (id: node-2)      │
│                                     │
│ [Visual Query Builder]             │
│   Field: [previousNode.output.action]
│   Operator: [===]                  │
│   Value: [APPROVE]                 │
└─────────────────────────────────────┘
```

### Faz 2: Expression Mode Ekle (Opsiyonel)

**Neden Sonra?**
- Kullanıcılar önce visual builder'a alışsın
- Expression daha gelişmiş kullanıcılar için
- İhtiyaç olursa eklenir

**Yapılacaklar:**
1. Mode switcher: "Visual" / "Expression"
2. Expression editor (CodeMirror/Monaco)
3. Expression validation
4. Visual ↔ Expression conversion

## 📊 Karşılaştırma

| Yaklaşım | Avantajlar | Dezavantajlar | Süre |
|----------|-----------|---------------|------|
| **Sadece Expression** | Esnek, güçlü | Öğrenme eğrisi, hata riski | 2-3 hafta |
| **Sadece Visual** | Kullanıcı dostu | Sınırlı esneklik | 1 hafta |
| **Hybrid (Önerilen)** | Her ikisinin avantajı | Biraz daha karmaşık | 2 hafta |
| **Mevcut Geliştirme** ⭐ | Hızlı, uyumlu | Expression yok (şimdilik) | 3-5 gün |

## 🚀 Önerilen Implementation Plan

### Hafta 1: QueryConditionNode Geliştirme

**Gün 1-2: Data Source Seçimi**
- Dropdown ekle
- Form Data / Previous Node / Workflow Context
- State management

**Gün 3-4: Previous Node Selector**
- Node listesi
- Output preview
- Field extraction

**Gün 5: JSON Path Desteği**
- Nested field parsing
- Array access
- Validation

### Hafta 2: Expression Mode (Opsiyonel)

**Gün 1-2: Expression Editor**
- CodeMirror/Monaco entegrasyonu
- Syntax highlighting
- Auto-complete

**Gün 3-4: Expression Evaluator**
- Safe evaluation
- Context injection
- Error handling

**Gün 5: Mode Switcher**
- Visual ↔ Expression
- Conversion logic
- Testing

## 💡 Neden Bu Yaklaşım?

### 1. **Kullanıcı Deneyimi**
- Mevcut kullanıcılar için uyumlu
- Yeni özellikler kademeli eklenir
- Öğrenme eğrisi düşük

### 2. **Teknik Avantajlar**
- Mevcut kod kullanılır
- Incremental development
- Test edilebilir

### 3. **İş Değeri**
- Hızlı değer üretir
- Risk düşük
- Geri bildirime göre geliştirilebilir

## 🎯 Sonuç

**Önerim: Faz 1'i uygula (QueryConditionNode Geliştirme)**

**Neden?**
- ✅ En hızlı değer üretir
- ✅ Mevcut kullanıcılar için uyumlu
- ✅ Expression ihtiyacı olursa sonra eklenir
- ✅ Risk düşük

**Expression Mode ne zaman eklenir?**
- Kullanıcılar visual builder'ın yeterli olmadığını söylerse
- Karmaşık koşullar gerektiğinde
- n8n benzeri esneklik istendiğinde

## 📝 Örnek Kullanım Senaryosu

### Senaryo: FormNode'dan sonra koşul

**Mevcut (Sadece Form Data):**
```
FormNode → QueryConditionNode
            ├─ IF formData.amount > 1000 → Manager
            └─ ELSE → Employee
```

**Geliştirilmiş (Previous Node + Form Data):**
```
FormNode → UserTaskNode → QueryConditionNode
                              ├─ IF previousNode.output.action === "APPROVE" 
                              │   && formData.amount > 1000 → Manager
                              └─ ELSE → Employee
```

**Expression Mode (Gelecekte):**
```
FormNode → UserTaskNode → ConditionNode (Expression)
                              Expression: 
                                previousNodes[node-2].output.action === "APPROVE" 
                                && formData.amount > 1000 
                                && workflowData.startTime > "2024-01-01"
```

## ✅ Sonuç

**Önerilen Yaklaşım:**
1. ✅ Faz 1: QueryConditionNode'u geliştir (3-5 gün)
2. ⏳ Faz 2: Expression mode ekle (ihtiyaç olursa)

Bu yaklaşım hem hızlı hem de kullanıcı dostu! 🚀

