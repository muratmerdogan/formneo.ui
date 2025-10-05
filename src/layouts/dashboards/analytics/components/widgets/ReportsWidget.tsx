import React from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";

export default function ReportsWidget(): JSX.Element {
    const items = [
        { id: "r1", title: "Haftalık İş Özeti" },
        { id: "r2", title: "SLA İhlal Raporu" },
    ];
    return (
        <List dense>
            {items.map((it) => (
                <ListItem key={it.id} sx={{ px: 0 }} secondaryAction={<Button size="small">Aç</Button>}>
                    <ListItemText primary={it.title} />
                </ListItem>
            ))}
        </List>
    );
}


