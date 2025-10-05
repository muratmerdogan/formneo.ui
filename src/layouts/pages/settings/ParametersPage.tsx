import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import getConfiguration from "confiuration";
import { LookupApi, LookupCategoryDto, LookupItemDto, LookupModuleDto } from "api/generated";

const ParametersPage = (): JSX.Element => {
    const api = useMemo(() => new LookupApi(getConfiguration()), []);
    // Tenant modu: localStorage'da selectedTenantId varsa tenant modda çalışıyoruz
    const selectedTenantId = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("selectedTenantId") : null), []);
    const isTenantMode = useMemo(() => !!selectedTenantId, [selectedTenantId]);

    const [modules, setModules] = useState<LookupModuleDto[]>([]);
    const [selectedModuleKey, setSelectedModuleKey] = useState<string | undefined>(undefined);
    const selectedModule = useMemo(() => modules.find(m => (m.key || "") === (selectedModuleKey || "")), [modules, selectedModuleKey]);
    const selectedModuleIsGlobal = useMemo(() => !!selectedModule ? !((selectedModule as any)?.tenantId) : false, [selectedModule]);

    const [categories, setCategories] = useState<LookupCategoryDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<LookupCategoryDto | undefined>(undefined);
    const [categoryPage, setCategoryPage] = useState<number>(0);
    const [categoryPageSize] = useState<number>(10);
    const [categoryFilter, setCategoryFilter] = useState<string>("");

    const [items, setItems] = useState<LookupItemDto[]>([]);
    const [itemsFilter, setItemsFilter] = useState<string>("");

    const [formItem, setFormItem] = useState<LookupItemDto>({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // Yeni Modül / Kategori Formları
    const [modForm, setModForm] = useState<LookupModuleDto>({ key: "", name: "", isTenantScoped: false, isReadOnly: false });
    const [isSubmittingModule, setIsSubmittingModule] = useState<boolean>(false);
    const [catForm, setCatForm] = useState<LookupCategoryDto>({ key: "", description: "", isTenantScoped: false, isReadOnly: false });
    const [isSubmittingCategory, setIsSubmittingCategory] = useState<boolean>(false);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState<boolean>(false);
    const [categoryEdit, setCategoryEdit] = useState<LookupCategoryDto | undefined>(undefined);

    const [isLoadingModules, setIsLoadingModules] = useState<boolean>(false);
    const [isLoadingCats, setIsLoadingCats] = useState<boolean>(false);
    const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
    const [isSubmittingItem, setIsSubmittingItem] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);

    const fetchModules = async () => {
        setIsLoadingModules(true);
        setError(null);
        try {
            const res: any = await api.apiLookupModulesGet();
            const mods = (res?.data || []) as LookupModuleDto[];
            if (mods && mods.length > 0) {
                setModules(mods);
                if (!selectedModuleKey) setSelectedModuleKey(mods[0]?.key || undefined);
                return;
            }
            // Fallback: kategorilerden moduleId türet
            const catsRes: any = await api.apiLookupCategoriesGet();
            const catsData = (catsRes?.data || []) as LookupCategoryDto[];
            const keys = Array.from(new Set((catsData || []).map(c => (c.moduleId || "").trim()).filter(Boolean)));
            const derived = keys.map(k => ({ key: k, name: k })) as LookupModuleDto[];
            setModules(derived);
            if (!selectedModuleKey && derived.length > 0) setSelectedModuleKey(derived[0].key || undefined);
        } catch (e: any) {
            setError(e?.message || "Modüller yüklenirken hata oluştu");
        } finally {
            setIsLoadingModules(false);
        }
    };

    const fetchCategories = async (moduleKey?: string) => {
        setIsLoadingCats(true);
        setError(null);
        try {
            const res: any = await api.apiLookupCategoriesGet(moduleKey);
            const data = (res?.data || []) as LookupCategoryDto[];
            setCategories(data);
            if (!selectedCategory && data.length > 0) setSelectedCategory(data[0]);
            if (selectedCategory && !data.find(d => d.id === selectedCategory.id)) setSelectedCategory(data[0]);
            setCategoryPage(0);
        } catch (e: any) {
            setError(e?.message || "Kategoriler yüklenirken hata oluştu");
        } finally {
            setIsLoadingCats(false);
        }
    };

    const fetchItemsByKey = async (key?: string | null) => {
        setIsLoadingItems(true);
        setError(null);
        try {
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

    const onSubmitModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingModule(true);
        setError(null);
        try {
            if (!(modForm.key || "").trim() || !(modForm.name || "").trim()) {
                throw new Error("Modül için Key ve Ad zorunludur");
            }
            const payload: LookupModuleDto = {
                key: (modForm.key || "").trim(),
                name: (modForm.name || "").trim(),
                isTenantScoped: !!modForm.isTenantScoped,
                isReadOnly: !!modForm.isReadOnly,
            };
            await api.apiLookupModulesPost(payload);
            setModForm({ key: "", name: "", isTenantScoped: false, isReadOnly: false });
            await fetchModules();
            if (payload.key) setSelectedModuleKey(payload.key);
            setIsModuleModalOpen(false);
        } catch (e: any) {
            setError(e?.message || "Modül eklenirken hata oluştu");
        } finally {
            setIsSubmittingModule(false);
        }
    };

    const onSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModule?.id) { setError("Kategori eklemek için geçerli bir modül (ID) seçin"); return; }
        setIsSubmittingCategory(true);
        setError(null);
        try {
            if (!(catForm.key || "").trim() || !(catForm.description || "").trim()) {
                throw new Error("Kategori için Key ve Açıklama zorunludur");
            }
            const payload: LookupCategoryDto = {
                key: (catForm.key || "").trim(),
                description: (catForm.description || "").trim(),
                isTenantScoped: !!catForm.isTenantScoped,
                isReadOnly: !!catForm.isReadOnly,
                moduleId: selectedModule.id,
            };
            await api.apiLookupCategoriesPost(payload);
            setCatForm({ key: "", description: "", isTenantScoped: false, isReadOnly: false });
            await fetchCategories(selectedModuleKey);
            setIsCategoryModalOpen(false);
        } catch (e: any) {
            setError(e?.message || "Kategori eklenirken hata oluştu");
        } finally {
            setIsSubmittingCategory(false);
        }
    };

    const onSubmitCategoryUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryEdit?.id) return;
        setIsSubmittingCategory(true);
        setError(null);
        try {
            const payload: LookupCategoryDto = {
                key: categoryEdit.key,
                description: (categoryEdit.description || "").trim(),
                isTenantScoped: !!categoryEdit.isTenantScoped,
                isReadOnly: !!categoryEdit.isReadOnly,
                moduleId: categoryEdit.moduleId,
            };
            await api.apiLookupCategoriesIdPut(categoryEdit.id, payload);
            await fetchCategories(selectedModuleKey);
            setIsCategoryEditModalOpen(false);
        } catch (e: any) {
            setError(e?.message || "Kategori güncellenirken hata oluştu");
        } finally {
            setIsSubmittingCategory(false);
        }
    };

    useEffect(() => { fetchModules(); }, []);
    useEffect(() => { fetchCategories(selectedModuleKey); }, [selectedModuleKey]);
    useEffect(() => { fetchItemsByKey(selectedCategory?.key ?? null); }, [selectedCategory?.key]);

    const filteredItems = useMemo(() => {
        const q = itemsFilter.trim().toLowerCase();
        if (!q) return items;
        return items.filter(i => (i.code || "").toLowerCase().includes(q) || (i.name || "").toLowerCase().includes(q) || (i.externalKey || "").toLowerCase().includes(q));
    }, [items, itemsFilter]);

    const filteredCategories = useMemo(() => {
        const q = categoryFilter.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter(c => (c.description || "").toLowerCase().includes(q) || (c.key || "").toLowerCase().includes(q));
    }, [categories, categoryFilter]);

    const pagedCategories = useMemo(() => {
        const start = categoryPage * categoryPageSize;
        const end = start + categoryPageSize;
        return filteredCategories.slice(start, end);
    }, [filteredCategories, categoryPage, categoryPageSize]);

    const canPrevCat = categoryPage > 0;
    const canNextCat = (categoryPage + 1) * categoryPageSize < filteredCategories.length;

    const resetForm = () => {
        setFormItem({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
        setIsEdit(false);
    };

    const onEditItem = (it: LookupItemDto) => {
        setFormItem({
            id: it.id,
            categoryId: it.categoryId || selectedCategory?.id,
            code: it.code || "",
            name: it.name || "",
            orderNo: typeof it.orderNo === "number" ? it.orderNo : 0,
            isActive: typeof it.isActive === "boolean" ? it.isActive : true,
            externalKey: it.externalKey || "",
        });
        setIsEdit(true);
        setIsItemModalOpen(true);
    };

    const onDeleteItem = async (it: LookupItemDto) => {
        if (!it.id) return;
        try {
            await api.apiLookupItemsIdDelete(it.id);
            await fetchItemsByKey(selectedCategory?.key ?? null);
        } catch (e: any) {
            setError(e?.message || "Öğe silinirken hata oluştu");
        }
    };

    const onSubmitItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory?.id) return;
        setIsSubmittingItem(true);
        setError(null);
        try {
            const payload: LookupItemDto = {
                id: formItem.id,
                categoryId: selectedCategory.id,
                code: (formItem.code || "").trim(),
                name: (formItem.name || "").trim(),
                orderNo: typeof formItem.orderNo === "number" ? formItem.orderNo : 0,
                isActive: typeof formItem.isActive === "boolean" ? formItem.isActive : true,
                externalKey: (formItem.externalKey || "").trim() || null,
            };

            if (isEdit && payload.id) {
                await api.apiLookupItemsIdPut(payload.id, payload);
            } else {
                await api.apiLookupItemsPost(payload);
            }

            await fetchItemsByKey(selectedCategory?.key ?? null);
            resetForm();
        } catch (e: any) {
            setError(e?.message || "Öğe kaydedilirken hata oluştu");
        } finally {
            setIsSubmittingItem(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-semibold text-slate-900">Parametre Yönetimi</div>
                        <div className="text-sm text-slate-500">Modül → Kategori → Öğe yönetimi</div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol Panel: Modül ve Kategori */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">Modül Seç</div>
                                <div className="flex items-center gap-2">
                                    {selectedModule?.id && (
                                        <button
                                            onClick={() => {
                                                if (isTenantMode && selectedModuleIsGlobal) { return; }
                                                if (window.confirm("Seçili modül silinsin mi?")) {
                                                    api.apiLookupModulesIdDelete(selectedModule.id)
                                                        .then(() => {
                                                            fetchModules();
                                                            setCategories([]);
                                                            setSelectedCategory(undefined);
                                                        })
                                                        .catch((e: any) => setError(e?.message || "Modül silinirken hata oluştu"));
                                                }
                                            }}
                                            disabled={isTenantMode && selectedModuleIsGlobal}
                                            className="h-8 px-2 rounded-md border bg-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Modülü Sil
                                        </button>
                                    )}
                                    <button onClick={() => setIsModuleModalOpen(true)} className="h-8 px-2 rounded-md border bg-white">Yeni Modül</button>
                                </div>
                            </div>
                            <select
                                value={selectedModuleKey || ""}
                                onChange={(e) => setSelectedModuleKey(e.target.value || undefined)}
                                className="w-full h-10 px-3 rounded-md border bg-white"
                                disabled={isLoadingModules}
                            >
                                {modules.length === 0 && <option value="">Modül bulunamadı</option>}
                                {modules.map((m) => {
                                    const isGlobal = !((m as any)?.tenantId);
                                    const label = `${m.name || m.key}${isGlobal ? " (Global)" : ""}`;
                                    return (
                                        <option key={(m.id || m.key || Math.random()).toString()} value={m.key || ""}>{label}</option>
                                    );
                                })}
                            </select>
                            <div className="flex justify-end pt-1">
                                <button onClick={() => setIsModuleModalOpen(true)} className="h-8 px-2 rounded-md border bg-white">Yeni Modül</button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">Kategoriler</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsCategoryModalOpen(true)} className="h-8 px-2 rounded-md border bg-white">Yeni Kategori</button>
                                </div>
                            </div>
                            <div>
                                <input value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCategoryPage(0); }} className="w-full h-8 px-2 rounded-md border" placeholder="Ara: kategori adı veya key" />
                            </div>
                            <div className="space-y-1">
                                {isLoadingCats && <div className="text-sm text-slate-500">Kategoriler yükleniyor…</div>}
                                {!isLoadingCats && (pagedCategories || []).map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`w-full text-left px-3 py-2 rounded-md border cursor-pointer ${selectedCategory?.id === c.id ? "bg-slate-900 text-white" : "bg-white"}`}
                                        role="button"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium">{c.description || c.key}</div>
                                                {c.key && <div className="text-xs opacity-70">{c.key}</div>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setCategoryEdit(c); setIsCategoryEditModalOpen(true); }} className="h-7 px-2 rounded-md border bg-white text-slate-700 hover:bg-slate-50">Düzenle</button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!c.id) return;
                                                        if (!window.confirm("Kategori silinsin mi?")) return;
                                                        api.apiLookupCategoriesIdDelete(c.id)
                                                            .then(() => {
                                                                fetchCategories(selectedModuleKey);
                                                                if (selectedCategory?.id === c.id) {
                                                                    setSelectedCategory(undefined);
                                                                    setItems([]);
                                                                }
                                                            })
                                                            .catch((err: any) => setError(err?.message || "Kategori silinirken hata oluştu"));
                                                    }}
                                                    className="h-7 px-2 rounded-md border bg-rose-600 text-white"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!isLoadingCats && categories.length === 0 && (
                                    <div className="text-sm text-slate-500">Bu modülde kategori bulunamadı</div>
                                )}
                            </div>
                            {/* Kategori Sayfalama */}
                            {!isLoadingCats && filteredCategories.length > categoryPageSize && (
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-xs text-slate-600">{filteredCategories.length} kayıt</div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="h-8 px-2 rounded-md border bg-white disabled:opacity-50"
                                            onClick={() => canPrevCat && setCategoryPage(categoryPage - 1)}
                                            disabled={!canPrevCat}
                                        >
                                            Önceki
                                        </button>
                                        <div className="text-xs text-slate-700">
                                            {categoryPage + 1} / {Math.ceil(filteredCategories.length / categoryPageSize)}
                                        </div>
                                        <button
                                            className="h-8 px-2 rounded-md border bg-white disabled:opacity-50"
                                            onClick={() => canNextCat && setCategoryPage(categoryPage + 1)}
                                            disabled={!canNextCat}
                                        >
                                            Sonraki
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Sağ Panel: Öğeler ve Form */}
                    <main className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-semibold">{selectedCategory?.description || selectedCategory?.key || "Öğeler"}</div>
                                <div className="text-sm text-slate-500">Kategoriye bağlı key-value öğeleri yönetin</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { resetForm(); setIsItemModalOpen(true); }} className="h-9 px-3 rounded-md border bg-white">Yeni</button>
                            </div>
                        </div>

                        {/* Öğe Formu Modal ile */}
                        {isItemModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/30" onClick={() => setIsItemModalOpen(false)} />
                                <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-2xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-base font-semibold">{isEdit ? "Öğe Düzenle" : "Yeni Öğe"}</div>
                                        <button onClick={() => setIsItemModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                                    </div>
                                    <form onSubmit={onSubmitItem} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                        <div className="md:col-span-2">
                                            <div className="text-xs text-slate-600 mb-1">Kod</div>
                                            <input value={formItem.code || ""} onChange={(e) => setFormItem({ ...formItem, code: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Kod" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="text-xs text-slate-600 mb-1">Ad</div>
                                            <input value={formItem.name || ""} onChange={(e) => setFormItem({ ...formItem, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Ad" />
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="text-xs text-slate-600 mb-1">Sıra No</div>
                                            <input type="number" value={formItem.orderNo || 0} onChange={(e) => setFormItem({ ...formItem, orderNo: Number(e.target.value) || 0 })} className="w-full h-9 px-3 rounded-md border" placeholder="0" />
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="text-xs text-slate-600 mb-1">Aktif</div>
                                            <div className="h-9 flex items-center">
                                                <input id="isActive" type="checkbox" checked={!!formItem.isActive} onChange={(e) => setFormItem({ ...formItem, isActive: e.target.checked })} className="mr-2" />
                                                <label htmlFor="isActive" className="text-sm">Aktif</label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="text-xs text-slate-600 mb-1">External Key</div>
                                            <input value={formItem.externalKey || ""} onChange={(e) => setFormItem({ ...formItem, externalKey: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Opsiyonel" />
                                        </div>
                                        <div className="md:col-span-6 flex items-center justify-end gap-2 mt-2">
                                            <button type="button" onClick={() => setIsItemModalOpen(false)} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                                            <button type="submit" disabled={isSubmittingItem || !selectedCategory} className="h-9 px-3 rounded-md border bg-slate-900 text-white">{isEdit ? "Güncelle" : "Ekle"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Öğe Filtre ve Liste */}
                        <div className="flex items-center justify-between">
                            <input
                                value={itemsFilter}
                                onChange={(e) => setItemsFilter(e.target.value)}
                                className="w-full md:w-80 h-9 px-3 rounded-md border"
                                placeholder="Ara: kod / ad / external key"
                            />
                        </div>

                        {isLoadingItems && <div className="text-sm text-slate-500">Öğeler yükleniyor…</div>}
                        {!isLoadingItems && (
                            <div className="overflow-auto border rounded-md">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left px-3 py-2 border-b">Kod</th>
                                            <th className="text-left px-3 py-2 border-b">Ad</th>
                                            <th className="text-left px-3 py-2 border-b">Sıra</th>
                                            <th className="text-left px-3 py-2 border-b">Durum</th>
                                            <th className="text-left px-3 py-2 border-b">External Key</th>
                                            <th className="text-right px-3 py-2 border-b">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.map((it) => {
                                            const isGlobal = !(it as any)?.tenantId; // tenantId yoksa global kabul et
                                            const actionsDisabled = isTenantMode && isGlobal;
                                            return (
                                                <tr key={it.id || `${it.code}-${it.name}`} className="odd:bg-white even:bg-slate-50">
                                                    <td className="px-3 py-2 border-b">{it.code}</td>
                                                    <td className="px-3 py-2 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <span>{it.name}</span>
                                                            {isGlobal && (
                                                                <span className="text-[10px] px-2 py-0.5 rounded border bg-slate-100 text-slate-700">Global</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border-b">{typeof it.orderNo === "number" ? it.orderNo : ""}</td>
                                                    <td className="px-3 py-2 border-b">{it.isActive ? "Aktif" : "Pasif"}</td>
                                                    <td className="px-3 py-2 border-b">{it.externalKey}</td>
                                                    <td className="px-3 py-2 border-b text-right">
                                                        <button
                                                            onClick={() => { if (!actionsDisabled) onEditItem(it); }}
                                                            disabled={actionsDisabled}
                                                            className="h-8 px-2 rounded-md border bg-white mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Düzenle
                                                        </button>
                                                        <button
                                                            onClick={() => { if (!actionsDisabled) onDeleteItem(it); }}
                                                            disabled={actionsDisabled}
                                                            className="h-8 px-2 rounded-md border bg-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Sil
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {!filteredItems.length && (
                                            <tr>
                                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">Öğe bulunamadı</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {/* Modals */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsModuleModalOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Yeni Modül</div>
                            <button onClick={() => setIsModuleModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        <form onSubmit={onSubmitModule} className="space-y-2">
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Key</div>
                                <input value={modForm.key || ""} onChange={(e) => setModForm({ ...modForm, key: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="module-key" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Ad</div>
                                <input value={modForm.name || ""} onChange={(e) => setModForm({ ...modForm, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Modül adı" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!modForm.isTenantScoped} onChange={(e) => setModForm({ ...modForm, isTenantScoped: e.target.checked })} /> Tenant Scoped</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!modForm.isReadOnly} onChange={(e) => setModForm({ ...modForm, isReadOnly: e.target.checked })} /> Readonly</label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModuleModalOpen(false)} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                                <button type="submit" disabled={isSubmittingModule} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsCategoryModalOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Yeni Kategori</div>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        <form onSubmit={onSubmitCategory} className="space-y-2">
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Key</div>
                                <input value={catForm.key || ""} onChange={(e) => setCatForm({ ...catForm, key: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="category-key" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Açıklama</div>
                                <input value={catForm.description || ""} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Kategori açıklaması" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!catForm.isTenantScoped} onChange={(e) => setCatForm({ ...catForm, isTenantScoped: e.target.checked })} /> Tenant Scoped</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!catForm.isReadOnly} onChange={(e) => setCatForm({ ...catForm, isReadOnly: e.target.checked })} /> Readonly</label>
                            </div>
                            {!selectedModule?.id && (
                                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">Kategori oluşturmak için ID içeren bir modül seçin.</div>
                            )}
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                                <button type="submit" disabled={isSubmittingCategory || !selectedModule?.id} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isCategoryEditModalOpen && categoryEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsCategoryEditModalOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Kategori Düzenle</div>
                            <button onClick={() => setIsCategoryEditModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        <form onSubmit={onSubmitCategoryUpdate} className="space-y-2">
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Key</div>
                                <input value={categoryEdit.key || ""} disabled className="w-full h-9 px-3 rounded-md border bg-slate-100" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Açıklama</div>
                                <input value={categoryEdit.description || ""} onChange={(e) => setCategoryEdit({ ...categoryEdit, description: e.target.value } as any)} className="w-full h-9 px-3 rounded-md border" placeholder="Kategori açıklaması" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!categoryEdit.isTenantScoped} onChange={(e) => setCategoryEdit({ ...categoryEdit, isTenantScoped: e.target.checked } as any)} /> Tenant Scoped</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!categoryEdit.isReadOnly} onChange={(e) => setCategoryEdit({ ...categoryEdit, isReadOnly: e.target.checked } as any)} /> Readonly</label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCategoryEditModalOpen(false)} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                                <button type="submit" disabled={isSubmittingCategory} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </DashboardLayout>
    );
};

export default ParametersPage;

