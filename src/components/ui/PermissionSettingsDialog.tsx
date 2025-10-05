import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    TextField,
    Divider,
    Chip,
    Stack,
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { PermissionLevel, ScreenPermission } from "lib/permissions/types";
import { upsertScreenPermission } from "lib/permissions/storage";
import { UserApi } from "api/generated/api";
import getConfiguration from "confiuration";

type Props = {
    open: boolean;
    onClose: () => void;
    screenId: string;
};

type SimpleUser = { id: string; name: string; email?: string };

const LEVEL_OPTIONS: { value: PermissionLevel; label: string; icon?: React.ReactNode; hint?: string }[] = [
    { value: "view", label: "Görüntüle", hint: "Sadece okuma" },
    { value: "create_edit", label: "Oluştur & Düzenle", hint: "Kayıt ekle/düzenle" },
    { value: "delete", label: "Sil", hint: "Silme yetkisi" },
    { value: "full", label: "Full", hint: "Tüm işlemler" },
];

export default function PermissionSettingsDialog({ open, onClose, screenId }: Props): JSX.Element {
    const [defaultLevel, setDefaultLevel] = useState<PermissionLevel>("full");
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [userQuery, setUserQuery] = useState<string>("");
    const [userOptions, setUserOptions] = useState<SimpleUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Record<string, SimpleUser>>({});
    const [overrides, setOverrides] = useState<Record<string, PermissionLevel>>({});

    const canSave = useMemo(() => !isCustom || (isCustom && Object.keys(overrides).length >= 1), [isCustom, overrides]);

    async function searchUsers(q: string) {
        setUserQuery(q);
        try {
            const conf = getConfiguration();
            const api = new UserApi(conf);
            const res = await api.apiUserGetAllUsersAsyncWitNameGet(q);
            const list: any[] = (res as any)?.data || [];
            const items: SimpleUser[] = list.map((u: any) => ({ id: String(u.id || u.userId || ""), name: u.userName || u.name || u.fullName || "Kullanıcı" }));
            setUserOptions(items);
        } catch {
            setUserOptions([]);
        }
    }

    function addOverride(userId: string, level: PermissionLevel) {
        setOverrides((curr) => ({ ...curr, [userId]: level }));
    }

    function removeOverride(userId: string) {
        setOverrides((curr) => {
            const next = { ...curr };
            delete next[userId];
            return next;
        });
        setSelectedUsers((curr) => {
            const next = { ...curr };
            delete next[userId];
            return next;
        });
    }

    function handleSave() {
        const payload: ScreenPermission = {
            screenId,
            defaultLevel,
            overrides: isCustom ? overrides : {},
            updatedAt: new Date().toISOString(),
        };
        upsertScreenPermission(payload);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>İşlemler · Yetki Ayarları</DialogTitle>
            <DialogContent>
                <div style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>
                    Bu ekran için varsayılan yetki seviyesini belirleyin. İsterseniz belirli kullanıcılar için özel seviyeler atayın.
                </div>

                <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Varsayılan Yetki</div>
                <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={defaultLevel}
                    onChange={(_, v) => { if (v) setDefaultLevel(v); }}
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}
                >
                    {LEVEL_OPTIONS.map(opt => (
                        <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <FormControlLabel
                    control={<Switch checked={isCustom} onChange={(e) => setIsCustom(e.target.checked)} />}
                    label="Özel (kullanıcı bazlı atama)"
                />

                {isCustom && (
                    <div style={{ marginTop: 8 }}>
                        <Autocomplete
                            options={userOptions}
                            getOptionLabel={(o) => o.name}
                            onInputChange={(_, v) => searchUsers(v)}
                            onChange={(_, v) => {
                                if (v?.id) {
                                    setSelectedUsers((curr) => ({ ...curr, [v.id]: v }));
                                    addOverride(v.id, overrides[v.id] || "view");
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Kullanıcı ara" placeholder="Ad..." size="small" />
                            )}
                        />

                        {Object.keys(overrides).length > 0 && (
                            <>
                                <Divider sx={{ my: 1.5 }} />
                                <div style={{ marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Özel Atamalar</div>
                                <Stack direction="column" spacing={1}>
                                    {Object.entries(overrides).map(([uid, lvl]) => (
                                        <div key={uid} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Chip
                                                label={selectedUsers[uid]?.name || uid}
                                                onDelete={() => removeOverride(uid)}
                                                variant="outlined"
                                            />
                                            <ToggleButtonGroup
                                                exclusive
                                                size="small"
                                                value={lvl}
                                                onChange={(_, v) => { if (v) addOverride(uid, v); }}
                                                sx={{ flexWrap: 'wrap' }}
                                            >
                                                {LEVEL_OPTIONS.map((opt) => (
                                                    <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                                                ))}
                                            </ToggleButtonGroup>
                                        </div>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button disabled={!canSave} onClick={handleSave} variant="contained">Kaydet</Button>
            </DialogActions>
        </Dialog>
    );
}


