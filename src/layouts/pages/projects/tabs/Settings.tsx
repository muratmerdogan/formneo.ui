import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function SettingsTab(): JSX.Element {
  const [section, setSection] = useState<"users" | "tags">("users");
  const [managers, setManagers] = useState<string[]>(["Murat", "Zeynep"]);
  const [teamMembers, setTeamMembers] = useState<string[]>(["Ali", "Ayşe", "Mehmet"]);

  const [addOpen, setAddOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<"managers" | "team">("team");
  const [candidate, setCandidate] = useState<string>("");
  const userOptions = ["Murat", "Zeynep", "Ali", "Ayşe", "Mehmet", "Can", "Ece", "Deniz"];

  return (
    <MDBox>
      {/* Button-based sub navigation */}
      <MDBox mb={2}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <MDButton
            variant={section === "users" ? "gradient" : "outlined"}
            color="info"
            size="small"
            onClick={() => setSection("users")}
            startIcon={<Icon sx={{ fontSize: 18 }}>group</Icon>}
            sx={{ textTransform: "none" }}
          >
            Kullanıcılar
          </MDButton>
          <MDButton
            variant={section === "tags" ? "gradient" : "outlined"}
            color="info"
            size="small"
            onClick={() => setSection("tags")}
            startIcon={<Icon sx={{ fontSize: 18 }}>label</Icon>}
            sx={{ textTransform: "none" }}
          >
            Etiketler
          </MDButton>
        </Stack>
      </MDBox>

      {/* Users (Managers + Team Members in one section) */}
      {section === "users" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title={<MDTypography variant="h6">Proje Yöneticileri</MDTypography>} action={
                <MDButton variant="text" color="info" size="small" onClick={() => { setAddTarget("managers"); setAddOpen(true); }}>
                  <Icon sx={{ fontSize: 18, mr: 0.5 }}>add</Icon> Ekle
                </MDButton>
              } />
              <CardContent>
                <Grid container spacing={1.5}>
                  {managers.map((name) => (
                    <Grid item key={name}>
                      <MDBox sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>{name.charAt(0)}</Avatar>
                        <MDTypography variant="caption">{name}</MDTypography>
                        <IconButton size="small" onClick={() => setManagers((prev) => prev.filter((x) => x !== name))}>
                          <Icon sx={{ fontSize: 16 }}>close</Icon>
                        </IconButton>
                      </MDBox>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title={<MDTypography variant="h6">Ekip Üyeleri</MDTypography>} action={
                <MDButton variant="text" color="info" size="small" onClick={() => { setAddTarget("team"); setAddOpen(true); }}>
                  <Icon sx={{ fontSize: 18, mr: 0.5 }}>add</Icon> Ekle
                </MDButton>
              } />
              <CardContent>
                <Grid container spacing={1.5}>
                  {teamMembers.map((name) => (
                    <Grid item key={name}>
                      <MDBox sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>{name.charAt(0)}</Avatar>
                        <MDTypography variant="caption">{name}</MDTypography>
                        <IconButton size="small" onClick={() => setTeamMembers((prev) => prev.filter((x) => x !== name))}>
                          <Icon sx={{ fontSize: 16 }}>close</Icon>
                        </IconButton>
                      </MDBox>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {section === "tags" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={<MDTypography variant="h6">Proje Etiketleri</MDTypography>} />
              <CardContent>
                <MDTypography variant="body2" color="text" sx={{ mb: 1.5 }}>
                  Proje içinde kullanılacak etiketleri tanımlayın.
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  Not: Etiket CRUD işlemleri eklenecek.
                </MDTypography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add User Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Kullanıcı Ekle</DialogTitle>
        <DialogContent>
          <MDTypography variant="caption" color="text" sx={{ display: 'block', mb: 1 }}>
            Hedef: {addTarget === 'managers' ? 'Proje Yöneticileri' : 'Ekip Üyeleri'}
          </MDTypography>
          <Autocomplete
            options={userOptions}
            value={candidate}
            onChange={(_, v) => setCandidate(v || "")}
            renderInput={(params) => <TextField {...params} label="Kullanıcı adı" />}
          />
        </DialogContent>
        <DialogActions>
          <MDButton variant="text" color="secondary" onClick={() => setAddOpen(false)}>Vazgeç</MDButton>
          <MDButton variant="contained" color="info" onClick={() => {
            if (!candidate) return;
            if (addTarget === 'managers') setManagers((prev) => Array.from(new Set([...prev, candidate])));
            else setTeamMembers((prev) => Array.from(new Set([...prev, candidate])));
            setCandidate("");
            setAddOpen(false);
          }}>Ekle</MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default SettingsTab;


