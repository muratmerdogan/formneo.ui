import React from "react";
import { List, ListItem, ListItemText, Chip } from "@mui/material";

export default function TodayTasksWidget(): JSX.Element {
    const items = [
        { id: "t3", title: "Müşteri geri dönüşü", due: "Bugün 16:30" },
        { id: "t4", title: "Toplantı notlarını gir", due: "Bugün 18:00" },
    ];
    return (
        <List dense>
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }}>
                    <ListItemText primary={it.title} secondary={it.due} />
                    <Chip color="info" size="small" label="Bugün" />
                </ListItem>
            ))}
        </List>
    );
}


