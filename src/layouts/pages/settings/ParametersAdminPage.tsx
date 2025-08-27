import React, { useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useCreateCategory, useCreateParameter, useDeleteCategory, useDeleteParameter, useListParameters, useSettingsCategories, useUpdateCategory, useUpdateParameter } from "lib/settings/hooks";
import { SettingsCategory, SettingsParameter } from "lib/settings/types";

export default function ParametersAdminPage(): JSX.Element {
    const { data: cats } = useSettingsCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(cats?.[0]?.id);
    const { data: params } = useListParameters(selectedCategoryId);

    const { mutateAsync: createCat } = useCreateCategory();
    const { mutateAsync: updateCat } = useUpdateCategory();
    const { mutateAsync: deleteCat } = useDeleteCategory();

    const { mutateAsync: createParam } = useCreateParameter();
    const { mutateAsync: updateParam } = useUpdateParameter();
    const { mutateAsync: deleteParam } = useDeleteParameter();

    const [catForm, setCatForm] = useState<Partial<SettingsCategory>>({});
    const [paramForm, setParamForm] = useState<Partial<SettingsParameter>>({ type: "string", categoryId: selectedCategoryId });

    const types = useMemo(() => ["string", "number", "boolean", "select", "multiselect", "json"], []);

    const onCreateCategory = async () => {
        if (!catForm.id || !catForm.name) return;
        await createCat({ id: catForm.id, name: catForm.name, description: catForm.description, orderNo: catForm.orderNo });
        setCatForm({});
    };

    const onUpdateCategory = async () => {
        if (!selectedCategoryId) return;
        await updateCat({ id: selectedCategoryId, changes: catForm });
        setCatForm({});
    };

    const onDeleteCategory = async () => {
        if (!selectedCategoryId) return;
        await deleteCat(selectedCategoryId);
        setSelectedCategoryId(undefined);
    };

    const onCreateParameter = async () => {
        if (!paramForm.id || !paramForm.name || !paramForm.type) return;
        const payload: SettingsParameter = {
            id: paramForm.id as string,
            categoryId: (paramForm.categoryId as string) || (selectedCategoryId as string),
            name: paramForm.name as string,
            description: paramForm.description,
            type: paramForm.type as any,
            required: paramForm.required,
            defaultValue: paramForm.defaultValue,
            options: (paramForm.options as any) || undefined,
            orderNo: paramForm.orderNo,
        };
        await createParam(payload);
        setParamForm({ type: "string", categoryId: selectedCategoryId });
    };

    const onUpdateParameter = async () => {
        if (!paramForm.id) return;
        const { id, ...changes } = paramForm as any;
        await updateParam({ id, changes });
        setParamForm({ type: "string", categoryId: selectedCategoryId });
    };

    const onDeleteParameter = async (id: string) => {
        await deleteParam(id);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Kategoriler</div>
                        <div className="space-y-2">
                            {(cats || []).map((c) => (
                                <button key={c.id} onClick={() => setSelectedCategoryId(c.id)} className={`w-full text-left px-3 py-2 rounded-md border ${selectedCategoryId === c.id ? "bg-slate-900 text-white" : "bg-white"}`}>
                                    <div className="text-sm font-medium">{c.name}</div>
                                    {c.description && <div className="text-xs opacity-70">{c.description}</div>}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Kategori Düzenle</div>
                        <div className="space-y-2 p-3 rounded-md border">
                            <input placeholder="id" value={catForm.id || ""} onChange={(e) => setCatForm({ ...catForm, id: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            <input placeholder="Ad" value={catForm.name || ""} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            <input placeholder="Açıklama" value={catForm.description || ""} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            <input placeholder="Sıra No" type="number" value={catForm.orderNo || 0} onChange={(e) => setCatForm({ ...catForm, orderNo: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md border" />
                            <div className="flex gap-2">
                                <button onClick={onCreateCategory} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Ekle</button>
                                <button onClick={onUpdateCategory} className="h-9 px-3 rounded-md border">Güncelle</button>
                                <button onClick={onDeleteCategory} className="h-9 px-3 rounded-md border text-rose-600">Sil</button>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Parametre Ekle/Düzenle</div>
                        <div className="space-y-2 p-3 rounded-md border">
                            <input placeholder="id" value={paramForm.id || ""} onChange={(e) => setParamForm({ ...paramForm, id: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            <input placeholder="Ad" value={paramForm.name || ""} onChange={(e) => setParamForm({ ...paramForm, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            <select value={paramForm.categoryId || selectedCategoryId || ""} onChange={(e) => setParamForm({ ...paramForm, categoryId: e.target.value })} className="w-full h-9 px-3 rounded-md border">
                                <option value="">Kategori seçin</option>
                                {(cats || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <select value={paramForm.type as any} onChange={(e) => setParamForm({ ...paramForm, type: e.target.value as any })} className="w-full h-9 px-3 rounded-md border">
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input placeholder="Sıra No" type="number" value={paramForm.orderNo || 0} onChange={(e) => setParamForm({ ...paramForm, orderNo: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md border" />
                            <textarea placeholder="Açıklama" value={paramForm.description || ""} onChange={(e) => setParamForm({ ...paramForm, description: e.target.value })} className="w-full h-20 px-3 rounded-md border" />
                            {paramForm.type === "select" || paramForm.type === "multiselect" ? (
                                <textarea placeholder='Seçenekler (JSON): [{"value":"gold","label":"Gold"}]' value={JSON.stringify(paramForm.options || [], null, 2)} onChange={(e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value || "[]");
                                        setParamForm({ ...paramForm, options: parsed });
                                    } catch { }
                                }} className="w-full h-24 px-3 rounded-md border font-mono text-xs" />
                            ) : null}
                            {(paramForm.type === "string" || paramForm.type === "number") && (
                                <input placeholder="Varsayılan Değer" value={(paramForm.defaultValue as any) || ""} onChange={(e) => setParamForm({ ...paramForm, defaultValue: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                            )}
                            {paramForm.type === "boolean" && (
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(paramForm.defaultValue)} onChange={(e) => setParamForm({ ...paramForm, defaultValue: e.target.checked })} /> Varsayılan</label>
                            )}
                            {paramForm.type === "json" && (
                                <textarea placeholder='Varsayılan JSON' value={typeof paramForm.defaultValue === "string" ? (paramForm.defaultValue as string) : JSON.stringify(paramForm.defaultValue || {}, null, 2)} onChange={(e) => setParamForm({ ...paramForm, defaultValue: e.target.value })} className="w-full h-24 px-3 rounded-md border font-mono text-xs" />
                            )}
                            <div className="flex gap-2">
                                <button onClick={onCreateParameter} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Ekle</button>
                                <button onClick={onUpdateParameter} className="h-9 px-3 rounded-md border">Güncelle</button>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Parametreler ({selectedCategoryId || "-"})</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {(params || []).map((p) => (
                            <div key={p.id} className="p-3 rounded-md border">
                                <div className="text-sm font-medium">{p.name} <span className="text-xs opacity-60">({p.id})</span></div>
                                <div className="text-xs opacity-70">{p.type}</div>
                                <div className="text-xs mt-1">Sıra: {p.orderNo ?? "-"}</div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setParamForm(p)} className="h-8 px-3 rounded-md border">Düzenle</button>
                                    <button onClick={() => onDeleteParameter(p.id)} className="h-8 px-3 rounded-md border text-rose-600">Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </DashboardLayout>
    );
}


