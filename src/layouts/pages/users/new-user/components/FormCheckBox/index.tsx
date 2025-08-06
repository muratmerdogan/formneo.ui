import { ErrorMessage, Field } from "formik";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface Props {
    label: string;
    name: string;
    [key: string]: any;
}

function FormField({ label, name, ...rest }: Props): JSX.Element {
    return (
        <MDBox mb={1.5}>
            <Field name={name}>
                {({ field }: { field: any }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...field}
                                checked={field.value}
                                {...rest}
                            />
                        }
                        label={label}
                    />
                )}
            </Field>
            <MDBox mt={0.75}>
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                    <ErrorMessage name={name} />
                </MDTypography>
            </MDBox>
        </MDBox>
    );
}

export default FormField;
