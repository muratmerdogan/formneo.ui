
import React, { useState } from "react";
import { List, ListItem, ListItemText, Chip, IconButton, Stack, Typography } from "@mui/material";
import Icon from "@mui/material/Icon";

export default function TodayTasksWidget(): JSX.Element {
    const [items, setItems] = useState([
        { id: "t3", title: "Müşteri geri dönüşü", due: "Bugün 16:30" },
        { id: "t4", title: "Toplantı notlarını gir", due: "Bugün 18:00" },
    ]);
    const handleComplete = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));
    const handleDelete = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));
    const handleDetail = (id: string) => alert(`Görev Detay: ${id}`);
    return (
        <List dense>
            {items.length === 0 && (
                <ListItem>
                    <Typography color="text.secondary" sx={{ fontStyle: "italic", width: "100%", textAlign: "center" }}>Görev yok</Typography>
                </ListItem>
            )}
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }}
                    secondaryAction={
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip color="info" size="small" label="Bugün" />
                            <IconButton color="success" size="small" onClick={() => handleComplete(it.id)} title="Tamamla">
                                <Icon>check_circle</Icon>
                            </IconButton>
                            <IconButton color="info" size="small" onClick={() => handleDetail(it.id)} title="Detay">
                                <Icon>info</Icon>
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => handleDelete(it.id)} title="Sil">
                                <Icon>delete</Icon>
                            </IconButton>
                        </Stack>
                    }
                >
                    <ListItemText primary={it.title} secondary={it.due} />
                </ListItem>
            ))}
        </List>
    );
}


