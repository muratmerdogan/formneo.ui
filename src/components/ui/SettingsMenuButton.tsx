import React, { useState } from "react";
import { Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PermissionSettingsDialog from "components/ui/PermissionSettingsDialog";

type Props = {
    screenId: string;
};

export default function SettingsMenuButton({ screenId }: Props): JSX.Element {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                size="small"
                variant="contained"
                color="info"
                startIcon={<SettingsIcon sx={{ fontSize: 16, color: "currentColor" }} />}
                onClick={() => setOpen(true)}
            >
                İşlemler
            </Button>
            <PermissionSettingsDialog open={open} onClose={() => setOpen(false)} screenId={screenId} />
        </>
    );
}


