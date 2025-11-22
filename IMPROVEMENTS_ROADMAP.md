# Form-Workflow Sistemi İyileştirme Yol Haritası

## 🎯 Öncelikli Eksikler ve İyileştirmeler

### 🔴 Yüksek Öncelik (Kritik)

#### 1. **Action Kod Standartları ve Validasyon** ❌
**Durum:** Eksik
**Sorun:** 
- Action kodları serbest metin olarak giriliyor
- Standart action kodları yok
- Validasyon yok (boş, tekrar eden, geçersiz karakterler)

**Çözüm:**
```typescript
// Standart action kodları
const STANDARD_ACTIONS = [
  'APPROVE', 'REJECT', 'PENDING', 'SENDBACK', 
  'FORWARD', 'DELEGATE', 'COMPLETE', 'CANCEL', 'PAUSE'
];

// Action kod input'una autocomplete ekle
// Validasyon: Büyük harf, underscore, boşluk yok
```

**Fayda:**
- Tutarlılık
- Daha az hata
- Daha kolay dokümantasyon

#### 2. **Form Butonları Değiştiğinde FormNode Güncelleme** ⚠️
**Durum:** Kısmen çalışıyor
**Sorun:**
- Form butonları değiştiğinde FormNode otomatik güncellenmiyor
- Kullanıcı manuel olarak formu tekrar seçmeli
- Edge'ler kopuyor (buton sayısı değiştiğinde)

**Çözüm:**
- Form butonları değiştiğinde FormNode'u otomatik güncelle
- Edge'leri yeniden bağla veya uyarı ver
- FormNode çıkış handle'larını dinamik güncelle

**Fayda:**
- Daha iyi UX
- Daha az manuel işlem
- Daha az hata

#### 3. **Workflow Runtime'da Action Kodları** ❌
**Durum:** Eksik
**Sorun:**
- Form butonuna tıklandığında action kodu kullanılmıyor
- Workflow runtime'da hangi butona tıklandığı bilinmiyor
- FormNode çıkış handle'larına routing yapılamıyor

**Çözüm:**
```typescript
// Form butonuna tıklandığında
const handleButtonClick = (button: FormButton) => {
  const actionCode = button.action || `button-${button.id}`;
  // Workflow runtime'a action kodu gönder
  workflowEngine.executeAction(actionCode);
};
```

**Fayda:**
- Gerçek button-based routing
- Daha esnek workflow yönetimi
- Daha iyi debugging

#### 4. **Form Değişikliklerinde Workflow Uyarısı** ❌
**Durum:** Eksik
**Sorun:**
- Form butonları değiştiğinde workflow'a uyarı verilmiyor
- Form alanları değiştiğinde workflow'a uyarı verilmiyor
- Workflow'da kullanılan form revizyonu değiştiğinde uyarı yok

**Çözüm:**
- Form değiştiğinde workflow'ları kontrol et
- Kullanıcıya uyarı göster
- Workflow'u güncelleme seçeneği sun

**Fayda:**
- Daha az hata
- Daha iyi bilgilendirme
- Daha güvenli sistem

### 🟡 Orta Öncelik (Önemli)

#### 5. **FormNode Çıkış Handle Görselleştirmesi** ⚠️
**Durum:** Kısmen var
**Sorun:**
- Handle'lar action kodlarına göre label'lanmış ama görsel olarak belirgin değil
- Hangi handle'ın hangi butona ait olduğu net değil
- Edge bağlanırken hangi butona bağlandığı görünmüyor

**Çözüm:**
- Handle'lara tooltip ekle (action kodu göster)
- Handle'ları renklendir (her buton farklı renk)
- Edge label'larında action kodu göster

**Fayda:**
- Daha iyi görselleştirme
- Daha kolay debugging
- Daha iyi UX

#### 6. **Workflow Validasyonu** ❌
**Durum:** Eksik
**Sorun:**
- Workflow kaydedilirken validasyon yok
- FormNode çıkış handle'larına edge bağlanmamış olabilir
- Döngüsel bağlantılar kontrol edilmiyor
- StartNode ve StopNode kontrolü eksik

**Çözüm:**
```typescript
const validateWorkflow = (nodes, edges) => {
  const errors = [];
  
  // FormNode çıkış handle'ları kontrolü
  const formNodes = nodes.filter(n => n.type === 'formNode');
  formNodes.forEach(node => {
    const buttons = node.data?.buttons || [];
    buttons.forEach(button => {
      const handleId = button.action || `button-${button.id}`;
      const hasEdge = edges.some(e => e.source === node.id && e.sourceHandle === handleId);
      if (!hasEdge) {
        errors.push(`FormNode "${node.data.name}" butonu "${button.label}" için edge bağlantısı yok`);
      }
    });
  });
  
  return errors;
};
```

**Fayda:**
- Daha az hata
- Daha güvenli workflow'lar
- Daha iyi kullanıcı deneyimi

#### 7. **Form-Workflow Bağlantı Görselleştirmesi** ❌
**Durum:** Eksik
**Sorun:**
- Workflow'da hangi formun kullanıldığı net değil
- FormNode'da form bilgileri eksik
- Form revizyon bilgisi gösterilmiyor

**Çözüm:**
- FormNode'da form adı, revizyon numarası göster
- Workflow başlığında form bilgisi göster
- Form değişikliklerinde görsel uyarı

**Fayda:**
- Daha iyi bilgilendirme
- Daha kolay takip
- Daha az karışıklık

#### 8. **Action Kod Dokümantasyonu** ❌
**Durum:** Eksik
**Sorun:**
- Action kodları dokümante edilmemiş
- Kullanıcı hangi action kodunu kullanacağını bilmiyor
- Best practices yok

**Çözüm:**
- Action kod input'una tooltip ekle
- Standart action kodları listesi göster
- Her action kodu için açıklama ekle

**Fayda:**
- Daha kolay kullanım
- Daha az hata
- Daha iyi dokümantasyon

### 🟢 Düşük Öncelik (İyileştirme)

#### 9. **FormNode Properties Panel İyileştirmeleri** ⚠️
**Durum:** Temel var
**Sorun:**
- FormNode properties panel'de sadece form adı ve butonlar gösteriliyor
- Form revizyon bilgisi yok
- Form değiştirme seçeneği yok
- Buton detayları eksik

**Çözüm:**
- Form revizyon numarası göster
- Form değiştirme butonu ekle
- Buton detaylarını genişlet (action kodu, renk, vb.)
- Form durumu göster (yayınlanmış/taslak)

**Fayda:**
- Daha iyi bilgilendirme
- Daha kolay yönetim
- Daha iyi UX

#### 10. **Workflow Test/Simulation** ❌
**Durum:** Eksik
**Sorun:**
- Workflow test edilemiyor
- Simulation modu yok
- Debugging zor

**Çözüm:**
- Workflow test modu ekle
- Step-by-step execution
- Variable tracking
- Error handling

**Fayda:**
- Daha az production hatası
- Daha kolay debugging
- Daha güvenli sistem

#### 11. **Form Buton Renklendirme** ❌
**Durum:** Eksik
**Sorun:**
- Form butonları renklendirilemiyor
- Workflow'da görsel ayrım yok
- Kullanıcı deneyimi eksik

**Çözüm:**
- Form butonlarına renk seçeneği ekle
- FormNode'da buton renklerini göster
- Edge'leri renklendir

**Fayda:**
- Daha iyi görselleştirme
- Daha kolay takip
- Daha iyi UX

#### 12. **Bulk Operations** ❌
**Durum:** Eksik
**Sorun:**
- Birden fazla form için workflow oluşturulamıyor
- Toplu işlemler yok
- Export/Import yok

**Çözüm:**
- Workflow template'leri
- Bulk form seçimi
- Workflow export/import
- Workflow kopyalama

**Fayda:**
- Daha hızlı workflow oluşturma
- Daha kolay yönetim
- Daha iyi ölçeklenebilirlik

## 📊 Öncelik Matrisi

| Özellik | Öncelik | Etki | Zorluk | Durum |
|---------|---------|------|--------|-------|
| Action Kod Standartları | 🔴 Yüksek | Yüksek | Orta | ❌ |
| FormNode Otomatik Güncelleme | 🔴 Yüksek | Yüksek | Yüksek | ⚠️ |
| Workflow Runtime Action Kodları | 🔴 Yüksek | Yüksek | Yüksek | ❌ |
| Form Değişiklik Uyarıları | 🔴 Yüksek | Orta | Orta | ❌ |
| Handle Görselleştirme | 🟡 Orta | Orta | Düşük | ⚠️ |
| Workflow Validasyonu | 🟡 Orta | Yüksek | Orta | ❌ |
| Form-Workflow Görselleştirme | 🟡 Orta | Düşük | Düşük | ❌ |
| Action Kod Dokümantasyonu | 🟡 Orta | Düşük | Düşük | ❌ |
| Properties Panel İyileştirme | 🟢 Düşük | Düşük | Düşük | ⚠️ |
| Workflow Test/Simulation | 🟢 Düşük | Orta | Yüksek | ❌ |
| Form Buton Renklendirme | 🟢 Düşük | Düşük | Düşük | ❌ |
| Bulk Operations | 🟢 Düşük | Orta | Yüksek | ❌ |

## 🎯 Önerilen Uygulama Sırası

### Faz 1: Kritik Özellikler (1-2 Hafta)
1. Action Kod Standartları ve Validasyon
2. Form Değişiklik Uyarıları
3. Workflow Validasyonu

### Faz 2: Önemli Özellikler (2-3 Hafta)
4. FormNode Otomatik Güncelleme
5. Handle Görselleştirme
6. Form-Workflow Görselleştirme

### Faz 3: İyileştirmeler (3-4 Hafta)
7. Workflow Runtime Action Kodları
8. Properties Panel İyileştirme
9. Action Kod Dokümantasyonu

### Faz 4: İleri Özellikler (4+ Hafta)
10. Workflow Test/Simulation
11. Form Buton Renklendirme
12. Bulk Operations

## 💡 Hızlı Kazanımlar (Quick Wins)

Bu özellikler hızlıca uygulanabilir ve büyük etki yaratır:

1. **Action Kod Autocomplete** (1 gün)
   - Standart action kodları listesi
   - Input'a autocomplete ekle

2. **FormNode Tooltip** (1 gün)
   - Handle'lara tooltip ekle
   - Action kodu göster

3. **Workflow Validasyon Mesajları** (2 gün)
   - Basit validasyon kuralları
   - Kullanıcıya mesaj göster

4. **Form Revizyon Göstergesi** (1 gün)
   - FormNode'da revizyon numarası
   - Workflow başlığında form bilgisi

## 🔍 Teknik Detaylar

### Action Kod Standartları
```typescript
interface ActionCode {
  code: string; // APPROVE, REJECT, vb.
  label: string; // "Onayla", "Reddet"
  description: string; // Açıklama
  category: 'approval' | 'workflow' | 'status' | 'custom';
}

const STANDARD_ACTIONS: ActionCode[] = [
  { code: 'APPROVE', label: 'Onayla', description: 'Formu onayla', category: 'approval' },
  { code: 'REJECT', label: 'Reddet', description: 'Formu reddet', category: 'approval' },
  // ...
];
```

### FormNode Otomatik Güncelleme
```typescript
// Form butonları değiştiğinde
useEffect(() => {
  if (selectedForm && parsedFormDesign) {
    const formNode = nodes.find(n => n.type === 'formNode' && n.data?.formId === selectedForm.id);
    if (formNode) {
      // FormNode'u güncelle
      // Edge'leri kontrol et ve güncelle
    }
  }
}, [parsedFormDesign?.buttons]);
```

### Workflow Validasyonu
```typescript
const validateWorkflow = (nodes, edges, selectedForm) => {
  const errors = [];
  const warnings = [];
  
  // FormNode kontrolü
  const formNodes = nodes.filter(n => n.type === 'formNode');
  formNodes.forEach(node => {
    const buttons = node.data?.buttons || [];
    buttons.forEach(button => {
      const handleId = button.action || `button-${button.id}`;
      const hasEdge = edges.some(e => 
        e.source === node.id && e.sourceHandle === handleId
      );
      if (!hasEdge) {
        warnings.push(`"${button.label}" butonu için edge bağlantısı yok`);
      }
    });
  });
  
  return { errors, warnings };
};
```

## 📝 Notlar

- Bu liste dinamik olarak güncellenebilir
- Öncelikler proje ihtiyaçlarına göre değişebilir
- Her özellik için detaylı teknik dokümantasyon gerekli
- Test senaryoları her özellik için yazılmalı

