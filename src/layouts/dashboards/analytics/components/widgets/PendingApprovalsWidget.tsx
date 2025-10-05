import React from "react";
import { List, ListItem, ListItemText, Chip } from "@mui/material";

export default function PendingApprovalsWidget(): JSX.Element {
    const items = [
        { id: "a1", title: "İzin Formu #421", due: "2 bekleyen" },
        { id: "a2", title: "Harcama Onayı #982", due: "1 bekleyen" },
    ];
    return (
        <List dense>
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }}>
                    <ListItemText primary={it.title} secondary={it.due} />
                    <Chip color="warning" size="small" label="Onay" />
                </ListItem>
            ))}
        </List>
    );
}


