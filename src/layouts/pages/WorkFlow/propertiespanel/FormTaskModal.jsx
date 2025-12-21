import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  Autocomplete,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Chip,
  Switch,
  Tabs,
  Tab,
  Grid,
  InputAdornment,
  Tooltip,
  ButtonGroup,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon,
} from "@mui/icons-material";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { UserApi, FormDataApi } from "api/generated";
import getConfiguration from "confiuration";
import { useBusy } from "layouts/pages/hooks/useBusy";

/**
 * ✅ FormTask Modal Component
 * 
 * Özellikler:
 * - Kullanıcı atama (Autocomplete ile arama)
 * - Form alanlarını listeleme ve görünürlük kontrolü
 * - Workflow'dan seçili formu kullanır
 */

const FormTaskModal = ({ open, onClose, initialValues, node, onSave, workflowFormId, workflowFormName }) => {
  const [name, setName] = useState(initialValues?.name || "Form Görevi");
  const [searchByName, setSearchByName] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formButtons, setFormButtons] = useState([]);
  const [fieldSettings, setFieldSettings] = useState({});
  const [buttonSettings, setButtonSettings] = useState({});
  const [message, setMessage] = useState(initialValues?.message || "");
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatchBusy = useBusy();

  // Kullanıcıları otomatik yükle (modal açıldığında)
  useEffect(() => {
    const loadInitialUsers = async () => {
      if (!open) return;
      
      try {
        dispatchBusy({ isBusy: true });
        const conf = getConfiguration();
        const api = new UserApi(conf);
        // Boş string veya "*" ile tüm kullanıcıları getirmeyi dene
        const data = await api.apiUserGetAllUsersAsyncWitNameGet("*");
        const pureData = data?.data || [];
        setSearchByName(pureData);
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata:", error);
        // Hata durumunda boş liste
        setSearchByName([]);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };

    if (open) {
      loadInitialUsers();
    } else {
      // Modal kapandığında listeyi temizle
      setSearchByName([]);
    }
  }, [open, dispatchBusy]);

  // Form alanlarını yükle
  useEffect(() => {
    const loadFormFields = async () => {
      // ✅ formId'yi önce node'un mevcut data'sından al, yoksa workflowFormId'yi kullan
      const formId = initialValues?.formId || node?.data?.formId || workflowFormId;
      
      if (!formId) return;
      
      try {
        dispatchBusy({ isBusy: true });
        const conf = getConfiguration();
        const api = new FormDataApi(conf);
        const res = await api.apiFormDataIdGet(formId);
        const formData = res?.data;
        
        if (formData?.formDesign) {
          const design = JSON.parse(formData.formDesign);
          const schema = design?.schema;
          
          // Form alanlarını yükle
          if (schema?.properties) {
            const fields = extractFieldsFromSchema(schema.properties);
            setFormFields(fields);
            
            // Mevcut field settings'i yükle veya varsayılan olarak tüm alanları görünür ve editable yap
            const settings = {};
            fields.forEach(field => {
              settings[field.key] = initialValues?.fieldSettings?.[field.key] ?? {
                visible: true,
                readonly: false,
                required: field.required || false,
              };
            });
            setFieldSettings(settings);
          }

          // Form butonlarını yükle
          const buttons = design?.buttonPanel?.buttons || [];
          setFormButtons(buttons);
          
          // Mevcut button settings'i yükle veya varsayılan olarak tüm butonları görünür yap
          const btnSettings = {};
          buttons.forEach(button => {
            btnSettings[button.id] = initialValues?.buttonSettings?.[button.id] ?? {
              visible: true,
            };
          });
          setButtonSettings(btnSettings);
        }
      } catch (error) {
        console.error("Form alanları yüklenirken hata:", error);
      } finally {
        dispatchBusy({ isBusy: false });
      }
    };

    if (open) {
      // ✅ formId varsa form alanlarını yükle
      const formId = initialValues?.formId || node?.data?.formId || workflowFormId;
      if (formId) {
        loadFormFields();
      }
    }
  }, [open, workflowFormId, initialValues, node]);

  // Initial values değiştiğinde state'i güncelle
  useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name || "Form Görevi");
      if (initialValues.userId || initialValues.userName) {
        setSelectedUser({
          id: initialValues.userId,
          userName: initialValues.userName,
          firstName: initialValues.userFirstName,
          lastName: initialValues.userLastName,
        });
        // Seçili kullanıcı varsa inputValue'yu set et
        if (initialValues.userFirstName && initialValues.userLastName) {
          setInputValue(`${initialValues.userFirstName} ${initialValues.userLastName}`);
        } else if (initialValues.userName) {
          setInputValue(initialValues.userName);
        }
      } else {
        setSelectedUser(null);
        setInputValue("");
      }
      if (initialValues.fieldSettings) {
        setFieldSettings(initialValues.fieldSettings);
      }
      if (initialValues.buttonSettings) {
        setButtonSettings(initialValues.buttonSettings);
      }
      if (initialValues.message) {
        setMessage(initialValues.message);
      }
    } else if (!open) {
      // Modal kapandığında state'leri sıfırla
      setInputValue("");
      setSearchByName([]);
    }
  }, [open, initialValues]);

  // Form schema'dan alanları çıkar
  const extractFieldsFromSchema = (properties, parentPath = "") => {
    const fields = [];
    
    Object.keys(properties).forEach(key => {
      const prop = properties[key];
      const fieldPath = parentPath ? `${parentPath}.${key}` : key;
      
      if (prop.type === "void") {
        // Container component (Card, FormLayout, vb.) - içindeki alanları recursive olarak al
        if (prop.properties) {
          fields.push(...extractFieldsFromSchema(prop.properties, fieldPath));
        }
      } else if (prop["x-component"] && prop["x-component"] !== "FormItem") {
        // Normal field
        fields.push({
          key: fieldPath,
          label: prop.title || prop.label || key,
          type: prop.type || "string",
          component: prop["x-component"],
          required: prop.required || false,
        });
      } else if (prop.properties) {
        // Nested properties
        fields.push(...extractFieldsFromSchema(prop.properties, fieldPath));
      }
    });
    
    return fields;
  };

  // Kullanıcı arama
  const handleSearchByName = async (value) => {
    if (!value || value.trim() === "") {
      setSearchByName([]);
      return;
    }
    
    dispatchBusy({ isBusy: true });
    try {
      const conf = getConfiguration();
      const api = new UserApi(conf);
      const data = await api.apiUserGetAllUsersAsyncWitNameGet(value.trim());
      const pureData = data?.data || [];
      setSearchByName(pureData);
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      setSearchByName([]);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // Alan görünürlüğünü değiştir
  const handleFieldVisibilityChange = (fieldKey, visible) => {
    setFieldSettings(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        visible,
      },
    }));
  };

  // Alan read-only durumunu değiştir
  const handleFieldReadonlyChange = (fieldKey, readonly) => {
    setFieldSettings(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        readonly,
      },
    }));
  };

  // Buton görünürlüğünü değiştir
  const handleButtonVisibilityChange = (buttonId, visible) => {
    setButtonSettings(prev => ({
      ...prev,
      [buttonId]: {
        visible,
      },
    }));
  };

  // Toplu işlemler - Tüm alanları görünür/gizli yap
  const handleSelectAllFields = () => {
    const newSettings = {};
    formFields.forEach(field => {
      newSettings[field.key] = {
        ...fieldSettings[field.key],
        visible: true,
      };
    });
    setFieldSettings(newSettings);
  };

  const handleDeselectAllFields = () => {
    const newSettings = {};
    formFields.forEach(field => {
      newSettings[field.key] = {
        ...fieldSettings[field.key],
        visible: false,
      };
    });
    setFieldSettings(newSettings);
  };

  // Filtrelenmiş alanlar
  const filteredFields = formFields.filter(field => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      field.label.toLowerCase().includes(query) ||
      field.key.toLowerCase().includes(query) ||
      field.component.toLowerCase().includes(query)
    );
  });

  // Kaydet
  const handleSave = () => {
    if (!selectedUser) {
      alert("Lütfen bir kullanıcı seçin");
      return;
    }

    const visibleFieldsCount = Object.values(fieldSettings).filter(s => s.visible).length;
    const totalFieldsCount = formFields.length;
    
    // Görünür butonları filtrele ve tüm özelliklerini koru
    const visibleButtons = formButtons
      .filter(btn => buttonSettings[btn.id]?.visible !== false)
      .map(btn => ({
        id: btn.id,
        label: btn.label || btn.name || "Buton",
        action: btn.action || "",
        type: btn.type || "default",
        icon: btn.icon || null,
        color: btn.color || "primary",
        ...btn, // Tüm diğer özellikleri de koru
      }));
    const visibleButtonsCount = visibleButtons.length;

    // TÜM butonları kaydet (handle'lar için)
    const allButtons = formButtons.map(btn => ({
      id: btn.id,
      label: btn.label || btn.name || "Buton",
      action: btn.action || "",
      type: btn.type || "default",
      icon: btn.icon || null,
      color: btn.color || "primary",
      ...btn, // Tüm diğer özellikleri de koru
    }));

    // ✅ formId'yi önce node'un mevcut data'sından al, yoksa workflowFormId'yi kullan
    // Bu sayede formId kaybolmaz ve şemada korunur
    const formId = initialValues?.formId || node?.data?.formId || workflowFormId;
    const formName = initialValues?.formName || node?.data?.formName || workflowFormName;

    const taskData = {
      name,
      userId: selectedUser.id || selectedUser.userAppId,
      userName: selectedUser.userName,
      userFirstName: selectedUser.firstName,
      userLastName: selectedUser.lastName,
      assignedUserName: selectedUser.firstName && selectedUser.lastName
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : selectedUser.userAppName || selectedUser.userName,
      formId: formId, // ✅ Önce mevcut data'dan, yoksa workflowFormId'den al
      formName: formName, // ✅ Önce mevcut data'dan, yoksa workflowFormName'den al
      message,
      fieldSettings,
      buttonSettings,
      buttons: visibleButtons, // Görünür butonlar (gösterim için)
      allButtons: allButtons, // TÜM butonlar (handle'lar için)
      visibleFieldsCount,
      totalFieldsCount,
      visibleButtonsCount,
      totalButtonsCount: allButtons.length,
    };

    console.log("🔍 FormTaskModal - Kaydet:", {
      allButtons: allButtons.length,
      visibleButtons: visibleButtons.length,
      taskData,
    });

    if (onSave && node) {
      onSave({
        id: node.id,
        data: taskData,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Form Görevi Ayarları</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Görev Adı */}
          <Box mb={3}>
            <MDInput
              label="Görev Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Kullanıcı Seçimi */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Atanacak Kullanıcı
            </Typography>
            <Autocomplete
              options={searchByName}
              getOptionLabel={(option) => {
                if (option.firstName && option.lastName) {
                  return `${option.firstName} ${option.lastName}`;
                }
                return option.userAppName || option.userName || "";
              }}
              value={selectedUser}
              inputValue={inputValue}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return (
                  option.id === value.id ||
                  option.id === value.userAppId ||
                  option.userAppId === value.id
                );
              }}
              onChange={(event, newValue) => {
                setSelectedUser(newValue);
                if (newValue) {
                  setInputValue(newValue.firstName && newValue.lastName
                    ? `${newValue.firstName} ${newValue.lastName}`
                    : newValue.userAppName || newValue.userName || "");
                }
              }}
              onInputChange={(event, newInputValue, reason) => {
                setInputValue(newInputValue);
                // Kullanıcı yazarken arama yap
                if (reason === "input" && newInputValue.trim().length > 0) {
                  handleSearchByName(newInputValue);
                } else if (reason === "clear" || newInputValue.trim().length === 0) {
                  setSearchByName([]);
                }
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  label="Kullanıcı ara..."
                  placeholder="Kullanıcı adı veya email ile ara"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id || option.userAppId}>
                  <Box>
                    <Typography fontWeight={600}>
                      {option.firstName && option.lastName
                        ? `${option.firstName} ${option.lastName}`
                        : option.userAppName || option.userName}
                    </Typography>
                    {option.email && (
                      <Typography variant="caption" color="textSecondary">
                        {option.email}
                      </Typography>
                    )}
                    {option.userName && (
                      <Typography variant="caption" color="textSecondary">
                        @{option.userName}
                      </Typography>
                    )}
                  </Box>
                </li>
              )}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Mesaj Alanı */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              <MessageIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Kullanıcıya Gösterilecek Mesaj
            </Typography>
            <TextField
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Kullanıcıya gösterilecek mesajı buraya yazın..."
              fullWidth
              helperText="Bu mesaj kullanıcıya form gösterildiğinde görüntülenecektir"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form Bilgisi */}
          {workflowFormName && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Form: {workflowFormName}
              </Typography>
            </Box>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Alanlar" icon={<VisibilityIcon />} iconPosition="start" />
              <Tab label="Butonlar" icon={<SettingsIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Alan Görünürlük Kontrolü Tab */}
          {activeTab === 0 && (
          <Box mb={2}>
            {/* Başlık ve Toplu İşlemler */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Form Alanları Kontrolü ({formFields.length} alan)
              </Typography>
              {formFields.length > 0 && (
                <ButtonGroup size="small" variant="outlined">
                  <Tooltip title="Tümünü Görünür Yap">
                    <MDButton
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={handleSelectAllFields}
                      startIcon={<SelectAllIcon />}
                    >
                      Tümü
                    </MDButton>
                  </Tooltip>
                  <Tooltip title="Tümünü Gizle">
                    <MDButton
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={handleDeselectAllFields}
                      startIcon={<DeselectIcon />}
                    >
                      Hiçbiri
                    </MDButton>
                  </Tooltip>
                </ButtonGroup>
              )}
            </Box>

            {/* Arama Kutusu */}
            {formFields.length > 0 && (
              <TextField
                fullWidth
                size="small"
                placeholder="Alan ara... (isim, tip, vb.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery("")}
                        edge="end"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
            
            {formFields.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="body2" color="textSecondary">
                  Form alanları bulunamadı veya form seçilmemiş.
                </Typography>
              </Paper>
            ) : filteredFields.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="body2" color="textSecondary">
                  &quot;{searchQuery}&quot; için sonuç bulunamadı.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ maxHeight: "500px", overflowY: "auto", pr: 1 }}>
                <Grid container spacing={1.5}>
                  {filteredFields.map((field) => {
                    const isVisible = fieldSettings[field.key]?.visible !== false;
                    const isReadonly = fieldSettings[field.key]?.readonly === true;
                    return (
                      <Grid item xs={12} sm={6} key={field.key}>
                        <Card
                          sx={{
                            border: `2px solid ${isVisible ? (isReadonly ? "#ff9800" : "#4caf50") : "#e0e0e0"}`,
                            bgcolor: isVisible ? (isReadonly ? "#fff3e0" : "#f1f8f4") : "#f5f5f5",
                            transition: "all 0.2s",
                            "&:hover": {
                              boxShadow: 3,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                            {/* Alan Başlığı ve Chips */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                              <Box flex={1}>
                                <Typography
                                  variant="body2"
                                  fontWeight={isVisible ? 600 : 400}
                                  sx={{
                                    mb: 0.5,
                                    color: isVisible ? "text.primary" : "text.secondary",
                                    textDecoration: isVisible ? "none" : "line-through",
                                  }}
                                >
                                  {field.label}
                                </Typography>
                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                  <Chip
                                    label={field.component}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: "18px", fontSize: "0.65rem" }}
                                  />
                                  {field.required && (
                                    <Chip
                                      label="Zorunlu"
                                      size="small"
                                      color="error"
                                      sx={{ height: "18px", fontSize: "0.65rem" }}
                                    />
                                  )}
                                  {isReadonly && (
                                    <Chip
                                      label="Read-Only"
                                      size="small"
                                      color="warning"
                                      sx={{ height: "18px", fontSize: "0.65rem" }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            {/* Kontroller */}
                            <Box display="flex" gap={1} flexWrap="wrap">
                              <Tooltip title={isVisible ? "Görünür" : "Gizli"}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isVisible}
                                      onChange={(e) => handleFieldVisibilityChange(field.key, e.target.checked)}
                                      icon={<VisibilityOffIcon fontSize="small" />}
                                      checkedIcon={<VisibilityIcon fontSize="small" color="success" />}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                                      Görünür
                                    </Typography>
                                  }
                                  sx={{ m: 0 }}
                                />
                              </Tooltip>
                              {isVisible && (
                                <Tooltip title={isReadonly ? "Read-Only" : "Düzenlenebilir"}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={isReadonly}
                                        onChange={(e) => handleFieldReadonlyChange(field.key, e.target.checked)}
                                        icon={<LockOpenIcon fontSize="small" />}
                                        checkedIcon={<LockIcon fontSize="small" color="warning" />}
                                        size="small"
                                      />
                                    }
                                    label={
                                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                                        Read-Only
                                      </Typography>
                                    }
                                    sx={{ m: 0 }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
            
            {/* İstatistikler */}
            {formFields.length > 0 && (
              <Box mt={2} p={1.5} bgcolor="grey.50" borderRadius={1}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Typography variant="caption" fontWeight={600}>
                    📊 İstatistikler:
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    ✅ Görünür: {Object.values(fieldSettings).filter(s => s.visible).length} / {formFields.length}
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    🔒 Read-Only: {Object.values(fieldSettings).filter(s => s.visible && s.readonly).length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    🔍 Filtrelenmiş: {filteredFields.length} / {formFields.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          )}

          {/* Buton Görünürlük Kontrolü Tab */}
          {activeTab === 1 && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Form Butonları Kontrolü
            </Typography>
            
            {formButtons.length === 0 ? (
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="body2" color="textSecondary">
                  Bu formda buton bulunmuyor.
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 2, maxHeight: "400px", overflowY: "auto" }}>
                <FormGroup>
                  {formButtons.map((button) => {
                    const isVisible = buttonSettings[button.id]?.visible !== false;
                    return (
                      <Paper key={button.id} sx={{ p: 1.5, mb: 1.5, bgcolor: isVisible ? "grey.50" : "grey.100" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1} flex={1}>
                            <Typography fontWeight={isVisible ? 600 : 400}>{button.label}</Typography>
                            {button.action && (
                              <Chip
                                label={button.action}
                                size="small"
                                color="primary"
                                sx={{ height: "20px", fontSize: "0.7rem" }}
                              />
                            )}
                            {button.type && (
                              <Chip
                                label={button.type}
                                size="small"
                                variant="outlined"
                                sx={{ height: "20px", fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isVisible}
                                onChange={(e) => handleButtonVisibilityChange(button.id, e.target.checked)}
                                icon={<VisibilityOffIcon />}
                                checkedIcon={<VisibilityIcon />}
                                size="small"
                              />
                            }
                            label="Görünür"
                            sx={{ m: 0 }}
                          />
                        </Box>
                      </Paper>
                    );
                  })}
                </FormGroup>
              </Paper>
            )}
            
            {formButtons.length > 0 && (
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Görünür: {formButtons.filter(btn => buttonSettings[btn.id]?.visible !== false).length} / {formButtons.length} buton
                </Typography>
                <Typography variant="caption" color="warning.main" display="block" mt={0.5}>
                  ⚠️ Görünür butonlar için çıkış handle&apos;ları oluşturulacaktır
                </Typography>
              </Box>
            )}
          </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <MDButton variant="outlined" color="secondary" onClick={onClose}>
          İptal
        </MDButton>
        <MDButton variant="gradient" color="info" onClick={handleSave}>
          Kaydet
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default FormTaskModal;

