import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { FormDataApi } from "api/generated";
import getConfiguration from "confiuration";

export default function WorkflowFormSelector({ open, onClose, onConfirm }) {
  const [formOptions, setFormOptions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchForms = async () => {
        try {
          const conf = getConfiguration();
          const api = new FormDataApi(conf);
          const res = await api.apiFormDataGet();
          
          // ✅ Önce sadece yayınlanmış formları filtrele (publicationStatus = 2)
          const publishedForms = (res.data || []).filter((form) => form.publicationStatus === 2);
          
          // Formları parentFormId'ye göre grupla
          const groupByParent = (rows) => {
            const map = {};
            rows.forEach((r) => {
              const key = r.parentFormId || r.id;
              map[key] = map[key] || [];
              map[key].push(r);
            });
            return map;
          };

          // Her grup için en son revizyonu seç
          const pickLatestRevision = (arr) => {
            // Zaten sadece yayınlanmış formlar geldiği için direkt en büyük revision'ı seç
            return [...arr].sort((a, b) => (b.revision || 0) - (a.revision || 0))[0];
          };

          const groups = groupByParent(publishedForms);
          const latestForms = Object.values(groups).map((group) => pickLatestRevision(group));
          
          console.log("API'den gelen form verileri:", res.data);
          console.log("Yayınlanmış formlar:", publishedForms);
          console.log("Son revizyonlar filtrelendi:", latestForms);
          setFormOptions(latestForms);
        } catch (error) {
          console.error("Formlar çekilemedi", error);
        }
      };
      fetchForms();
    }
  }, [open]);

  const handleConfirm = () => {
    if (selectedForm) {
      onConfirm(selectedForm);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6" mb={2}>
          Bir Form Seçin
        </Typography>

        {/* ComboBox */}
        <Autocomplete
          options={formOptions}
          getOptionLabel={(option) => `${option.formName} (${option.id})`} // 🔧 eşsiz hale getirildi
          value={selectedForm}
          onChange={(event, newValue) => setSelectedForm(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Form Seçiniz"
              placeholder="Form Ara..."
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* SEÇİLEN FORM BİLGİLERİ */}
        {selectedForm && (
          <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Seçilen Form:
            </Typography>
            <Typography variant="body2">ID: {selectedForm.id}</Typography>
            <Typography variant="body2">Adı: {selectedForm.formName}</Typography>
          </Box>
        )}

        <Box textAlign="right" mt={2}>
          <Button
            variant="contained"
            disabled={!selectedForm}
            onClick={handleConfirm}
            sx={{ color: "#f5f5f5" }}
          >
            Devam Et
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
