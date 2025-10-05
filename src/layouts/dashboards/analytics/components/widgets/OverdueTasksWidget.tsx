import React from "react";
import { List, ListItem, ListItemText, Chip } from "@mui/material";

export default function OverdueTasksWidget(): JSX.Element {
    const items = [
        { id: "t1", title: "Teklif onayı", due: "2 gün gecikti" },
        { id: "t2", title: "SLA Yanıtı", due: "1 gün gecikti" },
    ];
    return (
        <List dense>
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }}>
                    <ListItemText primary={it.title} secondary={it.due} />
                    <Chip color="error" size="small" label="Gecikmiş" />
                </ListItem>
            ))}
        </List>
    );
}


