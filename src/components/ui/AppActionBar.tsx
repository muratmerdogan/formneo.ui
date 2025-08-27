import React from "react";
import { useNavigate } from "react-router-dom";
import { useActionBar } from "context/ActionBarContext";

export default function AppActionBar(): JSX.Element {
    const navigate = useNavigate();
    const { actions } = useActionBar();

    const goBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/dashboards/analytics");
    };

    // Aksiyon yoksa bar'ı göstermeyelim
    if (!actions || actions.length === 0) return <></>;

    return (
        <div className="fixed top-[52px] left-0 right-0 z-30 px-3 md:px-6 lg:px-8 py-2 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={goBack} className="h-8 px-3 rounded-md border text-sm hover:bg-slate-50">
                        ← Geri
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {actions.map((a) => (
                        <button key={a.id} disabled={a.disabled} onClick={a.onClick} className="h-8 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50 text-sm flex items-center gap-1 hover:bg-slate-800">
                            {a.icon}
                            <span>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


