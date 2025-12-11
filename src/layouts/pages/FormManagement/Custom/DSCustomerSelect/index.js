import { Formio } from '@formio/react';
const SelectComponent = Formio.Components.components.select;

/**
 * FormNeo Customer Selector Component
 * Müşteri listesini API'den otomatik çeker ve dropdown olarak gösterir
 */
export class DSCustomerSelectComponent extends SelectComponent {
  
  /**
   * Component schema - FormNeo Customer Selector
   */
  static schema(...extend) {
    return SelectComponent.schema({
      label: 'Müşteri Seçimi',
      type: 'dscustomerselect',
      key: 'customerSelect',
      dataSrc: 'custom',
      data: {
        custom: 'values = [];'
      },
      valueProperty: 'value',
      template: '<span>{{ item.label }}</span>',
      disableLimit: true,
      searchEnabled: true,
      searchField: 'label',
      minSearch: 0,
      placeholder: 'Müşteri seçiniz...',
      validate: {
        required: false
      },
      customBooleanProp: false,
      multiple: false,
      widget: 'choicesjs'
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Müşteri Seçici',
      group: 'dscomponents',
      icon: 'briefcase',
      weight: 26,
      documentation: '/userguide/#customer-select',
      schema: DSCustomerSelectComponent.schema()
    };
  }

  /**
   * Component attach - DOM'a eklendiğinde çalışır
   */
  attach(element) {
    const promise = super.attach(element);
    this.loadCustomers();
    return promise;
  }

  /**
   * Müşteri listesini API'den çeker
   */
  async loadCustomers() {
    try {
      // Axios/configuration ile API çağrısı
      const getConfiguration = (await import('../../../../../confiuration')).default;
      const { CustomersApi } = await import('../../../../../api/generated');
      
      console.log('🔍 Müşteri listesi yükleniyor...');
      
      const conf = getConfiguration();
      const api = new CustomersApi(conf);
      
      // Basic endpoint'i kullan (daha hızlı)
      const response = await api.apiCustomersBasicGet(0, 1000);
      
      if (response.data && Array.isArray(response.data)) {
        const customers = response.data;
        console.log('✅ Müşteriler yüklendi:', customers.length, 'müşteri');
        
        // Form.io select component'ine data set et
        this.component.dataSrc = 'values';
        this.component.data = {
          values: customers.map(customer => ({
            label: this.formatCustomerLabel(customer),
            value: customer.id,
            // Ek bilgiler (tooltip, filtering için)
            customer: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              company: customer.companyName
            }
          }))
        };
        
        // Component'i güncelle
        this.triggerUpdate();
        
        // Eğer component zaten render edildiyse, yeniden render et
        if (this.choices) {
          this.choices.clearStore();
          this.choices.setChoices(this.component.data.values, 'value', 'label', true);
        } else {
          this.redraw();
        }
        
        console.log('✅ Müşteri dropdown güncellendi');
      } else {
        console.error('❌ API yanıtı beklendiği gibi değil:', response);
        this.loadFallbackCustomers();
      }
    } catch (error) {
      console.error('❌ Müşteri listesi yüklenirken hata:', error);
      this.loadFallbackCustomers();
    }
  }

  /**
   * Müşteri etiketini formatla
   * Örnek: "ABC Şirketi (Ahmet Yılmaz)"
   */
  formatCustomerLabel(customer) {
    const parts = [];
    
    if (customer.companyName) {
      parts.push(customer.companyName);
    }
    
    if (customer.name) {
      parts.push(`(${customer.name})`);
    } else if (!customer.companyName && customer.email) {
      parts.push(customer.email);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'İsimsiz Müşteri';
  }

  /**
   * Fallback - Test müşterileri yükle
   */
  loadFallbackCustomers() {
    console.log('⚠️ API çalışmadı, test verisi yükleniyor...');
    
    this.component.dataSrc = 'values';
    this.component.data = {
      values: [
        { 
          label: 'ABC Teknoloji A.Ş. (Ahmet Yılmaz)', 
          value: 'customer-1',
          customer: {
            name: 'Ahmet Yılmaz',
            company: 'ABC Teknoloji A.Ş.',
            email: 'ahmet@abc.com'
          }
        },
        { 
          label: 'XYZ Danışmanlık Ltd. (Ayşe Demir)', 
          value: 'customer-2',
          customer: {
            name: 'Ayşe Demir',
            company: 'XYZ Danışmanlık Ltd.',
            email: 'ayse@xyz.com'
          }
        },
        { 
          label: 'Formneo Digital (Mehmet Kaya)', 
          value: 'customer-3',
          customer: {
            name: 'Mehmet Kaya',
            company: 'Formneo Digital',
            email: 'mehmet@formneo.com'
          }
        },
        { 
          label: 'FormNeo Yazılım (Ali Öztürk)', 
          value: 'customer-4',
          customer: {
            name: 'Ali Öztürk',
            company: 'FormNeo Yazılım',
            email: 'ali@formneo.com'
          }
        }
      ]
    };
    
    // Component'i güncelle
    this.triggerUpdate();
    
    if (this.choices) {
      this.choices.clearStore();
      this.choices.setChoices(this.component.data.values, 'value', 'label', true);
    } else {
      this.redraw();
    }
    
    console.log('✅ Test müşteri verileri yüklendi');
  }

  /**
   * Render değerini formatla - Müşteri adını göster
   */
  getValueAsString(value, options) {
    if (!value) return '';
    
    // Eğer multiple ise array döner
    if (Array.isArray(value)) {
      return value.map(v => this.getCustomerLabel(v)).filter(Boolean).join(', ');
    }
    
    return this.getCustomerLabel(value) || value;
  }

  /**
   * Customer ID'den müşteri adını getir
   */
  getCustomerLabel(customerId) {
    if (!this.component.data?.values) return customerId;
    
    const customer = this.component.data.values.find(c => c.value === customerId);
    return customer ? customer.label : customerId;
  }

  /**
   * Seçili müşterinin detay bilgilerini getir
   */
  getCustomerDetails(customerId) {
    if (!this.component.data?.values) return null;
    
    const customer = this.component.data.values.find(c => c.value === customerId);
    return customer ? customer.customer : null;
  }
}

/**
 * Edit form - Component ayarları
 */
DSCustomerSelectComponent.editForm = (...args) => {
  const editForm = SelectComponent.editForm(...args);

  // Grid gösterim ayarı
  editForm.components.unshift({
    type: 'checkbox',
    key: 'customBooleanProp',
    label: 'Grid Üzerinde Gösterilsin',
    input: true,
    weight: 15,
    tooltip: 'Bu alan tablo görünümünde gösterilecek mi?'
  });

  // İş akışı ayarı
  editForm.components.unshift({
    type: 'checkbox',
    key: 'workFlowProp',
    label: 'İş Akışı Üzerinde Gösterilsin',
    input: true,
    weight: 15,
    tooltip: 'Bu alan iş akışı sürecinde kullanılacak mı?'
  });

  // Çoklu seçim ayarı
  editForm.components.unshift({
    type: 'checkbox',
    key: 'multiple',
    label: 'Çoklu Müşteri Seçimi',
    input: true,
    weight: 15,
    tooltip: 'Birden fazla müşteri seçilebilsin mi?',
    defaultValue: false
  });

  // Arama ayarı
  editForm.components.unshift({
    type: 'checkbox',
    key: 'searchEnabled',
    label: 'Arama Özelliği',
    input: true,
    weight: 15,
    tooltip: 'Müşteri listesinde arama yapılabilsin mi?',
    defaultValue: true
  });

  // Müşteri bilgisi gösterimi
  editForm.components.unshift({
    type: 'select',
    key: 'displayFormat',
    label: 'Gösterim Formatı',
    input: true,
    weight: 14,
    tooltip: 'Müşteri bilgisi nasıl gösterilsin?',
    data: {
      values: [
        { label: 'Şirket (İsim)', value: 'company_name' },
        { label: 'Sadece Şirket', value: 'company_only' },
        { label: 'Sadece İsim', value: 'name_only' },
        { label: 'Email', value: 'email' }
      ]
    },
    defaultValue: 'company_name'
  });

  return editForm;
};

// Component'i Form.io'ya kaydet
Formio.Components.addComponent('dscustomerselect', DSCustomerSelectComponent);

