# Form ve Workflow Bağlantı Yapısı - Best Practices

## 📋 Genel Yaklaşım

### 1. **Form-First Yaklaşımı (Önerilen)**
```
1. Form Tasarımı → 2. Form Yayınlama → 3. Workflow Tanımlama
```

**Avantajları:**
- ✅ Form yapısı netleşir, workflow daha kolay tasarlanır
- ✅ Form alanları ve butonlar workflow node'larına otomatik bağlanabilir
- ✅ Form değişiklikleri workflow'u etkilemez (revizyon sistemi sayesinde)
- ✅ Daha az hata riski

**Akış:**
1. Form tasarla ve butonları ekle
2. Formu yayınla (publicationStatus = 2)
3. Workflow'da formu seç
4. FormNode otomatik oluşur (butonlara göre çıkışlar)
5. Her buton için workflow branch'i oluştur

### 2. **Workflow-First Yaklaşımı (Alternatif)**
```
1. Workflow Tasarımı → 2. Form Seçimi → 3. Form Tasarımı
```

**Kullanım Senaryosu:**
- Workflow yapısı önceden belli
- Form sadece veri toplama aracı
- Basit formlar için uygun

## 🔗 Form-Workflow Bağlantı Stratejileri

### Strateji 1: Button-Based Routing (Önerilen) ⭐

**Nasıl Çalışır:**
- Form'da her buton bir action kodu içerir
- Workflow'da FormNode otomatik oluşur (buton sayısı kadar çıkış)
- Her buton tıklaması farklı bir workflow branch'ine gider

**Örnek:**
```javascript
// Form Button Panel
[
  { id: "btn-1", label: "Onayla", action: "APPROVE" },
  { id: "btn-2", label: "Reddet", action: "REJECT" },
  { id: "btn-3", label: "Geri Gönder", action: "SENDBACK" }
]

// Workflow FormNode
- FormNode (3 çıkış handle'ı)
  ├─ button-0 (APPROVE) → ApproverNode
  ├─ button-1 (REJECT) → StopNode
  └─ button-2 (SENDBACK) → SetFieldNode
```

**Avantajları:**
- ✅ Kullanıcı dostu: Her buton için ayrı işlem
- ✅ Esnek: Her buton farklı workflow'a gidebilir
- ✅ Otomatik: FormNode otomatik oluşur

### Strateji 2: Form Field-Based Routing

**Nasıl Çalışır:**
- Form alanlarına göre koşullu routing
- QueryConditionNode ile form alanları kontrol edilir
- Değerlere göre farklı branch'lere gidilir

**Örnek:**
```javascript
// Form Field: status = "approved" | "rejected"
QueryConditionNode:
  IF status == "approved" → ApproverNode
  ELSE IF status == "rejected" → StopNode
```

**Kullanım Senaryosu:**
- Tek butonlu formlar
- Durum bazlı işlemler
- Otomatik onay/red sistemi

### Strateji 3: Hybrid Approach (En Esnek)

**Nasıl Çalışır:**
- Button-based + Field-based kombinasyonu
- Butonlar ana routing'i belirler
- Form alanları detaylı koşulları kontrol eder

**Örnek:**
```javascript
FormNode (Butonlar)
  ├─ Onayla → QueryConditionNode (amount > 10000 ? Manager : AutoApprove)
  ├─ Reddet → StopNode
  └─ İncele → ReviewerNode
```

## 📐 Mimari Öneriler

### 1. Form Versiyonlama Stratejisi

**Revizyon Yönetimi:**
```
Form v1.0 (Published) → Workflow A bağlı
  └─ Form v1.1 (Draft) → Workflow A'ya bağlanmaz (taslak)
      └─ Form v2.0 (Published) → Workflow B'ye bağlanabilir
```

**Best Practice:**
- ✅ Yayınlanmış formlar workflow'a bağlanmalı
- ✅ Taslak formlar workflow'a bağlanmamalı
- ✅ Yeni revizyon oluşturulduğunda buttonPanel korunmalı
- ✅ Workflow'da her zaman son yayınlanmış revizyon kullanılmalı

### 2. Form-Workflow Bağlantı Noktaları

**Bağlantı Noktaları:**
1. **FormNode**: Form başlangıç noktası (butonlara göre çıkışlar)
2. **FormStopNode**: Form bitiş noktası (workflow sonlandırma)
3. **QueryConditionNode**: Form alanlarına göre koşullu routing
4. **SetFieldNode**: Form alanlarını güncelleme

**Önerilen Yapı:**
```
StartNode
  └─ FormNode (Form başlat)
      ├─ Buton 1 → Branch 1
      ├─ Buton 2 → Branch 2
      └─ Buton 3 → Branch 3
```

### 3. Button Action Kodları

**Action Kod Standartları:**
```javascript
// Onay/Red İşlemleri
APPROVE, REJECT, PENDING

// İş Akışı Kontrolü
SENDBACK, FORWARD, DELEGATE

// Durum Değişiklikleri
COMPLETE, CANCEL, PAUSE

// Özel İşlemler
CUSTOM_ACTION_1, CUSTOM_ACTION_2
```

**Best Practice:**
- ✅ Action kodları sabit string olmalı
- ✅ Büyük harf ve underscore kullanılmalı
- ✅ Anlamlı isimler seçilmeli
- ✅ Dokümante edilmeli

## 🎯 Önerilen Workflow Tasarım Süreci

### Adım 1: Form Tasarımı
1. Form alanlarını tanımla
2. Button panel'e butonları ekle
3. Her butona action kodu ver
4. Formu taslak olarak kaydet

### Adım 2: Form Testi
1. Preview'da formu test et
2. Butonların görünürlüğünü kontrol et
3. Form validasyonlarını test et

### Adım 3: Form Yayınlama
1. Formu yayınla (publicationStatus = 2)
2. Yayınlanan form artık workflow'a bağlanabilir

### Adım 4: Workflow Tasarımı
1. Workflow oluştur
2. Form seç (son yayınlanmış revizyon otomatik seçilir)
3. FormNode otomatik oluşur (butonlara göre çıkışlar)
4. Her buton için workflow branch'i tasarla

### Adım 5: Workflow Bağlantıları
1. FormNode çıkışlarını diğer node'lara bağla
2. QueryConditionNode ile form alanlarını kontrol et
3. SetFieldNode ile form alanlarını güncelle
4. FormStopNode ile workflow'u sonlandır

### Adım 6: Test ve Yayınlama
1. Workflow'u test et
2. Her buton için farklı senaryoları test et
3. Workflow'u yayınla

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Revizyon Yönetimi
- ❌ Yayınlanmış formu değiştirme, yeni revizyon oluştur
- ✅ Revizyon oluşturulduğunda buttonPanel korunmalı
- ✅ Workflow'da her zaman son yayınlanmış revizyon kullanılmalı
    
### 2. Form Değişiklikleri
- Form alanları değiştiğinde workflow'u kontrol et
- ButtonPanel değiştiğinde FormNode çıkışlarını kontrol et
- Yeni revizyon oluşturulduğunda workflow'u güncelle

### 3. Workflow Değişiklikleri
- Form değişmeden workflow değiştirilebilir
- FormNode çıkışları form butonlarına bağlıdır
- Form butonları değişirse workflow'u güncelle

## 🔄 Revizyon ve Workflow İlişkisi

### Senaryo 1: Form Revizyonu, Workflow Değişmez
```
Form v1.0 (Published) → Workflow A
Form v1.1 (Published) → Workflow A (aynı workflow, yeni form)
```

### Senaryo 2: Form Revizyonu, Workflow Güncellenir
```
Form v1.0 (Published) → Workflow A
Form v2.0 (Published) → Workflow B (yeni workflow)
```

### Senaryo 3: Form Revizyonu, ButtonPanel Değişir
```
Form v1.0: [Onayla, Reddet] → Workflow A (2 çıkış)
Form v2.0: [Onayla, Reddet, İncele] → Workflow B (3 çıkış)
```

## 📝 Özet: Önerilen Yaklaşım

1. **Form-First**: Önce formu tasarla ve yayınla
2. **Button-Based Routing**: Butonlara göre workflow branch'leri oluştur
3. **Revizyon Yönetimi**: Yayınlanmış formları değiştirme, revizyon oluştur
4. **Otomatik Bağlantı**: FormNode otomatik oluşur, butonlara göre çıkışlar
5. **Test**: Her adımda test et, sonra yayınla

Bu yaklaşım ile:
- ✅ Daha az hata
- ✅ Daha kolay bakım
- ✅ Daha esnek sistem
- ✅ Daha iyi kullanıcı deneyimi

