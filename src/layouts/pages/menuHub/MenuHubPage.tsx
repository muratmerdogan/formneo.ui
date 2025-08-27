import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, MenuApi } from "api/generated/api";
import getConfiguration from "confiuration";

export default function MenuHubPage(): JSX.Element {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [parent, setParent] = useState<any | null>(null);
    const [auth, setAuth] = useState<Menu[]>([]);
    const [q, setQ] = useState("");
    const [pinned, setPinned] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem("menuHub:pinned") || "[]"); } catch { return []; }
    });

    useEffect(() => {
        (async () => {
            try {
                const api = new MenuApi(getConfiguration());
                const res = await api.apiMenuAllListDataGet();
                const data: any[] = (res as any)?.data || [];
                setItems(data);
                const p = data.find((m) => String(m.id) === String(id) || String(m.menuCode) === String(id)) || null;
                setParent(p);
                try {
                    const authRes = await api.apiMenuGetAuthByUserGet();
                    setAuth(authRes.data || []);
                } catch { }
            } catch { }
        })();
    }, [id]);

    const subs = useMemo(() => {
        if (!parent) return [] as any[];
        const all = Array.isArray(parent.subMenus) && parent.subMenus.length
            ? (parent.subMenus as any[])
            : items.filter((x) => String(x.parentMenuId || "") === String(parent.id || ""));
        const hasAuth = (m: any) => {
            const href = (m.href && String(m.href).trim()) || (m.route && String(m.route).trim()) || "";
            const norm = "/" + href.split("/").slice(1, 2).join("/");
            return auth.some((a) => ("/" + String(a.href || "").split("/").slice(1, 2).join("/")) === norm);
        };
        const filtered = all.filter((m) => hasAuth(m));
        const search = q.trim().toLowerCase();
        const searched = search ? filtered.filter((m) => String(m.name || "").toLowerCase().includes(search)) : filtered;
        return searched.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [items, parent, auth, q]);

    const togglePin = (key: string) => {
        setPinned((prev) => {
            const next = prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key];
            try { localStorage.setItem("menuHub:pinned", JSON.stringify(next)); } catch { }
            return next;
        });
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-semibold">{parent?.name || "Menü"}</div>
                        <div className="text-sm text-slate-500">Alt menüler</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" className="h-9 px-3 rounded-md border" />
                </div>

                {!!subs.length && (
                    <>
                        {subs.some((m) => pinned.includes(String(m.id || m.menuCode))) && (
                            <div>
                                <div className="text-xs font-semibold text-slate-500 mb-2">Sabitlenenler</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                    {subs.filter((m) => pinned.includes(String(m.id || m.menuCode))).map((m) => {
                                        const href = (m.href && String(m.href).trim()) || (m.route && String(m.route).trim()) || "#";
                                        const key = String(m.id || m.menuCode);
                                        return (
                                            <div key={key} className="text-left rounded-xl border bg-white shadow-sm p-4 hover:border-slate-400">
                                                <div className="flex items-start justify-between">
                                                    <div className="text-sm font-medium">{m.name}</div>
                                                    <button onClick={() => togglePin(key)} className="text-xs text-slate-500 hover:text-slate-700">Kaldır</button>
                                                </div>
                                                {m.description && <div className="text-xs text-slate-500 mt-1">{m.description}</div>}
                                                <div className="mt-3">
                                                    <button onClick={() => href !== "#" && navigate(href)} className="h-8 px-3 rounded-md border bg-slate-900 text-white text-xs">Aç</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="text-xs font-semibold text-slate-500 mb-2">Tümü</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {subs.map((m) => {
                                const href = (m.href && String(m.href).trim()) || (m.route && String(m.route).trim()) || "#";
                                const key = String(m.id || m.menuCode);
                                const isPinned = pinned.includes(key);
                                return (
                                    <div key={key} className="text-left rounded-xl border bg-white shadow-sm p-4 hover:border-slate-400">
                                        <div className="flex items-start justify-between">
                                            <div className="text-sm font-medium">{m.name}</div>
                                            <button onClick={() => togglePin(key)} className="text-xs text-slate-500 hover:text-slate-700">{isPinned ? "Kaldır" : "Sabitle"}</button>
                                        </div>
                                        {m.description && <div className="text-xs text-slate-500 mt-1">{m.description}</div>}
                                        <div className="mt-3">
                                            <button onClick={() => href !== "#" && navigate(href)} className="h-8 px-3 rounded-md border bg-slate-900 text-white text-xs">Aç</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                {!subs.length && (
                    <div className="text-sm text-slate-500">Bu menüye bağlı alt menü bulunamadı.</div>
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
}


