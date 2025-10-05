import React from "react";
import { List, ListItem, ListItemText, Chip } from "@mui/material";

export default function NextWeekTasksWidget(): JSX.Element {
    const items = [
        { id: "t5", title: "Sözleşme taslağı", due: "Pzt 10:00" },
        { id: "t6", title: "Eğitim planı", due: "Çar 14:00" },
    ];
    return (
        <List dense>
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }}>
                    <ListItemText primary={it.title} secondary={it.due} />
                    <Chip color="default" size="small" label="Planlı" />
                </ListItem>
            ))}
        </List>
    );
}


