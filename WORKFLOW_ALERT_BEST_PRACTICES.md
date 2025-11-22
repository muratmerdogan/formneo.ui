# Workflow'da Alert/Mesaj Gösterme - Best Practices

## ✅ AlertNode Oluşturuldu!

AlertNode artık workflow'da kullanılabilir. Frontend'de kullanıcıya mesaj göstermek için kullanılır.

## 🎯 Kullanım Senaryoları

### Senaryo 1: Form Kaydedildikten Sonra Bilgilendirme

```
StartNode
  └─ FormNode
      ├─ APPROVE → SetFieldNode (Kaydet) → AlertNode ("Form onaylandı!") → ApproverNode
      ├─ REJECT → SetFieldNode (Kaydet) → AlertNode ("Form reddedildi!") → StopNode
      └─ ...
```

### Senaryo 2: Hata Durumlarında Uyarı

```
StartNode
  └─ FormNode
      └─ APPROVE → QueryConditionNode
                      ├─ IF valid → ApproverNode
                      └─ ELSE → AlertNode ("Form geçersiz!") → StopNode
```

### Senaryo 3: İşlem Sonuçlarını Bildirme

```
StartNode
  └─ FormNode
      └─ APPROVE → ApproverNode → AlertNode ("Onaylandı!") → FormStopNode
```

## 📋 AlertNode Özellikleri

### Alert Tipleri

1. **Info (Bilgi)** - Mavi
   - Genel bilgilendirme mesajları
   - Örnek: "Form başarıyla kaydedildi"

2. **Success (Başarılı)** - Yeşil
   - Başarılı işlemler
   - Örnek: "Form onaylandı!"

3. **Warning (Uyarı)** - Sarı
   - Dikkat gerektiren durumlar
   - Örnek: "Form eksik bilgiler içeriyor"

4. **Error (Hata)** - Kırmızı
   - Hata durumları
   - Örnek: "Form kaydedilemedi!"

### AlertNode Yapılandırması

```typescript
interface AlertNodeData {
  title: string;      // Alert başlığı
  message: string;    // Gösterilecek mesaj
  type: "info" | "success" | "warning" | "error";
}
```

## 🏗️ Önerilen Workflow Yapıları

### Yapı 1: Form Kaydetme + Alert (Önerilen) ⭐

```
StartNode
  └─ FormNode
      ├─ APPROVE → SetFieldNode (formData kaydet) 
                    → AlertNode ("Form onaylandı!", type: "success")
                    → ApproverNode
      
      ├─ REJECT → SetFieldNode (formData kaydet)
                   → AlertNode ("Form reddedildi!", type: "error")
                   → StopNode
      
      ├─ SENDBACK → SetFieldNode (formData kaydet)
                     → AlertNode ("Form geri gönderildi!", type: "warning")
                     → SetFieldNode (status güncelle)
      
      └─ REVIEW → SetFieldNode (formData kaydet)
                   → AlertNode ("Form inceleme için gönderildi!", type: "info")
                   → ReviewerNode
```

**Avantajları:**
- ✅ Kullanıcı her adımda bilgilendirilir
- ✅ Form verileri kaydedilir
- ✅ Kullanıcı deneyimi iyileşir

### Yapı 2: Sadece Alert (Basit)

```
StartNode
  └─ FormNode
      ├─ APPROVE → AlertNode ("Onaylandı!") → ApproverNode
      └─ REJECT → AlertNode ("Reddedildi!") → StopNode
```

**Kullanım:**
- Basit bilgilendirme için
- Form verileri başka yerde kaydediliyorsa

## 💡 Best Practice Önerileri

### 1. AlertNode Ne Zaman Kullanılmalı?

✅ **Kullanılmalı:**
- Kullanıcıya bilgilendirme yapılacaksa
- İşlem sonuçları bildirilecekse
- Hata durumlarında uyarı gösterilecekse
- Onay/red gibi önemli işlemlerden sonra

❌ **Kullanılmamalı:**
- Sadece backend işlemleri yapılıyorsa
- Kullanıcı etkileşimi gerektirmeyen durumlarda
- Log kayıtları için (bunlar backend'de tutulmalı)

### 2. AlertNode ve Form Verileri

**Önerilen Akış:**
```
FormNode → SetFieldNode (Kaydet) → AlertNode (Bilgilendir) → Sonraki Node
```

**Neden?**
- Önce veriler kaydedilir
- Sonra kullanıcı bilgilendirilir
- Hata durumunda veri kaybı olmaz

### 3. Alert Tipleri Seçimi

- **Success**: İşlem başarılı olduğunda
- **Error**: Hata durumlarında
- **Warning**: Dikkat gerektiren durumlarda
- **Info**: Genel bilgilendirme için

### 4. Mesaj İçeriği

**İyi Mesajlar:**
- ✅ "Form başarıyla kaydedildi"
- ✅ "Form onaylandı ve onaylayıcıya gönderildi"
- ✅ "Form reddedildi. Lütfen düzeltip tekrar gönderin"

**Kötü Mesajlar:**
- ❌ "OK"
- ❌ "Hata"
- ❌ "Başarılı"

## 🔧 Teknik Detaylar

### AlertNode Component'i

```typescript
// components/AlertNode.jsx
- Tip'e göre renk ve ikon gösterir
- Başlık ve mesaj gösterir
- Workflow runtime'da frontend'de alert gösterir
```

### Runtime'da Alert Gösterme

```typescript
// Workflow runtime'da
const executeAlertNode = async (node) => {
  const { title, message, type } = node.data;
  
  // Frontend'de alert göster
  showAlert({
    title,
    message,
    type, // info, success, warning, error
    duration: 5000 // 5 saniye göster
  });
  
  // Sonraki node'a geç
  executeNextNode(node);
};
```

## 📝 Örnek Workflow Yapısı (4 Butonlu Form)

```
StartNode
  └─ FormNode (4 buton)
      │
      ├─ [APPROVE] → SetFieldNode
      │                ├─ formData kaydet
      │                └─ status: "approved"
      │              → AlertNode
      │                ├─ title: "Başarılı"
      │                ├─ message: "Form onaylandı ve onaylayıcıya gönderildi"
      │                └─ type: "success"
      │              → ApproverNode
      │
      ├─ [REJECT] → SetFieldNode
      │               ├─ formData kaydet
      │               └─ status: "rejected"
      │             → AlertNode
      │               ├─ title: "Reddedildi"
      │               ├─ message: "Form reddedildi"
      │               └─ type: "error"
      │             → StopNode
      │
      ├─ [SENDBACK] → SetFieldNode
      │                 ├─ formData kaydet
      │                 └─ status: "sent_back"
      │               → AlertNode
      │                 ├─ title: "Geri Gönderildi"
      │                 ├─ message: "Form düzenlenmek üzere geri gönderildi"
      │                 └─ type: "warning"
      │               → SetFieldNode (status güncelle)
      │
      └─ [REVIEW] → SetFieldNode
                      ├─ formData kaydet
                      └─ status: "under_review"
                    → AlertNode
                      ├─ title: "İnceleme"
                      ├─ message: "Form inceleme için gönderildi"
                      └─ type: "info"
                    → ReviewerNode
```

## 🎯 Sonuç

**AlertNode workflow'da olmalı çünkü:**
- ✅ Kullanıcıya bilgilendirme yapılır
- ✅ İşlem sonuçları bildirilir
- ✅ Hata durumlarında uyarı gösterilir
- ✅ Daha iyi kullanıcı deneyimi sağlanır

**Kullanım:**
1. Sidebar'dan "Alert/Mesaj" seçin
2. Workflow'a sürükleyin
3. Properties panel'de başlık, mesaj ve tip ayarlayın
4. FormNode'dan veya diğer node'lardan bağlayın

Artık workflow'da alert gösterebilirsiniz! 🎉

