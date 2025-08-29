import React from "react";
import NotesGrid, { NoteRow } from "components/form/NotesGrid";

type Props = {
    register: any;
    errors: Record<string, any>;
    rows: NoteRow[];
    onChange: (rows: NoteRow[]) => void;
    customerId?: string;
    autoSave?: boolean;
};

export default function NotesSection({ register, errors, rows, onChange, customerId, autoSave }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 gap-4">
            <NotesGrid
                label="Notlar"
                rows={rows}
                onChange={onChange}
                customerId={customerId}
                autoSave={autoSave}
            />
        </div>
    );
}


