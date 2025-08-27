import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { LookupApi, LookupCategoryDto, LookupItemDto } from "api/generated";

export default function LookupAdminPage(): JSX.Element {
    const [categories, setCategories] = useState<LookupCategoryDto[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<LookupCategoryDto | undefined>(undefined);
    const [items, setItems] = useState<LookupItemDto[]>([]);
    const [itemsFilter, setItemsFilter] = useState("");

    const [catForm, setCatForm] = useState<LookupCategoryDto>({ key: "", description: "", isTenantScoped: false, isReadOnly: false });
    const [itemForm, setItemForm] = useState<LookupItemDto>({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
    const [isCatModalOpen, setCatModalOpen] = useState(false);
    const [isItemModalOpen, setItemModalOpen] = useState(false);

    const [isLoadingCats, setIsLoadingCats] = useState(false);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isSubmittingCat, setIsSubmittingCat] = useState(false);
    const [isSubmittingItem, setIsSubmittingItem] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditCat, setIsEditCat] = useState(false);
    const [isEditItem, setIsEditItem] = useState(false);
    const [categoryPage, setCategoryPage] = useState(0);
    const [categoryPageSize] = useState(15);

    const api = useMemo(() => new LookupApi(getConfiguration()), []);

    const fetchCategories = async () => {
        try {
            setIsLoadingCats(true);
            setError(null);
            const res: any = await api.apiLookupCategoriesGet();
            const data = (res?.data || []) as LookupCategoryDto[];
            setCategories(data);
            if (!selectedCategory && data.length > 0) setSelectedCategory(data[0]);
        } catch (e: any) {
            setError(e?.message || "Kategoriler yüklenirken hata oluştu");
        } finally {
            setIsLoadingCats(false);
        }
    };

    const fetchItemsByKey = async (key?: string | null) => {
        try {
            setIsLoadingItems(true);
            setError(null);
            if (!key) { setItems([]); return; }
            const res: any = await api.apiLookupItemsKeyGet(key);
            const data = (res?.data || []) as LookupItemDto[];
            setItems(data);
        } catch (e: any) {
            setError(e?.message || "Öğeler yüklenirken hata oluştu");
        } finally {
            setIsLoadingItems(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchItemsByKey(selectedCategory?.key ?? null); }, [selectedCategory?.key]);

    const onCreateCategory = async () => {
        if (!catForm.key || !catForm.key.trim()) { setError("Kategori key alanı zorunludur"); return; }
        try {
            setIsSubmittingCat(true);
            setError(null);
            const payload: LookupCategoryDto = {
                key: catForm.key.trim(),
                description: (catForm.description || "").trim(),
                isTenantScoped: Boolean(catForm.isTenantScoped),
                isReadOnly: Boolean(catForm.isReadOnly),
            };
            await api.apiLookupCategoriesPost(payload as any);
            setCatForm({ key: "", description: "", isTenantScoped: false, isReadOnly: false });
            await fetchCategories();
            // Yeni oluşturulan kategoriyi seçmeye çalış
            const created = categories.find(c => c.key === payload.key);
            if (created) setSelectedCategory(created);
            setCatModalOpen(false);
        } catch (e: any) {
            setError(e?.message || "Kategori oluşturulamadı");
        } finally {
            setIsSubmittingCat(false);
        }
    };

    const onCreateItem = async () => {
        if (!selectedCategory?.id && !selectedCategory?.key) { setError("Lütfen önce bir kategori seçin"); return; }
        if (!itemForm.code || !itemForm.name) { setError("Kod ve Ad alanları zorunludur"); return; }
        try {
            setIsSubmittingItem(true);
            setError(null);
            const payload: LookupItemDto = {
                categoryId: selectedCategory?.id,
                code: itemForm.code.trim(),
                name: itemForm.name.trim(),
                orderNo: itemForm.orderNo ?? 0,
                isActive: Boolean(itemForm.isActive),
                externalKey: itemForm.externalKey ? itemForm.externalKey.trim() : undefined,
            };
            await api.apiLookupItemsPost(payload as any);
            setItemForm({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
            await fetchItemsByKey(selectedCategory?.key ?? null);
            setItemModalOpen(false);
        } catch (e: any) {
            setError(e?.message || "Öğe oluşturulamadı");
        } finally {
            setIsSubmittingItem(false);
        }
    };

    const filteredCategories = useMemo(() => {
        const q = categoryFilter.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter(c => (c.key || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
    }, [categories, categoryFilter]);

    const pagedCategories = useMemo(() => {
        const start = categoryPage * categoryPageSize;
        return filteredCategories.slice(start, start + categoryPageSize);
    }, [filteredCategories, categoryPage, categoryPageSize]);

    useEffect(() => {
        // Arama değiştiğinde sayfayı başa al
        setCategoryPage(0);
    }, [categoryFilter]);

    const filteredItems = useMemo(() => {
        const q = itemsFilter.trim().toLowerCase();
        if (!q) return items;
        return items.filter(i => (i.code || "").toLowerCase().includes(q) || (i.name || "").toLowerCase().includes(q) || (i.externalKey || "").toLowerCase().includes(q));
    }, [items, itemsFilter]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-semibold text-slate-900">Parametre Yönetimi (Lookup)</div>
                        <div className="text-sm text-slate-500">Kategori ve kategoriye bağlı key-value öğelerini yönetin</div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol: Kategoriler */}
                    <section className="lg:col-span-1">
                        <div className="p-3 rounded-xl border bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-slate-700">Kategoriler</div>
                                <button onClick={() => { setIsEditCat(false); setCatForm({ key: "", description: "", isTenantScoped: false, isReadOnly: false }); setCatModalOpen(true); }} className="h-8 px-3 rounded-md border bg-slate-900 text-white">Yeni</button>
                            </div>
                            <input placeholder="Ara..." value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full h-9 px-3 rounded-md border mb-2" />
                            <div className="space-y-2 max-h-[520px] overflow-auto">
                                {isLoadingCats && <div className="text-sm text-slate-500">Yükleniyor…</div>}
                                {!isLoadingCats && filteredCategories.length === 0 && (
                                    <div className="text-sm text-slate-500">Kategori bulunamadı</div>
                                )}
                                {!isLoadingCats && pagedCategories.map((c) => (
                                    <div key={c.id || c.key!} className={`w-full px-3 py-2 rounded-lg border transition ${selectedCategory?.id === c.id || selectedCategory?.key === c.key ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <button onClick={() => setSelectedCategory(c)} className="text-left flex-1">
                                                <div className="text-sm font-medium">{c.key}</div>
                                                {c.description && <div className="text-xs opacity-70">{c.description}</div>}
                                                <div className="text-[10px] opacity-60 mt-1">Tenant Scoped: {c.isTenantScoped ? "Evet" : "Hayır"} • ReadOnly: {c.isReadOnly ? "Evet" : "Hayır"}</div>
                                            </button>
                                            <div className="shrink-0 flex items-center gap-1">
                                                <button title="Düzenle (API PUT yok)" onClick={() => { setIsEditCat(true); setCatForm({ id: c.id, key: c.key, description: c.description, isTenantScoped: c.isTenantScoped, isReadOnly: c.isReadOnly }); setCatModalOpen(true); }} className="h-7 px-2 text-xs rounded-md border" disabled>
                                                    Düzenle
                                                </button>
                                                <button title="Sil (API DELETE yok)" className="h-7 px-2 text-xs rounded-md border text-rose-600" disabled>
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                                <div>Toplam: {filteredCategories.length}</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCategoryPage((p) => Math.max(0, p - 1))} disabled={categoryPage === 0} className="h-7 px-2 rounded-md border disabled:opacity-50">Önceki</button>
                                    <div>Sayfa {categoryPage + 1} / {Math.max(1, Math.ceil(filteredCategories.length / categoryPageSize))}</div>
                                    <button onClick={() => setCategoryPage((p) => (p + 1 < Math.ceil(filteredCategories.length / categoryPageSize) ? p + 1 : p))} disabled={(categoryPage + 1) >= Math.ceil(filteredCategories.length / categoryPageSize)} className="h-7 px-2 rounded-md border disabled:opacity-50">Sonraki</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sağ: Items */}
                    <section className="lg:col-span-2">
                        <div className="p-3 rounded-xl border bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-sm font-medium text-slate-700">Öğeler</div>
                                    <div className="text-xs text-slate-500">Kategori: {selectedCategory?.key || "-"}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input placeholder="Öğe ara..." value={itemsFilter} onChange={(e) => setItemsFilter(e.target.value)} className="h-9 px-3 rounded-md border" />
                                    <button onClick={() => { setItemForm({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" }); setItemModalOpen(true); }} disabled={!selectedCategory} className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50">Yeni Öğe</button>
                                </div>
                            </div>
                            {isLoadingItems && <div className="text-sm text-slate-500">Yükleniyor…</div>}
                            {!isLoadingItems && filteredItems.length === 0 && (
                                <div className="text-sm text-slate-500">Öğe bulunamadı</div>
                            )}
                            {!isLoadingItems && filteredItems.length > 0 && (
                                <div className="overflow-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="text-left text-slate-500">
                                            <tr>
                                                <th className="py-2 pr-3">Kod</th>
                                                <th className="py-2 pr-3">Ad</th>
                                                <th className="py-2 pr-3">Sıra</th>
                                                <th className="py-2 pr-3">Aktif</th>
                                                <th className="py-2 pr-3">External Key</th>
                                                <th className="py-2 pr-3 text-right">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {filteredItems.map((it) => (
                                                <tr key={it.id || it.code!} className="hover:bg-slate-50">
                                                    <td className="py-2 pr-3 font-medium text-slate-800">{it.code}</td>
                                                    <td className="py-2 pr-3">{it.name}</td>
                                                    <td className="py-2 pr-3">{it.orderNo ?? "-"}</td>
                                                    <td className="py-2 pr-3">{it.isActive ? "Evet" : "Hayır"}</td>
                                                    <td className="py-2 pr-3">{it.externalKey || "-"}</td>
                                                    <td className="py-2 pr-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button title="Düzenle (API PUT yok)" onClick={() => { setIsEditItem(true); setItemForm({ ...it }); setItemModalOpen(true); }} className="h-7 px-2 text-xs rounded-md border" disabled>
                                                                Düzenle
                                                            </button>
                                                            <button title="Sil (API DELETE yok)" className="h-7 px-2 text-xs rounded-md border text-rose-600" disabled>
                                                                Sil
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Modal: Kategori */}
                {isCatModalOpen && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-xl border bg-white shadow-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-slate-900 font-medium">{isEditCat ? "Kategoriyi Düzenle" : "Yeni Kategori"}</div>
                                <button onClick={() => setCatModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                            </div>
                            <div className="space-y-2">
                                <input placeholder="Key (ör. customer-types)" value={catForm.key || ""} onChange={(e) => setCatForm({ ...catForm, key: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                                <input placeholder="Açıklama" value={catForm.description || ""} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(catForm.isTenantScoped)} onChange={(e) => setCatForm({ ...catForm, isTenantScoped: e.target.checked })} /> Tenant Scoped</label>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(catForm.isReadOnly)} onChange={(e) => setCatForm({ ...catForm, isReadOnly: e.target.checked })} /> Read Only</label>
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <button onClick={() => setCatModalOpen(false)} className="h-9 px-3 rounded-md border">İptal</button>
                                    {!isEditCat && <button onClick={onCreateCategory} disabled={isSubmittingCat} className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50">Kaydet</button>}
                                    {isEditCat && <button title="Güncelleme için API PUT gerekli" disabled className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50">Güncelle</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal: Item */}
                {isItemModalOpen && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-xl border bg-white shadow-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-slate-900 font-medium">{isEditItem ? "Öğeyi Düzenle" : "Yeni Öğe"}</div>
                                <button onClick={() => setItemModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs text-slate-500">Kategori: <span className="font-medium text-slate-700">{selectedCategory?.key || "-"}</span></div>
                                <input placeholder="Kod (ör. gold)" value={itemForm.code || ""} onChange={(e) => setItemForm({ ...itemForm, code: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                                <input placeholder="Ad (ör. Gold)" value={itemForm.name || ""} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Sıra No" type="number" value={itemForm.orderNo || 0} onChange={(e) => setItemForm({ ...itemForm, orderNo: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md border" />
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(itemForm.isActive)} onChange={(e) => setItemForm({ ...itemForm, isActive: e.target.checked })} /> Aktif</label>
                                </div>
                                <input placeholder="External Key (opsiyonel)" value={itemForm.externalKey || ""} onChange={(e) => setItemForm({ ...itemForm, externalKey: e.target.value })} className="w-full h-9 px-3 rounded-md border" />
                                <div className="flex gap-2 justify-end pt-2">
                                    <button onClick={() => setItemModalOpen(false)} className="h-9 px-3 rounded-md border">İptal</button>
                                    {!isEditItem && <button onClick={onCreateItem} disabled={!selectedCategory || isSubmittingItem} className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50">Kaydet</button>}
                                    {isEditItem && <button title="Güncelleme için API PUT gerekli" disabled className="h-9 px-3 rounded-md border bg-slate-900 text-white disabled:opacity-50">Güncelle</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
}


