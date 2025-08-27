import React from "react";

type Props = {
    register: any;
    errors: Record<string, any>;
};

export default function NotesSection({ register, errors }: Props): JSX.Element {
    return (
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Not</label>
                <textarea {...register("note")} rows={4} className="w-full px-3 py-2 rounded-md border" placeholder="Kısa not" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Zengin Not</label>
                <textarea {...register("richNote")} rows={6} className="w-full px-3 py-2 rounded-md border font-mono text-xs" placeholder={'<p>Not</p>'} />
            </div>
        </div>
    );
}


