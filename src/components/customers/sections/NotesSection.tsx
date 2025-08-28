import React, { useState } from "react";
import NotesGrid, { NoteRow } from "components/form/NotesGrid";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function NotesSection({ register, errors }: Props): JSX.Element {
    const [rows, setRows] = useState<NoteRow[]>([]);
    return (
        <div className="grid grid-cols-1 gap-4">
            <NotesGrid label="Notlar" rows={rows} onChange={setRows} />
            {/* İstenirse form submitte saklamak için */}
            <input type="hidden" value={JSON.stringify(rows)} {...register("notesJson")} />
        </div>
    );
}


