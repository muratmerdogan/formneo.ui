import React, { useEffect, useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MDTypography from "components/MDTypography";
import { TenantProjectsApi, CustomersApi, UserApi, TenantProjectInsertDto } from "api/generated/api";
import getConfiguration from "confiuration";

export default function ProjectCreateDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void; }): JSX.Element {
  const [name, setName] = useState("");
  const [parent, setParent] = useState<{ id: string; label: string } | null>(null);
  const [customers, setCustomers] = useState<string[]>([]);
  const [managers, setManagers] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [projectOptions, setProjectOptions] = useState<{ id: string; label: string }[]>([]);
  const [customerOptions, setCustomerOptions] = useState<string[]>([]);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const conf = getConfiguration();
        const tApi = new TenantProjectsApi(conf);
        const cApi = new CustomersApi(conf);
        const uApi = new UserApi(conf);
        // Projects (tenant)
        const pRes: any = await tApi.apiTenantProjectsGet();
        const pItems: any[] = (pRes as any)?.data || [];
        setProjectOptions(pItems.map((p: any) => ({ id: String(p.id || p.projectId || ""), label: String(p.name || p.title || "") })));
        // Customers
        const cRes: any = await cApi.apiCustomersPagedGet(1, 20, true, undefined as any);
        const cItems: any[] = (cRes as any)?.data?.items || (cRes as any)?.data || [];
        setCustomerOptions(cItems.map((c: any) => String(c.name || c.customerName || c.title || "")));
        // Users (names)
        const uRes: any = await uApi.apiUserGetLoginUserDetailGet();
        const selfName = String((uRes as any)?.data?.firstName || "") + " " + String((uRes as any)?.data?.lastName || "");
        setUserOptions([selfName].filter(Boolean));
      } catch {}
    })();
  }, [open]);

  const canSave = name.trim().length >= 3;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      setLoading(true);
      const conf = getConfiguration();
      const api = new TenantProjectsApi(conf);
      const dto: TenantProjectInsertDto = {
        name,
        description: undefined as any,
        parentProjectId: parent?.id as any,
        customerNames: customers as any,
        managerNames: managers as any,
        memberNames: members as any,
        isPrivate,
      } as any;
      await api.apiTenantProjectsPost(dto);
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <MDTypography variant="h6">Yeni Proje</MDTypography>
        <IconButton aria-label="Kapat" onClick={onClose} size="small">
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Ad *" value={name} onChange={(e) => setName(e.target.value)} fullWidth required size="small" autoFocus />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={projectOptions}
              getOptionLabel={(o) => o.label}
              value={parent}
              onChange={(_, v) => setParent(v)}
              renderInput={(p) => <TextField {...p} label="Üst Proje" size="small" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple freeSolo
              options={customerOptions}
              value={customers}
              onChange={(_, v) => setCustomers(v as string[])}
              renderInput={(p) => <TextField {...p} label="Müşteri (çoklu)" size="small" placeholder="Müşteri ekle" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple freeSolo
              options={userOptions}
              value={managers}
              onChange={(_, v) => setManagers(v as string[])}
              renderInput={(p) => <TextField {...p} label="Yöneticiler" size="small" placeholder="Kullanıcı ekle" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple freeSolo
              options={userOptions}
              value={members}
              onChange={(_, v) => setMembers(v as string[])}
              renderInput={(p) => <TextField {...p} label="Üyeler" size="small" placeholder="Kullanıcı ekle" />}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />} label="Gizli proje" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="secondary"
          startIcon={<Icon>close</Icon>}
          sx={{ color: '#fff' }}
        >
          İptal
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon>save</Icon>}
          disabled={!canSave || loading}
          onClick={handleSave}
          sx={{ color: '#fff' }}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
