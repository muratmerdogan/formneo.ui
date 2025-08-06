// formik components
import { useField } from "formik";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import GenericSelectDialogWithInputEnum from "layouts/UserComponents/GenericSelectDialogWithInputEnum";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { GenericList } from "api/generated";
import React from "react";

// Declaring props types for FormGenericSelect
interface Props {
  label: string;
  name: string;
  value: any;
  displayValue: string,
  dataId: GenericList; // Dialog için gerekli data ID
  headerText: string; // Dialog başlığı
  [key: string]: any;
}

function FormGenericSelect({ label, name, value, displayValue, dataId, headerText, ...rest }: Props): JSX.Element {
  // Formik field ile entegrasyon
  const [field, meta, helpers] = useField(name);

  const [genericDialogOpen, setGenericDialogOpen] = useState(false);
  const { setValue } = helpers; // Formik'in değerini güncellemek için setValue


  useEffect(() => {

  }, []);
  const handleConfirm = (selectedValue: string) => {
    setValue(selectedValue); // Formik değerini güncelle
  };
  return (
    <MDBox mb={1.5}>
      {/* Label Ekleme */}
      <MDTypography variant="caption" fontWeight="bold" display="block" mb={0.5}>
        {label}
      </MDTypography>
      <GenericSelectDialogWithInputEnum
        dataId={dataId} // Dialog için dataId
        value={value} // Dialog’a mevcut Formik değeri aktarılır
        headerText={headerText}
        displayValue={displayValue}
        open={genericDialogOpen} // Dialog açık durumu, burada sabit "true" olarak ayarlandı
        onClose={() => setGenericDialogOpen(false)}
        onConfirm={(e) => { handleConfirm(e.externalCode) }} // Seçim yapıldığında çağrılır
        {...rest}
      />
      {meta.touched && meta.error && (
        <MDBox mt={0.5}>
          <MDBox color="error" fontSize="sm">
            {meta.error} {/* Hata mesajını göster */}
          </MDBox>
        </MDBox>
      )}
    </MDBox>
  );
}

export default React.memo(FormGenericSelect);;
