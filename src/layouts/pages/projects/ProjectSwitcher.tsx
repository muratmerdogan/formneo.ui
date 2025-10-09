import React, { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

type Project = { id: string; name: string; favorite?: boolean; recent?: boolean };

export default function ProjectSwitcher({
  open,
  onClose,
  onSelect,
  projects,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (projectId: string) => void;
  projects: Project[];
}): JSX.Element {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.slice(0, 20);
    return projects
      .map((p) => ({
        p,
        score: p.name.toLowerCase().includes(q) ? 1 : p.id.includes(q) ? 0.5 : 0,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p)
      .slice(0, 20);
  }, [projects, query]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <MDTypography variant="h6">Proje Seç</MDTypography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Proje ara… (⌘K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ "aria-label": "Proje ara" }}
        />
        <MDBox mt={2}>
          <List>
            {filtered.map((p, idx) => (
              <React.Fragment key={p.id}>
                <ListItemButton onClick={() => onSelect(p.id)}>
                  <ListItemText primary={p.name} secondary={`ID: ${p.id}`} />
                </ListItemButton>
                {idx !== filtered.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <MDBox p={2}>
                <MDTypography variant="body2" color="text">Sonuç bulunamadı.</MDTypography>
              </MDBox>
            )}
          </List>
        </MDBox>
      </DialogContent>
    </Dialog>
  );
}


